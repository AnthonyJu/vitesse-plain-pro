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

// 登录后白名单
const WhiteList = ['/loading', '/401', '/404']

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const menuStore = useMenuStore()
  // 当前路由匹配路径
  const matchedPath = to.matched.find(item => item.name === to.name)!.path

  //  blog 用来展示的路由，直接进入
  if (to.query.demo) {
    next()
  }
  // 白名单页面，直接进入
  else if (menuStore.whitePaths.includes(matchedPath)) {
    next()
  }
  else {
    // 未登录，跳转到登录页面
    if (!userStore.isLogin) {
      if (to.path === '/login') {
        next()
      }
      else {
        next(`/login?redirect=${to.fullPath}`) // TODO redirect
      }
    }
    // 已登录，再去login页面，则还是进入当前页面
    else if (to.path === '/login') {
      next(from.path)
    }
    // 已登录，且为登录白名单页面，直接进入
    else if (WhiteList.includes(to.path)) {
      next()
    }
    // 菜单权限判断
    else {
      // 菜单匹配路径有权限，则进入
      if (menuStore.permissionPaths.includes(matchedPath)) {
        next()
      }
      // 没有权限，则跳转到401页面
      else {
        next('/401')
      }
    }
  }
})

export default (app: App) => app.use(router)
