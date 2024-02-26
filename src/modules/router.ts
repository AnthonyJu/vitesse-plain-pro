import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import type { App } from 'vue'

// 重定向
routes.push({ path: '/', redirect: '/home' })

export const router = createRouter({
  routes: setupLayouts(routes),
  history: createWebHashHistory(),
})

const WhiteList: string[] = ['/login', '/401'] // TODO 路由白名单

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (WhiteList.includes(to.path)) next()
  else if (to.query.demo) next()
  else if (!userStore.isLogin) next('/login')
  // TODO 其他权限判断
  else next()
})

export default (app: App) => app.use(router)
