import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHashHistory } from 'vue-router'
import type { App } from 'vue'
import pages from '~pages'

export const routes = setupLayouts(pages)

// 重定向
routes.push({ path: '/', redirect: '/home' })

export const router = createRouter({ routes, history: createWebHashHistory() })

const WhiteList: string[] = ['/login', '/401'] // TODO 路由白名单

router.beforeEach(async (to, from, next) => {
  if (WhiteList.includes(to.path)) next()
  // TODO 其他权限判断
  else next()
})

export default (app: App) => app.use(router)
