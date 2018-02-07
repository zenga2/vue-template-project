// 柯里化
function curry(fn) {
  let len = fn.length

  return function () {
    let thisArg = this
    let args = Array.from(arguments)

    if (args.length >= len) {
      return fn.apply(thisArg, args)
    }

    return function _curry() {
      Array.from(arguments).forEach(item => args.push(item))

      if (args.length >= len) {
        return fn.apply(thisArg, args)
      }

      return _curry
    }
  }
}

export {curry}
