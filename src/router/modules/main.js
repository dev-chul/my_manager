import Vue from 'vue'
import Router from 'vue-router'
import Header from '@/layout/header'

Vue.use(Router)

// const originalPush = Router.prototype.push
// Router.prototype.push = function push (location, onResolve, onReject) {
//   if (onResolve || onReject) { return originalPush.call(this, location, onResolve, onReject) }
//   return originalPush.call(this, location).catch((err) => {
//     if (Router.isNavigationFailure(err)) { return err }
//     return Promise.reject(err)
//   })
// }

export const defaultRouter = [
  {
    path: '/',
    component: Header,
    redirect: '/main',
    children: [
      {
        path: '/home',
        component: () => import('@/views/Home'),
        name: 'Home',
        meta: { title: 'Home' }
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/auth/Login'),
        meta: { title: 'Login' }
      },
      {
        path: '/worker',
        component: () => import('@/views/service/Worker'),
        name: 'Worker'
      },
      {
        path: '/transit',
        component: () => import('@/views/service/TransitionSample'),
        name: 'TransitionSample'
      },
      {
        path: '/modal',
        component: () => import('@/views/service/Modal'),
        name: 'Modal'
      },
      {
        path: '/customModal',
        component: () => import('@/views/service/CustomModal'),
        name: 'CustomModal'
      },
      {
        path: '/sharedElement',
        component: () => import('@/views/service/SharedElement'),
        name: 'SharedElement'
      },
      {
        path: '/sharedElementDetail',
        component: () => import('@/views/service/SharedElementDetail'),
        name: 'SharedElementDetail'
      }
    ]
  },
  {
    path: '/main',
    component: () => import('@/views/Main'),
    name: 'Main',
    meta: { title: 'Main' }
  }
]

export const roleRouter = [
  {
    path: '/info',
    // component: Layout,
    redirect: '/info/index'
  },
  {
    path: 'index',
    component: () => import('@/views/info/Index'),
    name: 'Info',
    meta: { title: 'Info', roles: ['admin'] }
  },
  {
    path: '/service',
    // component: Layout,
    redirect: '/service/index',
    children: [
      {
        path: 'service1',
        component: () => import('@/views/service/Service1'),
        name: 'Service1',
        meta: { title: 'Service1', roles: ['admin'] }
      }
    ]
  }
]

export default defaultRouter
