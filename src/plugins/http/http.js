import ajax from './ajax'
import InterceptorManager from './interceptor-manager'
import DEFAULT_OPTS from './default-opts'
import Cancel from './cancel'
import {isPlainObject} from '../../common/utils/typeUtils'

export default class Http {
  constructor(opts) {
    this.defaultOpts = Object.assign({}, DEFAULT_OPTS, opts)
    this.defaultOpts = dealOpts(this.defaultOpts)
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    }
  }

  request(url, options) {
    let requestOpts = Object.assign({url}, this.defaultOpts, options)
    requestOpts = dealOpts(requestOpts)

    let dispatchRequest = (opts) => {
      // transform request options
      opts = opts.transformRequest(opts)

      console.log('dispatchRequest')
      return ajax(opts).then(
        // transform response data
        response => opts.transformResponse(response),
        error => Promise.reject(error)
      )
    }

    let dealOptionsError = () => {
      console.log('dealOptionsError')
      return Promise.reject({
        errorType: 'dealOptionsError',
        desc: 'Deal options error before dispatch request',
        opts: requestOpts
      })
    }

    let promise = new Promise((resolve) => {
      if ('await' in requestOpts) {
        // await opts.await ms
        setTimeout(() => {
          resolve(requestOpts)
        }, requestOpts.await)
      } else {
        resolve(requestOpts)
      }
    })
    let chain = [dispatchRequest, dealOptionsError]

    // request拦截器先配置先执行
    this.interceptors.request.forEachAfterReverse(interceptor => {
      chain.unshift(interceptor.fulfilled, interceptor.rejected)
    })

    // response拦截器先配置先执行
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor.fulfilled, interceptor.rejected)
    })

    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift())
    }

    return promise
  }

  // 数据配置在param
  get(url, opts = {}) {
    opts.method = 'GET'
    return this.request(url, opts)
  }

  // 数据配置在body
  post(url, opts = {}) {
    opts.method = 'POST'
    return this.request(url, opts)
  }

  static createCancel() {
    return new Cancel()
  }
}

// deal props: params body headers
function dealOpts(opts) {
  opts.params = Object.assign({}, opts.params)
  opts.headers = Object.assign({}, opts.headers)
  if (isPlainObject(opts.body)) {
    opts.body = Object.assign({}, opts.body)
  }

  return opts
}
