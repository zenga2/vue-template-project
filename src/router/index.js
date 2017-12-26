import Vue from 'vue'
import Router from 'vue-router'
import Test from '../pages/test.vue'
import Login from '../pages/login.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {path: '/', name: 'login', component: Login},
    {path: '/test', name: 'test', component: Test}
  ]
})

// 暴露接口给插件使用
Vue.router = router

export default router
