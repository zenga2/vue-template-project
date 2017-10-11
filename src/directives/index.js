import infinite from './infinite'
import fastClick from './fast-click'
import longPress from './long-press'

export {infinite}

export default {
  install(Vue, options) {
    Vue.directive('infinite', infinite)
    Vue.directive('fast-click', fastClick)
    Vue.directive('long-press', longPress)
  }
}
