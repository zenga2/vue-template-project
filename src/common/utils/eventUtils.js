import {system, os} from './browser-detect'
import {findAncestor} from './utils'

// os.ios和os.android是为了兼容chrome的手机模拟模式
const isMobile = system.isMobile || os.ios || os.android
const [START_EVENT, MOVE_EVENT, END_EVENT, CANCEL_EVENT] = isMobile
  ? ['touchstart', 'touchmove', 'touchend', 'touchcancel']
  : ['mousedown', 'mousemove', 'mouseup']

const defaultOpts = {}

// 实例属性
// isMobile
// isCancel          (是否触发了touchcancel事件)
// startTime         (touchstart的时间)
// endTime           (touchend或touchcancel的时间)
// startX  startY    (touchstart的pageX和pageY)
// currX   currY     (当前touchmove时的pageX和pageY)
// lastX   lastY     (上一次touchmove时的pageX和pageY)
// deltaX    deltaY      (currX - lastX)
// movingDirectionX  (1 表示从左向右滑，-1 表示从右向左滑，0 表示没有滑动)
// movingDirectionY  (1 表示从上往下滑，-1 表示从下往上滑，0 表示没有滑动)
class Touch {
  constructor(el, opts) {
    this.opts = Object.assign({}, defaultOpts, opts)
    this.isMobile = isMobile

    if (typeof el === 'string') {
      el = document.querySelector(el)
    }
    this.el = el

    this.enable()
  }

  _start(e) {
    // 用于判断是否需要触发点击事件
    this.isCancel = false
    this.startTime = Number(new Date())

    let point = isMobile ? e.changedTouches[0] : e
    this.lastX = this.currX = this.startX = point.pageX
    this.lastY = this.currY = this.startY = point.pageY
    this.movingDirectionX = this.movingDirectionY = 0
    this.deltaX = this.deltaY = 0

    this.dealCommon(e, 'start')

    on(this.el, [MOVE_EVENT], this)
  }

  _move(e) {
    let point = isMobile ? e.changedTouches[0] : e
    this.lastX = this.currX
    this.lastY = this.currY
    this.currX = point.pageX
    this.currY = point.pageY
    this.deltaX = this.currX - this.lastX
    this.deltaY = this.currY - this.lastY
    this.movingDirectionX = this.getDirection(this.deltaX)
    this.movingDirectionY = this.getDirection(this.deltaY)

    this.dealCommon(e, 'move')
  }

  _end(e) {
    this.endTime = Number(new Date())

    let point = isMobile ? e.changedTouches[0] : e
    this.lastX = this.currX
    this.lastY = this.currY
    this.currX = point.pageX
    this.currY = point.pageY

    this.dealCommon(e, 'end')

    off(this.el, [MOVE_EVENT], this)
  }

  _cancel(e) {
    this.endTime = Number(new Date())
    this.isCancel = true

    this.dealCommon(e, 'end')

    off(this.el, [MOVE_EVENT], this)
  }

  dealCommon(e, type) {
    let {isStop, isPrevent} = this.opts
    isStop && e.stopPropagation()
    isPrevent && e.preventDefault()

    let fn = this.opts[type]
    fn && fn.call(this, e)
  }

  getDirection(dis) {
    return dis === 0 ? 0 : dis / Math.abs(dis)
  }

  handleEvent(e) {
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

  enable() {
    on(this.el, [START_EVENT, END_EVENT, CANCEL_EVENT], this)
  }

  disable() {
    off(this.el, [START_EVENT, MOVE_EVENT, END_EVENT, CANCEL_EVENT], this)
  }

  destroy() {
    off(this.el, [START_EVENT, MOVE_EVENT, END_EVENT, CANCEL_EVENT], this)

    Object.keys(this).forEach(prop => delete this[prop])
  }
}

function on(el, types, obj) {
  types.forEach(type => type && el.addEventListener(type, obj))
}

function off(el, types, obj) {
  types.forEach(type => type && el.removeEventListener(type, obj))
}

function isSupportsPassive() {
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

function fireEvent(e, isPreBind, fn, rootEl) {
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
      e.currElement = targrt
      fn && fn(e)
    }
  } else {
    fn && fn(e)
  }
}

export {Touch, isSupportsPassive, fireEvent}
