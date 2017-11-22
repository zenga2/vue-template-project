import formateMobile from './formate-mobile'
import formateMoney from './formate-money'

export default {
  install(Vue, options) {
    Vue.filter('formateMobile', formateMobile)
    Vue.filter('formateMoney', formateMoney)
  }
}
