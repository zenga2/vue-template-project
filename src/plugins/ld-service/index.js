import Http from '../http'
import serviceConfig from '../../service.config'
import globalConfig from '../../global.config'
import { each } from '../../common/utils/utils'
import Vue from 'vue'

const http = new Http()

// ajax开始前的处理
http.interceptors.request.use(opts => {
  log('request-1')
  // 在每次请求前给url添加公共的query参数
  let commonParam = {}

  if (opts.needAccessToken !== false) {
    commonParam.loginToken = Vue.ldUtils.getAccessToken()
  }
  Object.assign(opts.body, commonParam)

  // 开启等待层
  if (opts.isShowLoading !== false) {
    Vue.ldUtils.loading.show()
  }

  return opts
})

// ajax完成后的处理(包含出错)
http.interceptors.response.use(
  response => {
    log('response-1-s')
    dealLoading(response.opts)

    return response
  },
  error => {
    log('response-1-e')
    dealLoading(error.opts)

    return Promise.reject(error)
  }
)

function dealLoading (opts) {
  if (opts.isLast !== false) {
    // 关闭等待层
    Vue.ldUtils.loading.hide()
  }
}

// 处理返回的数据
http.interceptors.response.use(dealSuccess, dealError)

// 需要重新登录的错误码列表
const needReLoginResultArr = []

function dealSuccess (response) {
  log('response-2-s')
  let data = response.data
  let {result, msg} = data

  if (needReLoginResultArr.indexOf(result) > -1) {
    Vue.ldUtils.alert({
      content: '请重新登录',
      onOk: () => Vue.router.replace('/login')
    })

    return Promise.reject()
  }

  // 处理调接口出错的情形
  if (result === -1) {
    Vue.ldUtils.alert(msg)
    return Promise.reject()
  }

  return response.data
}

function dealError (error) {
  log('response-2-e')
  let tipStr = ''

  switch (error.errorType) {
    case 'offlineError':
      tipStr = '网络中断'
      break
    case 'dealOptionsError':
      tipStr = '请求参数错误'
      break
    case 'networkError':
      tipStr = '网络异常'
      break
    case 'timeoutError':
      tipStr = '访问超时'
      break
    case 'abortError':
      tipStr = '连接中断'
      break
    case 'applicationError':
      tipStr = '服务器异常'
      break
    case 'dataError':
      tipStr = '数据格式错误'
      break
    default:
      tipStr = '未知错误'
  }

  console.error(error)
  Vue.ldUtils.toast(tipStr)
  return Promise.reject()
}

const ldService = {
  // 等所有service调用都返回成功后，才会执行回调函数
  runAll (opts) {
    let pList = []
    let fnArr = []

    // Object.keys中字符串key是按赋值的先后顺序排序的
    // 但数字key是按大小升序排序的,同时数字key排在字符串key前面
    each(opts, (val, serviceKey) => {
      if (typeof val === 'function') {
        pList.push(this[serviceKey](undefined, {isLast: false}))
        fnArr.push(val)
      } else {
        val.opts = val.opts || {}
        val.opts.isLast = false
        pList.push(this[serviceKey](val.data, val.opts))
        fnArr.push(val.success)
      }
    })

    return Promise.all(pList).then(results => {
      Vue.ldUtils.loading.hide()

      fnArr.forEach((fn, index) => {
        fn(results[index])
      })
    })
  }
}

const createService = url =>
  (data = {}, opts = {}) => {
    if (opts.url) {
      url = opts.url
    }

    if (typeof opts.method === 'string'
      && opts.method.toLowerCase() === 'get') {
      opts.params = data
    } else {
      opts.body = data
    }

    return http.request(url, opts)
  }

// 生成各服务方法
each(serviceConfig.service, function (action, method) {
  let url = globalConfig.uriStr + action
  ldService[method] = createService(url)
})

export default {
  install (Vue) {
    Vue.ldService = Vue.prototype.$ldService = ldService
  }
}
