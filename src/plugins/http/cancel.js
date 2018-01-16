import createError from './create-error'

// 这个是一次性的
// 即一个cancel对象只能用于一次请求
export default class Cancel {
  constructor() {
    this.promise = new Promise(resolve => {
      this.resolve = resolve
    })
  }

  setXhr(xhr, reject, opts) {
    this.currXhr = xhr
    this.xhrReject = reject
    this.opts = opts
    // trigger promise
    this.resolve()
  }

  stop() {
    if (!this.promise) return

    this.promise.then(() => {
      let {currXhr, xhrReject, opts} = this

      if (!currXhr) return

      xhrReject && xhrReject(
        createError('cancelRequest', 'Cancel request', opts)
      )

      if ('abort' in currXhr) {
        currXhr.abort()
      }

      this.clear()
    })
  }

  clear() {
    this.resolve = this.promise = this.currXhr = this.reject = this.opts = null
  }
}
