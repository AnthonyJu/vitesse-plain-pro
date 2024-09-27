import type { Router, RouteRecordRaw } from 'vue-router'
import { staticRoutes } from '@/router/routes'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'

export function routerBeforeEach(router: Router) {
  router.beforeEach(async (to, from, next) => {
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
      else if (!menuStore.menus.length) {
        await menuStore.getMenu()
        // 将有权限的路由动态添加到路由表
        addRoutes(router, menuStore.permissionPaths)
        // 防止第一次进入页面时，404问题
        next({ path: to.path, query: to.query })
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
