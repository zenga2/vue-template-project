import ajax from './ajax'
import InterceptorManager from './interceptor-manager'
import DEFAULT_OPTS from './default-opts'
import Cancel from './cancel'
import { deepClone } from '../../common/utils/utils'

export default class Http {
  constructor (opts) {
    this.defaultOpts = Object.assign({}, DEFAULT_OPTS, opts)
    this.defaultOpts = dealOpts(this.defaultOpts)
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    }
  }

  request (url, options) {
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
        desc: 'Deal options error before exe request',
        opts: requestOpts
      })
    }

    let promise = Promise.resolve(requestOpts)
    let chain = [dispatchRequest, dealOptionsError]

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

  static createCancel () {
    return new Cancel()
  }
}

function dealOpts (originalOpts) {
  let opts = deepClone(originalOpts)

  let fnProps = ['transformRequest', 'transformResponse']
  fnProps.forEach(prop => opts[prop] = originalOpts[prop])

  return opts
}