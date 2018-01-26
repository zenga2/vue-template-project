import formateMobile from './formate-mobile'
import formateMoney from './formate-money'
import toPercent from './to-percent'

export default {
  install(Vue, options) {
    Vue.filter('formateMobile', formateMobile)
    Vue.filter('formateMoney', formateMoney)
    Vue.filter('toPercent', toPercent)
  }
}
