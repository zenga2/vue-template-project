import { system, os } from './browser-detect'
import { findAncestor } from './utils'

// os.ios和os.android是为了兼容chrome的手机模拟模式
const isMobile = system.isMobile || os.ios || os.android
const [START_EVENT, MOVE_EVENT, END_EVENT, CANCEL_EVENT] = isMobile
  ? ['touchstart', 'touchmove', 'touchend', 'touchcancel']
  : ['mousedown', 'mousemove', 'mouseup']

const defaultOpts = {}

class Touch {
  constructor (el, opts) {
    this.opts = Object.assign({}, defaultOpts, opts)
    this.isMobile = isMobile

    if (typeof el === 'string') {
      el = document.querySelector(el)
    }
    this.el = el

    on(el, [START_EVENT, END_EVENT, CANCEL_EVENT], this)
  }

  _start (e) {
    // 用于判断是否需要触发点击事件
    this.isCancel = false
    this.startTime = Number(new Date())

    let point = isMobile ? e.changedTouches[0] : e
    this.startX = point.pageX
    this.startY = point.pageY

    this.dealCommon(e, 'start')

    on(this.el, [MOVE_EVENT], this)
  }

  _move (e) {
    let point = isMobile ? e.changedTouches[0] : e
    this.currX = point.pageX
    this.currY = point.pageY

    this.dealCommon(e, 'move')
  }

  _end (e) {
    this.endTime = Number(new Date())

    let point = isMobile ? e.changedTouches[0] : e
    this.currX = point.pageX
    this.currY = point.pageY

    this.dealCommon(e, 'end')

    off(this.el, [MOVE_EVENT], this)
  }

  _cancel (e) {
    this.endTime = Number(new Date())
    this.isCancel = true

    this.dealCommon(e, 'end')

    off(this.el, [MOVE_EVENT], this)
  }

  dealCommon (e, type) {
    let {isStop, isPrevent} = this.opts
    isStop && e.stopPropagation()
    isPrevent && e.preventDefault()

    let fn = this.opts[type]
    fn && fn.call(this, e)
  }

  handleEvent (e) {
    switch (e.type) {
      case 'touchstart':
      case 'mousedown':
        this._start(e)
        break
      case 'touchmove':
      case 'mousemove':
        this._move(e)
        break
      case 'touchend':
      case 'mouseup':
        this._end(e)
        break
      case 'touchcancel':
        this._cancel(e)
        break
    }
  }

  destroy () {
    off(this.el, [START_EVENT, MOVE_EVENT, END_EVENT, CANCEL_EVENT], this)

    Object.keys(this).forEach(prop => delete this[prop])
  }
}

function on (el, types, obj) {
  types.forEach(type => type && el.addEventListener(type, obj))
}

function off (el, types, obj) {
  types.forEach(type => type && el.removeEventListener(type, obj))
}

function isSupportsPassive () {
  let supportsPassive = false

  try {
    let opts = Object.defineProperty({}, 'passive', {
      get: function () {
        supportsPassive = true
      }
    })

    window.addEventListener('test', null, opts)
  } catch (e) {
  }

  return supportsPassive
}

function fireEvent (e, isPreBind, fn, rootEl) {
  let targrt = e.target
  let childClass, childEl

  if (isPreBind) {
    childClass = fn[0]
    fn = fn[1]
    childEl = findAncestor(targrt, childClass, rootEl)
    if (childEl) {
      targrt = childEl
    }

    let classList = targrt.classList
    if (classList && classList.contains(childClass)) {
      fn && fn(targrt, e)
    }
  } else {
    fn && fn(e)
  }
}

export { Touch, isSupportsPassive, fireEvent }
