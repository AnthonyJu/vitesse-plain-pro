import type { App } from 'vue'
import { routerBeforeEach } from '@/router/router-before-each'
import { staticRoutes } from '@/router/routes'
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

// 扩展 RouteMeta 接口
declare module 'vue-router' {
  interface RouteMeta extends Meta {}
}

// 重定向
routes.push({ path: '/', redirect: import.meta.env.VITE_REDIRECT_PATH })

export const router = createRouter({
  routes: setupLayouts(routes.filter(route => staticRoutes.includes(route.path))),
  history: createWebHashHistory(),
})

// 路由守卫
routerBeforeEach(router)

export default (app: App) => app.use(router)
