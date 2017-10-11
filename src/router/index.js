import Vue from 'vue'
import Router from 'vue-router'
import test from '../pages/test.vue'

Vue.use(Router)

const router = new Router({
    routes: [
        {path: '/', name: 'test', component: test}
    ]
})

// 暴露接口给插件使用
Vue.router = router

export default router
