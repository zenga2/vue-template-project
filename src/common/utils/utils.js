import {isArray} from './typeUtils'

function each(obj, fn) {
  if (!obj || !fn) return

  if (isArray(obj)) {
    for (let i = 0, len = obj.length; i < len; i++) {
      if (fn.call(obj, obj[i], i) === false) return
    }
  } else {
    let keys = Object.keys(obj)
    for (let i = 0, len = keys.length; i < len; i++) {
      let k = keys[i]
      if (fn.call(obj, obj[k], k) === false) return
    }
  }
}

// 扩展对象
function extend(target, source) {
  let keys = Object.keys(source)
  let len = keys.length

  for (let i = 0; i < len; i++) {
    let key = keys[i]
    target[key] = source[key]
  }

  return target
}

// 让fn2在fn1执行完后执行,
// 同时确保fn2的等待时间至少为minInterval
function executeAfter(fn1, fn2, minInterval = 0) {
  let isDone = false
  let isTimeout = false

  setTimeout(function () {
    // fn1已经执行完了
    if (isDone) {
      fn2()
    } else {
      isTimeout = true
    }
  }, minInterval)

  fn1(function () {
    if (isTimeout) {
      fn2()
    } else {
      isDone = true
    }
  })
}

function animation(workFn, duration) {
  let startTime = +(new Date())
  requestAnimationFrame(function step() {
    let currTime = +(new Date())
    let ratio = (currTime - startTime) / duration
    workFn(ratio)
    if (ratio <= 1) {
      requestAnimationFrame(step)
    }
  })
}

// 设置函数两次运行之间的间隔
// 例如500ms内函数只能运行一次
// 函数节流(定时触发)
function throttle(fn, interval) {
  let lastTime = +new Date()

  return function () {
    let currTime = +new Date()
    if (currTime - lastTime > interval) {
      fn.apply(this, arguments)
    }
    lastTime = currTime
  }
}

// 函数去抖(只执行一次)
function debounce(fn, wait = 0) {
  let timeoutId

  return function () {
    // clear last timeout
    window.clearTimeout(timeoutId)
    // reset timeout
    timeoutId = setTimeout(fn.bind(this, ...arguments), wait)
  }
}

function findOverflow() {
  setTimeout(function () {
    traverseDom(document.body, function (node) {
      let parentNode = node.parentNode
      if (parentNode && parentNode.getBoundingClientRect && node.getBoundingClientRect) {
        let pRect = parentNode.getBoundingClientRect()
        let childRect = node.getBoundingClientRect()

        if (childRect.width > pRect.width) {
          console.log('overflowX', parentNode, pRect, node, childRect)
        }

        if (childRect.height > pRect.height) {
          console.log('overflowY', parentNode, pRect, node, childRect)
        }
      }
    })
  }, 2000)

  function traverseDom(node, func) {
    func(node)
    node = node.firstChild
    while (node) {
      traverseDom(node, func)
      node = node.nextSibling
    }
  }
}

class CustomError extends Error {
  constructor(name, message) {
    super()
    Object.assign(this, {name, message})
  }
}

function downloadFile(url, filename) {
  let el = document.createElement('a')
  el.href = url
  if (filename) {
    el.download = filename
  }
  el.click()
}

function findAncestor(target, classStr, rootEl = document.documentElement) {
  let ancestorEl = target.parentNode

  while (ancestorEl !== rootEl) {
    let classList = ancestorEl.classList
    if (classList && classList.contains(classStr)) {
      return ancestorEl
    }

    ancestorEl = ancestorEl.parentNode
  }

  return null
}

// target:   当前元素
// classStr: 祖先元素的类名
function hasAncestor(target, classStr) {
  return !!findAncestor(target, classStr)
}

// target:    点击事件发生的元素
// itemClass: handle绑定的元素
function filterTarget(target, itemClass, fn) {
  let el = findAncestor(target, itemClass)

  if (el) {
    target = el
  }

  let classList = target.classList
  if (classList && classList.contains(itemClass)) {
    fn && fn(target)
  }
}

function includes(arr, item) {
  return arr.indexOf(item) > -1
}

function switchPage(name, opts, thisArg) {
  let isExecute = false
  let defaultFn = opts.default
  delete opts.default

  each(opts, (fn, filterStr) => {
    let pageArr, flag
    // flag: true 正匹配   false 反匹配
    flag = filterStr[0] !== '^'
    if (!flag) {
      filterStr = filterStr.slice(1)
    }
    pageArr = filterStr.split('|')

    if (includes(pageArr, name) === flag) {
      isExecute = true
      fn.call(thisArg)
    }
  })

  if (!isExecute) {
    defaultFn && defaultFn.call(thisArg)
  }
  opts.default = defaultFn
}

// 深度复制
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function ployfill(prototype, opts) {
  /* eslint-disable no-extend-native */
  each(opts, (value, key) => {
    if (!(key in prototype)) {
      Object.defineProperty(Array.prototype, key, {value})
    }
  })
}

function blobToBase64(blob, cb) {
  let reader = new FileReader()
  reader.onload = function () {
    cb && cb(reader.result)
  }
  reader.readAsDataURL(blob)
}

export {
  each,
  extend,
  executeAfter,
  animation,
  throttle,
  debounce,
  findOverflow,
  CustomError,
  downloadFile,
  findAncestor,
  hasAncestor,
  filterTarget,
  switchPage,
  includes,
  deepClone,
  ployfill,
  blobToBase64
}
