import ajax from './ajax'
import { addDataToUrl, serialize } from '../../common/utils/urlUtils'
import InterceptorManager from './interceptor-manager'
import { isObject } from '../../common/utils/typeUtils'

const contentTypeMap = {
  urlencoded: 'application/x-www-form-urlencoded;charset=utf-8',
  json: 'application/json;charset=utf-8',
  text: 'text/plain;charset=utf-8'
}

const DEFAULT_OPTS = {
  method: 'POST',
  requestType: 'urlencoded',
  params: {},
  headers: {},
  body: null,
  transformRequest (opts) {
    preDealRequest(opts)
    return opts
  },
  transformResponse (response) {
    try {
      let data = response.data

      if (typeof data === 'string') {
        response.data = JSON.parse(data)
      }
    } catch (e) {
      response = Promise.reject({
        errorType: 'dataError',
        desc: 'Data error',
      })
    }

    return response
  }
}

export default class Fetch {
  constructor (opts) {
    this.defaultOpts = Object({}, DEFAULT_OPTS, opts)
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    }

    // 预处理request
    this.interceptors.request.use(opts => {
      return transformRequest(opts)
    })

    // 预处理response
    this.interceptors.response.use(response => {
      return transformResponse(response)
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

function preDealRequest (opts) {
  let {url, method, params, body} = opts
  method = method.toLowerCase()

  switch (method) {
    case 'get':
      opts.url = addDataToUrl(url, params)
      break
    case 'post':
      if (opts.headers['Content-Type']) return

      let requestType = opts.requestType
      if (requestType === 'urlencoded') {
        opts.headers['Content-Type'] = contentTypeMap.urlencoded
        opts.body = serialize(body)
        return
      }

      if (requestType === 'json') {
        opts.headers['Content-Type'] = contentTypeMap.json
        if (isObject(body)) {
          opts.body = JSON.stringify(body)
        }
        return
      }

      if (requestType === 'text') {
        opts.headers['Content-Type'] = contentTypeMap.text
      }
      break
  }
}
