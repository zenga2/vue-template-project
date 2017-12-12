import {each} from '../common/utils/utils'
import page from './page/page'
import pageHeader from './page/page-header'
import pageMain from './page/page-main'
import pageFooter from './page/page-footer'

export default {
  install(Vue) {
    each({
      page, pageHeader, pageMain, pageFooter
    }, (component, key) => Vue.component(key, component))
  }
}
