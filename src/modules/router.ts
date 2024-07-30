import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import type { App } from 'vue'

// 重定向
routes.push({ path: '/', redirect: '/loading' })

export const router = createRouter({
  routes: setupLayouts(routes),
  history: createWebHashHistory(),
})

const WhiteList: string[] = ['/login', '/loading', '/401', '/404'] // 路由白名单

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 我的 blog 用来展示的路由，直接进入
  if (to.query.demo) {
    next()
  }
  // 未登录，且为白名单页面，或不需要登录的页面，直接进入
  else if (!userStore.isLogin && WhiteList.includes(to.path)) {
    next()
  }
  else {
    // 未登录，且不是白名单页面，跳转到登录页面
    if (!userStore.isLogin) {
      next(`/login?redirect=${to.fullPath}`) // TODO redirect
    }
    // 已登录，再去login页面，则还是进入当前页面
    else if (userStore.isLogin && to.path === '/login') {
      next(from.path)
    }
    else {
      // TODO 菜单权限判断
      next()
    }
  }
})

export default (app: App) => app.use(router)
