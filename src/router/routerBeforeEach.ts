import type { Router, RouteRecordRaw } from 'vue-router'
import { staticRoutes } from '@/router/routes'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'

// 路由守卫
export function routerBeforeEach(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()

    // 未登录，跳转到登录页面
    if (!userStore.isLogin) {
      // 未登录，去login页面，则直接进入
      if (to.path === '/login') {
        next()
      }
      // 未登录，去非白名单页面，则跳转到登录页面
      else if (staticRoutes.includes(to.path)) {
        next('/login')
      }
      // 未登录，去非白名单页面，则跳转到登录页面，并记录当前页面
      else {
        next(`/login?redirect=${to.fullPath}`)
      }
    }
    // 已登录，再去login页面，则还是进入当前页面
    else if (to.path === '/login') {
      next(from.path)
    }
    // 菜单权限判断
    else {
      const menuStore = useMenuStore()
      if (menuStore.menus.length === 0) {
        await menuStore.getMenu()
        // 将有权限的路由动态添加到路由表
        addRoutes(router, menuStore.permissionPaths)

        // 无权限路径，则跳转到401页面
        if (menuStore.menus.length === 0) {
          next('/401')
        }
        // 防止第一次进入页面时，404问题
        else {
          next({ path: to.path, query: to.query })
        }
      }
      // 没有路由名称则代表404
      else if (!to.name) {
        next('/404')
      }
      else {
        next()
      }
    }
  })
}

// 添加动态路由
function addRoutes(router: Router, permissionPaths: string[]) {
  const newRoutes = filterRoute(routes, permissionPaths)
  setupLayouts(newRoutes).forEach(route => router.addRoute(route))
}

// 根据权限路径过滤路由
function filterRoute(children: RouteRecordRaw[], permissionPaths: string[], basePath = ''): RouteRecordRaw[] {
  return children.filter((route) => {
    if (permissionPaths.includes(basePath + route.path)) {
      return true
    }
    else if (route.children) {
      route.children = filterRoute(route.children, permissionPaths, `${basePath}${route.path}/`)
      return route.children.length
    }
    return false
  })
}
