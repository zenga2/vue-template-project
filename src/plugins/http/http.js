import ajax from './ajax'
import InterceptorManager from './interceptor-manager'
import DEFAULT_OPTS from './default-opts'
import Cancel from './cancel'

export default class Http {
  constructor (opts) {
    this.defaultOpts = Object.assign({}, DEFAULT_OPTS, opts)
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    }
  }

  request (url, options) {
    let requestOpts = Object.assign({url}, this.defaultOpts, options)

    let dispatchRequest = (opts) => {
      opts = opts.transformRequest(opts)

      return ajax(opts).then(
        response => opts.transformResponse(response),
        error => Promise.reject(error)
      )
    }

    let promise = Promise.resolve(requestOpts)
    let chain = [dispatchRequest, undefined]

    // request拦截器先配置先执行
    this.interceptors.request.reverse().forEach(interceptor => {
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

  get (url, opts) {
    this.request(url, opts)
  }

  post (url, data, opts) {
    opts.body = data
    this.request(url, opts)
  }

  createCancel () {
    return new Cancel()
  }
}
