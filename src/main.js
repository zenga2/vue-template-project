// 放在最前面才能保证在最终的css文件处于最前面
import './common/css/reset.css'
import './common/css/font.css'
import './common/stylus/index.styl'

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import pkg from '../package.json'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vueCookie from 'vue-cookie'
import directive from './directives'
import filters from './filters'
import ldUtils from './common/utils/ldUtils'
import ldService from './plugins/ld-service'
import commonComponent from './components'

Vue.use(vueCookie)
Vue.use(directive)
Vue.use(filters)
Vue.use(ldUtils)
Vue.use(ldService)
Vue.use(commonComponent)

// 用作事件bus
Vue.prototype.$ldBus = new Vue()

Vue.config.productionTip = false

// app version
window['_my_app_'] = pkg.version

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
})
