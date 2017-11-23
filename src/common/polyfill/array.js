if (!('includes' in Array.prototype)) {
  Object.defineProperty(Array.prototype, 'includes', {
    value(item) {
      return this.indexOf(item) > -1
    }
  })
}

if (!('findIndex' in Array.prototype)) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value(fn) {
      for (let i = 0, len = this.length; i < len; i++) {
        let item = this[i]
        if (!!fn(item, i, this) === true) {
          return i
        }
      }
    }
  })
}

if (!('find' in Array.prototype)) {
  Object.defineProperty(Array.prototype, 'find', {
    value(fn) {
      for (let i = 0, len = this.length; i < len; i++) {
        let item = this[i]
        if (!!fn(item, i, this) === true) {
          return item
        }
      }
    }
  })
}

Object.defineProperty(Array.prototype, 'remove', {
  value(item) {
    let index = this.indexOf(item)

    if (index > -1) {
      this.splice(index, 1)
      return true
    }

    return false
  }
})
