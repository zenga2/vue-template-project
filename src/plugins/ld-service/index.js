import Ajax from './ajax'
import serviceConfig from '@/service.config'
import globalConfig from '@/global.config'
import {each, CustomError} from '../../common/utils/utils'
import Vue from 'vue'

let ldService = {
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

// 生成各服务方法
each(serviceConfig.service, function (action, method) {
    let url = globalConfig.uriStr + action
    ldService[method] = createService(url)
})

// ajax开始前的处理
Ajax.ajaxStart(opts => {
    preDealUrl(opts)

    // 开启等待层
    if (opts.isShowLoading !== false) {
        Vue.ldUtils.loading.show()
    }

    console.log('ajax start')
})

// 在每次请求前给url添加公共的query参数
function preDealUrl(opts) {
    let commonParam = {}

    if (opts.needAccessToken !== false) {
        commonParam.loginToken = Vue.ldUtils.getAccessToken()
    }

    Object.assign(opts.data, commonParam)
}

// ajax完成后的处理(包含出错)
Ajax.ajaxComplete(opts => {
    if (opts.isLast !== false) {
        // 关闭等待层
        Vue.ldUtils.loading.hide()
    }

    console.log('ajax complete')
})

// 处理登录权限的问题
function checkPermissions(isLogOut, isPower) {
    // isLogOut：1需要登录 0不需要登录
    // isPower 1有权限 0无权限
    if (isLogOut === 1) {
        Vue.ldUtils.alert({
            content: '异地登录，请重新登录',
            onOk: () => Vue.router.replace('/login')
        })

        return false
    }
    if (isPower === 0) {
        Vue.ldUtils.alert({
            content: '权限不够，请重新登录',
            onOk: () => Vue.router.replace('/login')
        })

        return false
    }

    return true
}

function createService(url, fn) {
    return function (data = {}, opts = {}) {
        fn && fn()

        let xhr = new Ajax()
        let method = opts.method || 'post'

        if (opts.url) {
            url = opts.url
        }

        return xhr[method](url, data, opts).then(
            response => {
                let {isLogOut, isPower, result, msg} = response
                let msgArr = ['缺少access_token参数', 'access_token无效', 'access_token参数出错', '权限不足']

                // 处理权限的问题
                let hasPermissions = checkPermissions(isLogOut, isPower)
                if (!hasPermissions) {
                    throw new CustomError('无权限', 'ld-service/index.js')
                }

                // 处理需要重新登录的情形
                if (msgArr.indexOf(msg) > -1) {
                    Vue.ldUtils.alert({
                        content: '请重新登录',
                        onOK: () => Vue.router.replace('/login')
                    })
                    throw new CustomError('tokenError', msg + '--id-service/index.js')
                }

                // 处理调接口出错的情形
                if (result === -1) {
                    Vue.ldUtils.alert(msg)
                    throw new CustomError('paramError', msg + '--id-service/index.js')
                }

                return response
            },
            error => {
                console.log('id-service: ', error)
                let tipStr = ''

                each({
                    networkError: '网络异常',
                    timeoutError: '访问超时',
                    dataError: '数据格式错误'
                }, (tip, prop) => {
                    if (error.name === prop) {
                        tipStr = tip
                    }
                })

                tipStr = tipStr || '网络异常'

                Vue.ldUtils.alert(tipStr)
                throw new Error('访问失败--id-service/index.js')
            }
        )
    }
}

export default {
    install(Vue) {
        Vue.ldService = Vue.prototype.$ldService = ldService
    }
}
