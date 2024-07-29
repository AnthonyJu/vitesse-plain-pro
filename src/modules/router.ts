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

const WhiteList: string[] = ['/login', '/loading', '/401'] // 路由白名单

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.query.demo) { // blog 路由
    next()
  }
  // 未登录且是login页面，直接进入
  else if (!userStore.isLogin && to.path === '/login') {
    next()
  }
  else {
    // 未登录且不是login页面，重定向到login页面
    if (!userStore.isLogin) {
      if (WhiteList.includes(to.path)) next('/login')
      else next(`/login?redirect=${to.path}`) // TODO redirect
    }
    // 已登录，再去login页面，则还是进入当前页面
    else if (userStore.isLogin && to.path === '/login') {
      next(from.path)
    }
    // 白名单页面，直接进入
    else if (WhiteList.includes(to.path)) {
      next()
    }
    // loading页面，直接进入
    else if (to.path === '/loading') {
      next()
    }
    else {
      // TODO 其他权限判断
      next()
    }
  }
})

export default (app: App) => app.use(router)
