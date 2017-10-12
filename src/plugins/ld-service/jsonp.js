import { addDataToUrl } from '../../common/utils/urlUtils'

export default class Jsonp {
    constructor (opts) {
        this.defaultOpt = {
            timeout: 4000,
            callbackProp: 'callback',
            callbackVal: 'func',
            globalNameSpace: '_myPriveteSpace'
        }
        Object.assign(this.defaultOpt, opts)

        this.count = -1
        this.increment()

        window[this.defaultOpt.globalNameSpace] = this
    }

    increment () {
        this.count++
        this.fnName = this.defaultOpt.callbackVal + this.count
    }

    ajax (option) {
        function clean () {
            option.ajaxCompleteFn && option.ajaxCompleteFn()
        }

        option.ajaxStartFn && option.ajaxStartFn(option)

        return new Promise((resolve, reject) => {
            let fnName = this.fnName
            let el = document.createElement('script')
            let isTimeout = false

            // 处理超时
            setTimeout(() => {
                isTimeout = true
                reject({errorType: 'timeoutError', desc: ''})
                clean()
            }, option.timeout)

            // 绑定执行方法
            this[fnName] = function (response) {
                if (isTimeout) return

                try {
                    resolve(response)
                } finally {
                    clean()
                    delete this[fnName]
                    el.parentNode.removeChild(el)
                }
            }

            // 绑定error事件
            el.onerror = function (event) {
                reject({errorType: 'unknowError', 'desc': '', event})
                clean()
            }

            // 发起请求
            el.src = option.url
            document.head.appendChild(el)
        })
    }

    get (url, data = {}, option = {}) {
        let {callbackProp, globalNameSpace} = this.defaultOpt
        data[callbackProp] = globalNameSpace + '.' + this.fnName
        url = addDataToUrl(url, data)

        this.increment()

        option = Object.assign({url}, this.defaultOpt, option)
        return this.ajax(option)
    }

    ajaxStart (fn) {
        this.defaultOpt.ajaxStartFn = fn
    }

    ajaxComplete (fn) {
        this.defaultOpt.ajaxCompleteFn = fn
    }
}

