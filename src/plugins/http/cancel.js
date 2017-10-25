import createError from './create-error'

export default class Cancel {
  setXhr (xhr, reject, opts) {
    this.currXhr = xhr
    this.reject = reject
    this.opts = opts
  }

  stop () {
    let {currXhr, reject, opts} = this

    if (!currXhr) return

    if ('abort' in currXhr) {
      currXhr.abort()

      reject && reject(
        createError('cancelRequest', 'Cancel request', opts || {})
      )
    }

    this.clear()
  }

  clear () {
    this.currXhr = this.reject = this.opts = null
  }
}
