import { addDataToUrl, serialize } from '../../common/utils/urlUtils'
import { isObject } from '../../common/utils/typeUtils'

const contentTypeMap = {
  urlencoded: 'application/x-www-form-urlencoded;charset=utf-8',
  json: 'application/json;charset=utf-8',
  text: 'text/plain;charset=utf-8'
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

export default {
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
