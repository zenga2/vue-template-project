if (!('includes' in Array.prototype)) {
  Object.defineProperty(Array.prototype, 'includes', {
    value (item) {
      return this.indexOf(item) > -1
    }
  })
}

Object.defineProperty(Array.prototype, 'remove', {
  value (item) {
    let index = this.indexOf(item)

    if (index > -1) {
      this.splice(index, 1)
      return true
    }

    return false
  }
})
