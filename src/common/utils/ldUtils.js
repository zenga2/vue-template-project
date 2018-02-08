import vueCookie from 'vue-cookie'
import Vue from 'vue'
import Loading from '../../components/loading'
import Alert from '../../components/alert'
import Toast from '../../components/toast'
import Confirm from '../../components/confirm'
import StorageUtil from './storageUtils'
import {urlParse} from './urlUtils'

const accessTokenKey = 'bg_accessToken'
const userInfoKey = 'bg_userInfo'

const sessionStorageUtil = new StorageUtil('sessionStorage')
const localStorageUtil = new StorageUtil('localStorage')

let titleEl

function isLogin() {
  return !!getAccessToken()
}

function getAccessToken() {
  let token = vueCookie.get(accessTokenKey)
  if (token === 'undefined') {
    token = undefined
  }
  return token
}

function getUserInfo(callback) {
  let userInfo = sessionStorageUtil.getItem(userInfoKey)

  if (!userInfo) {
    Vue.ldService.getUserInfo().then(({user}) => {
      sessionStorageUtil.setItem(userInfoKey, user)
      callback && callback(user)
    })
  } else {
    callback && callback(userInfo)
  }
}

function getDomain() {
  let domain = location.hostname

  if (/^192\.168\.10\./.test(domain)) {
    domain = '192.168.10.'
  }

  switch (domain) {
    case 'localhost':
      break
    case '192.168.10.':
      domain = location.hostname
      break
    default:
      domain = '.imlaidian.com'
  }

  return domain
}

function saveLoginInfo(response) {
  let opts = {
    expires: '1Y',
    domain: getDomain()
  }

  vueCookie.set(accessTokenKey, response.loginToken, opts)
  sessionStorageUtil.setItem(userInfoKey, response.user)
}

function clearLoginInfo() {
  let opts = {domain: getDomain()}

  vueCookie.delete(accessTokenKey, opts)
  sessionStorageUtil.removeItem(userInfoKey)
}

function alert(opts) {
  if (typeof opts === 'string') {
    opts = {content: opts}
  }

  return new Alert(opts)
}

function confirm(opts) {
  if (typeof opts === 'string') {
    opts = {content: opts}
  }

  return new Confirm(opts)
}

function toast(message, duration, onFinish) {
  return new Toast(message, duration, onFinish)
}

function storageHelper(utilObj, method) {
  return utilObj[method].bind(utilObj)
}

function modifyTitle(text) {
  if (!titleEl) {
    titleEl = document.querySelector('head title')
  }

  titleEl.textContent = text
}

function isMobileNumber(mobileNumber) {
  let pattern = /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d)|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d))$)$/

  return pattern.test(mobileNumber)
}

function setPageParam(toPageName, param) {
  sessionStorageUtil.setItem('page_name_' + toPageName, {value: param})
}

// 参数是一次性的,取一次就销毁
function getPageParam(currPageName, callback) {
  let key = 'page_name_' + currPageName
  let param = sessionStorageUtil.getItem(key)
  let isExist = param !== null

  if (isExist) {
    sessionStorageUtil.removeItem(key)

    callback && callback(param.value)
  }

  return {
    isExist,
    value: param && param.value
  }
}

// 获取从其他项目跳转过来时传递的参数
const getProjectParam = (function () {
  let paramObj = urlParse(window.location.search)

  return function () {
    return paramObj
  }
})()

export default {
  install(Vue) {
    Vue.ldUtils = Vue.prototype.$ldUtils = {
      isLogin,
      getAccessToken,
      getUserInfo,
      saveLoginInfo,
      clearLoginInfo,
      loading: new Loading(false, '加载中'),
      alert,
      confirm,
      toast,
      modifyTitle,
      isMobileNumber,
      setPageParam,
      getPageParam,
      getProjectParam,
      setLocalItem: storageHelper(localStorageUtil, 'setItem'),
      setSessionItem: storageHelper(sessionStorageUtil, 'setItem'),
      getLocalItem: storageHelper(localStorageUtil, 'getItem'),
      getSessionItem: storageHelper(sessionStorageUtil, 'getItem'),
      removeLocalItem: storageHelper(localStorageUtil, 'removeItem'),
      removeSessionItem: storageHelper(sessionStorageUtil, 'removeItem'),
      clearLocalCache: storageHelper(localStorageUtil, 'clear'),
      clearSessionCache: storageHelper(sessionStorageUtil, 'clear')
    }
  }
}
