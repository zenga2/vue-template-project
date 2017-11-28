export default class InterceptorManager {
  constructor() {
    this.handlers = []
  }

  use(fulfilled, rejected) {
    this.handlers.push({
      fulfilled: fulfilled,
      rejected: rejected
    })
    return this.handlers.length - 1
  }

  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null
    }
  }

  forEachAfterReverse(fn) {
    this.handlers.slice().reverse().forEach(handle => {
      if (handle !== null) {
        fn(handle)
      }
    })
  }

  forEach(fn) {
    this.handlers.forEach(handle => {
      if (handle !== null) {
        fn(handle)
      }
    })
  }
}
