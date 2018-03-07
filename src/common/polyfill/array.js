import {defineProps} from '../utils/utils'


defineProps(Array.prototype, {
  includes(item) {
    return this.indexOf(item) > -1
  },

  findIndex(fn) {
    for (let i = 0, len = this.length; i < len; i++) {
      let item = this[i]
      if (!!fn(item, i, this) === true) {
        return i
      }
    }
  },

  find(fn) {
    for (let i = 0, len = this.length; i < len; i++) {
      let item = this[i]
      if (!!fn(item, i, this) === true) {
        return item
      }
    }
  },

  remove(item) {
    let index = this.indexOf(item)

    if (index > -1) {
      this.splice(index, 1)
      return true
    }

    return false
  }
})
