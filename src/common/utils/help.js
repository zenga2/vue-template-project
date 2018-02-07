// 柯里化
function curry(fn) {
  let len = fn.length

  return function () {
    let thisArg = this
    let args = []

    let _curry = function () {
      if (arguments.length > 0) {
        Array.from(arguments).forEach(item => args.push(item))

        if (args.length >= len) {
          return fn.apply(thisArg, args)
        }
      }

      return _curry
    }

    return _curry.apply(null, arguments)
  }
}

export {curry}
