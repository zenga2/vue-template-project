import { serialize, addDataToUrl } from '../../common/utils/urlUtils'

const defaultOpt = {
    timeout: 120 * 1000,
    uploadType: 'default',
    async: true
}
const contentTypes = {
    default: 'application/x-www-form-urlencoded;charset=UTF-8',
    text: 'text/plain;charset=UTF-8'
}

// 只能进行异步处理（这是出于简单化的考虑，只实现最常用的功能）
export default class Ajax {
    constructor (opts) {
        let xhr = this.xhr = new XMLHttpRequest()
        Object.assign(defaultOpt, opts)

        this.supportAbort = 'timeout' in xhr && 'onabort' in xhr
    }

    _start (method, url, data, options) {
        // regenerate properties per request
        let opts = this.opts = {}
        Object.assign(opts, defaultOpt, {url, data}, options)

        // set contentType
        let uploadType = this.opts.uploadType
        this.opts.contentType = this.opts.contentType || contentTypes[uploadType]

        // fire ajaxStart event
        this.opts.ajaxStartFn && this.opts.ajaxStartFn(opts)

        // serialize data
        let type = opts.uploadType
        if (method === 'GET') {
            opts.url = addDataToUrl(opts.url, opts.data)
            opts.data = null
        } else {
            opts.data = type === 'text' || type === false ? opts.data : serialize(opts.data)
        }
    }

    _open (method) {
        let {url, contentType, async} = this.opts
        let xhr = this.xhr

        xhr.open(method, url, async)

        if (contentType) {
            xhr.setRequestHeader('Content-Type', contentType)
        }
    }

    _initEvent (resolve, reject) {
        let xhr = this.xhr
        let isTimeout = false

        // 处理超时
        let dealTimeout = () => {
            isTimeout = true
            reject({errorType: 'timeoutError', desc: 'Timeout error'})
            this._complete()
        }

        if (this.supportAbort) {
            xhr.timeout = this.opts.timeout
            xhr.onabort = dealTimeout
        } else {
            setTimeout(dealTimeout, this.opts.timeout)
        }

        xhr.onreadystatechange = () => {
            console.log(`status: ${xhr.status}--${xhr.statusText}---readyState:${xhr.readyState}`)
            if (isTimeout) return

            if (xhr.readyState === 4) {
                this._handle(resolve, reject)
                this._complete()
            }
        }
    }

    _complete () {
        let ajaxCompleteFn = this.opts.ajaxCompleteFn
        ajaxCompleteFn && ajaxCompleteFn(this.opts)
    }

    _handle (resolve, reject) {
        let xhr = this.xhr

        if (xhr.status >= 200 && xhr.status < 300) {
            console.log(`success-status: ${xhr.status}`)
            try {
                let response = JSON.parse(xhr.responseText)
                resolve(response)
            } catch (e) {
                reject({errorType: 'dataError', desc: 'Not json'})
            }
        } else {
            console.log(`fail-status: ${xhr.status}`)
            reject({
                errorType: 'networkError',
                desc: 'Network error',
                status: xhr.status,
                statusText: xhr.statusText
            })
        }
    }

    _send () {
        this.xhr.send(this.opts.data)
    }

    fetch (method, url, data, opts) {
        // init state
        this._start(method, url, data, opts)

        return new Promise((resolve, reject) => {
            // open http connect
            this._open(method)
            // init all event
            this._initEvent(resolve, reject)
            // send data
            this._send()
        })
    }

    get (url, data = {}, opts = {}) {
        return this.fetch('GET', url, data, opts)
    }

    post (url, data = {}, opts = {}) {
        return this.fetch('POST', url, data, opts)
    }

    static ajaxStart (fn) {
        defaultOpt.ajaxStartFn = fn
    }

    static ajaxComplete (fn) {
        defaultOpt.ajaxCompleteFn = fn
    }
}
