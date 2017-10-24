// only support get and post method
// errorType: timeoutError abortError networkError applicationError
export default function ajax (opts) {
  return new Promise((resolve, reject) => {
    // init
    let xhr = new XMLHttpRequest()
    let {url, method, headers, body} = opts

    // open
    xhr.open(method, url, true)

    // set request headers
    for (let [key, value] of headers) {
      xhr.setRequestHeader(key, value)
    }

    // set props
    if (opts.timeout) {
      xhr.timeout = opts.timeout
    }
    if (opts.withCredentials) {
      xhr.withCredentials = true
    }

    // init event
    initEvent(xhr, resolve, reject)

    // send data
    xhr.send(body)
  })
}

// init event
function initEvent (xhr, resolve, reject) {
  xhr.ontimeout = () => {
    reject(createError('timeoutError', 'Timeout error', xhr))
  }

  xhr.onabort = () => {
    reject(createError('abortError', 'Abort error', xhr))
  }

  xhr.onerror = () => {
    reject(createError('networkError', 'Network error', xhr))
  }

  xhr.onload = () => handle(xhr, resolve, reject)
}

function handle (xhr, resolve, reject) {
  if (xhr.status >= 200 && xhr.status < 300) {
    resolve({
      data: xhr.response,
      status: xhr.status,
      statusText: xhr.statusText,
      xhr
    })
  } else {
    reject(createError('applicationError', 'Application level error', xhr))
  }
}

function createError (errorType, desc, xhr) {
  return {
    errorType, desc,
    status: xhr.status,
    statusText: xhr.statusText,
    xhr
  }
}
