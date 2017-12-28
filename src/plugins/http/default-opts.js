import {addDataToUrl, serialize} from '../../common/utils/urlUtils'
import createError from './create-error'
import {isPlainObject} from '../../common/utils/typeUtils'
import {each} from '../../common/utils/utils'

const contentTypeMap = {
  urlencoded: 'application/x-www-form-urlencoded;charset=utf-8',
  json: 'application/json;charset=utf-8',
  text: 'text/plain;charset=utf-8'
}

function preDealRequest(opts) {
  let {url, method, params} = opts
  method = method.toLowerCase()

  switch (method) {
    case 'get':
      opts.url = addDataToUrl(url, params)
      break
    case 'post':
      dealPostRequest(opts)
      break
  }
}

function dealPostRequest(opts) {
  let body = opts.body

  if (opts.headers['Content-Type']) return

  switch (opts.requestType) {
    case 'urlencoded':
      opts.headers['Content-Type'] = contentTypeMap.urlencoded
      opts.body = serialize(body)
      break
    case 'json':
      opts.headers['Content-Type'] = contentTypeMap.json
      if (isPlainObject(body)) {
        opts.body = JSON.stringify(body)
      }
      break
    case 'text':
      opts.headers['Content-Type'] = contentTypeMap.text
      break
    case 'formData':
      if (isPlainObject(body)) {
        let formData = new FormData()
        each(body, (value, key) => {
          formData.append(key, value)
        })
        opts.body = formData
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
  // timeout
  // withCredentials
  // cancel
  transformRequest(opts) {
    console.log('transformRequest')
    preDealRequest(opts)
    return opts
  },
  transformResponse(response) {
    console.log('transformResponse')
    try {
      let data = response.data

      if (typeof data === 'string') {
        response.data = JSON.parse(data)
      }
    } catch (e) {
      response = Promise.reject(
        createError('dataError', 'Data error', response.opts)
      )
    }

    return response
  }
}
