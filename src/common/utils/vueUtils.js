function injectProp(dataProp, injectObj, vm) {
  let data = vm.$options.data

  // inject prop in data
  if (typeof data === 'function') {
    vm.$options.data = function () {
      let obj = data.call(vm)
      obj[dataProp] = injectObj
      return obj
    }
  } else {
    data[dataProp] = injectObj
  }
}

export {injectProp}
