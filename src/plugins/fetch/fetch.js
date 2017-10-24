import ajax from './ajax'
import InterceptorManager from './interceptor-manager'
import DEFAULT_OPTS from './default-opts'

export default class Fetch {
  constructor (opts) {
    this.defaultOpts = Object({}, DEFAULT_OPTS, opts)
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    }

    // 预处理request
    this.interceptors.request.use(opts => {
      return opts.transformRequest(opts)
    })

    // 预处理response
    this.interceptors.response.use(response => {
      return opts.transformResponse(response)
    })
  }

  request (url, options) {
    let opts = Object.assign({url}, this.defaultOpts, options)

    let promise = Promise.resolve(opts)
    let chain = [ajax, undefined]

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
}
