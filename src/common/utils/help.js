// 柯里化
function curry(fn, thisArg) {
  let len = fn.length

  let _curry = function () {
    let args = this.slice()

    if (arguments.length > 0) {
      args = args.concat(Array.from(arguments))

      if (args.length >= len) {
        return fn.apply(thisArg, args)
      }
    }

    return _curry.bind(args)
  }

  return _curry.bind([])
}

function curry_two(fn, thisArg) {
  let len = fn.length

  let _curry = function () {
    let args = Array.from(arguments)

    if (args.length >= len) {
      return fn.apply(thisArg, args)
    }

    return function () {
      let arr = args.concat(Array.from(arguments))
      return _curry.apply(null, arr)
    }
  }

  return _curry
}

export {curry}
