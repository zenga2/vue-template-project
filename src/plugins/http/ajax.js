import createError from './create-error'
import Cancel from './cancel'
import { each } from '../../common/utils/utils'

// only support get and post method
// errorType: timeoutError abortError networkError applicationError
export default function ajax(opts) {
  return new Promise((resolve, reject) => {
    // detecting network status
    if (typeof window !== 'undefined'
      && !!window.navigator
      && 'onLine' in window.navigator
      && window.navigator.onLine === false) {
      reject({
        errorType: 'offlineError',
        desc: 'offline error',
        opts
      })

      return
    }

    // init
    let xhr = opts.xhr = new XMLHttpRequest()
    let {url, method, headers, body} = opts

    // open
    xhr.open(method, url, true)

    // set request headers
    each(headers, (value, key) => {
      xhr.setRequestHeader(key, value)
    })

    // set props
    if (opts.timeout) {
      xhr.timeout = opts.timeout
    }
    if (opts.withCredentials) {
      xhr.withCredentials = true
    }

    // init event
    initEvent(opts, resolve, reject)

    // cancel request handle
    if (opts.cancel instanceof Cancel) {
      opts.cancel.setXhr(xhr, reject, opts)
    }

    // send data
    xhr.send(body)
  })
}

// init event
function initEvent(opts, resolve, reject) {
  let {xhr, onUploadProgress} = opts

  if (typeof onUploadProgress === 'function' && xhr.upload) {
    xhr.upload.onprogress = onUploadProgress
  }

  xhr.ontimeout = () => {
    reject(createError('timeoutError', 'Timeout error', opts))
  }

  xhr.onabort = () => {
    reject(createError('abortError', 'Abort error', opts))
  }

  xhr.onerror = () => {
    reject(createError('networkError', 'Network error', opts))
  }

  xhr.onload = () => handle(opts, resolve, reject)

  xhr.onloadend = () => {
    if (opts.cancel instanceof Cancel) {
      opts.cancel.clear()
    }
  }
}

function handle(opts, resolve, reject) {
  let xhr = opts.xhr

  if (xhr.status >= 200 && xhr.status < 300) {
    resolve({
      data: xhr.response,
      status: xhr.status,
      statusText: xhr.statusText,
      opts
    })
  } else {
    reject(createError('applicationError', 'Application level error', opts))
  }
}
