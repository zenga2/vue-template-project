import Http from '../http'
import serviceConfig from '../../service.config'
import globalConfig from '../../global.config'
import {each} from '../../common/utils/utils'
import Vue from 'vue'

const http = new Http()

function log(msg) {
  console.log(msg)
}

// ajax开始前的处理
http.interceptors.request.use(opts => {
  log('request-1')
  // 在每次请求前给url添加公共的query参数
  let commonParam = {}

  if (opts.needAccessToken !== false) {
    commonParam.access_token = Vue.ldUtils.getAccessToken()
    // 判断是否已登录
    if (!commonParam.access_token) {
      reLogin()
      return
    }
  }
  Object.assign(opts.body, commonParam)

  // 开启等待层
  toggleLoading(opts, true)

  return opts
})

// ajax完成后的处理(包含出错)
http.interceptors.response.use(
  response => {
    log('response-1-s')
    toggleLoading(response.opts, false)

    return response
  },
  error => {
    log('response-1-e')
    toggleLoading(error.opts, false)

    return Promise.reject(error)
  }
)

// flag  true: show  false: hide
function toggleLoading(opts, flag) {
  if (opts.isShowLoading === false) return

  // set text
  let loadingText = opts.loadingText || '加载中'
  Vue.ldUtils.loading.setText(loadingText)

  // show
  if (flag) {
    Vue.ldUtils.loading.show()
    return
  }

  // hide
  if (!flag && opts.isLast !== false) {
    Vue.ldUtils.loading.hide()
  }
}

// 处理返回的数据
http.interceptors.response.use(dealSuccess, dealError)

// 处理登录权限的问题
function checkPermissions(isLogOut, isPower) {
  // isLogOut：1 需要登录    0 不需要登录
  // isPower   1 有权限      0 无权限
  return !(isLogOut === 1 || isPower === 0)
}

function reLogin() {
  Vue.ldUtils.alert({
    content: '请重新登录',
    onOk: () => window.location.href = 'http://crm.imlaidian.com/platform_web/login.jsp'
  })
}

function dealSuccess(response) {
  console.log(response)
  log('response-2-s')
  let data = response.data
  let {isLogOut, isPower, result, msg} = data

  // 处理权限的问题
  if (!checkPermissions(isLogOut, isPower)) {
    reLogin()

    return Promise.reject(data)
  }

  // 处理调接口出错的情形
  if (result === -1) {
    Vue.ldUtils.toast(msg)
    return Promise.reject(data)
  }

  return data
}

function dealError(error) {
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
    // 手动取消请求时，不报异常
    case 'cancelRequest':
      break
    default:
      tipStr = '未知错误'
  }

  if (error.errorType !== 'cancelRequest') {
    Vue.ldUtils.toast(tipStr)
  }

  return Promise.reject(error)
}

const ldService = {
  // 等所有service调用都返回成功后，才会执行回调函数
  runAll(opts) {
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
each(serviceConfig.service, function (path, method) {
  let baseUri = globalConfig.uriStr

  if (typeof path === 'object') {
    baseUri = globalConfig[path.base]
    path = path.path
  }

  ldService[method] = createService(baseUri + path)
})

export default {
  install(Vue) {
    Vue.ldService = Vue.prototype.$ldService = ldService
  }
}
