// 柯里化
function curry(fn, thisArg) {
  let len = fn.length
  
  let _curry = function () {
    let args = this.slice()

    if (arguments.length > 0) {
      Array.from(arguments).forEach(item => args.push(item))

      if (args.length >= len) {
        return fn.apply(thisArg, args)
      }
    }

    return _curry.bind(args)
  }

  return _curry.bind([])
}

export {curry}
