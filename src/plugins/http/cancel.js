import createError from './create-error'

export default class Cancel {
  constructor () {
    this.promise = new Promise(resolve => {
      this.resolve = resolve
    })
  }

  setXhr (xhr, reject, opts) {
    this.currXhr = xhr
    this.xhrReject = reject
    this.opts = opts
    // trigger promise
    this.resolve()
  }

  stop () {
    this.promise.then(() => {
      let {currXhr, xhrReject, opts} = this

      if (!currXhr) return

      if ('abort' in currXhr) {
        currXhr.abort()

        xhrReject && xhrReject(
          createError('cancelRequest', 'Cancel request', opts || {})
        )
      }

      this.clear()
    })
  }

  clear () {
    this.resolve = this.promise = this.currXhr = this.reject = this.opts = null
  }
}
