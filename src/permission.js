import router from './router'
import store from '@/store'
import user from '@/store/modules/user'
import { getToken } from '@/utils/auth'

const whiteList = ['/login', '/', '/home'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      const hasRoles = user.state.roles && user.state.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          const { roles } = await store.dispatch('user/getInfo')
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          router.addRoutes(accessRoutes)
          next({ ...to, replace: true })
        } catch (error) {
          // await store.dispatch('user/resetToken')
          // Message.error(error || 'Has Error')
          // next(`/login?redirect=${to.path}`)
          // NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
    }
  }
})

router.afterEach(() => {
})
