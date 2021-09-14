import Vue from 'vue'
import Router from 'vue-router'

import mainRouter from '@/router/modules/main'

console.log('====')

Vue.use(Router)

const router = new Router({
  routes: [
    ...mainRouter
  ]
})

export default router
