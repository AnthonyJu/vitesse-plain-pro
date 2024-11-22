import type { App } from 'vue'
import { addStaticRoutes } from '@/router/add-routes'
import { routerBeforeEach } from '@/router/router-before-each'
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

// 扩展 RouteMeta 接口
declare module 'vue-router' {
  interface RouteMeta extends Meta {}
}

// 重定向
routes.push({ path: '/', redirect: import.meta.env.VITE_REDIRECT_PATH })

export const router = createRouter({
  routes: [],
  history: createWebHashHistory(),
})

// 添加静态路由
addStaticRoutes(router)

// 路由守卫
routerBeforeEach(router)

export default (app: App) => app.use(router)
