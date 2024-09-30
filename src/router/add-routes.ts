import type { Router, RouteRecordRaw } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes as generateRoutes } from 'vue-router/auto-routes'
import { baseMeta, routes } from './routes'

// 添加动态路由
export function addRoutes(router: Router, permissionPaths: string[]) {
  const flatRoutes = getFlatRoutes()
  const newRoutes = filterRoute(generateRoutes, permissionPaths, flatRoutes)
  setupLayouts(newRoutes).forEach(route => router.addRoute(route))
}

// 获取扁平化路由
export function getFlatRoutes(flatRoutes = routes): RouteItem[] {
  const result: RouteItem[] = []
  flatRoutes.forEach((route) => {
    result.push(route)
    if (route.children) result.push(...getFlatRoutes(route.children))
  })
  return result
}

// 根据权限路径过滤路由
function filterRoute(children: RouteRecordRaw[], permissionPaths: string[], flatRoutes: RouteItem[], basePath = ''): RouteRecordRaw[] {
  return children.filter((route) => {
    // 根据 unplugin-vue-router 规则，组装完整路径
    const fullPath = basePath + route.path

    // 合并路由元信息
    const matchRoute = flatRoutes.find(item => item.path === fullPath)
    if (matchRoute) route.meta = { ...route.meta, ...baseMeta, ...matchRoute.meta }

    // 判断是否有权限
    if (permissionPaths.includes(fullPath)) {
      // 递归过滤子路由，子路由有权限则父路由也显示
      if (route.children) {
        route.children = filterRoute(route.children, permissionPaths, flatRoutes, `${fullPath}/`)
        // 默认重定向到第一个子路由
        if (route.children.length && !route.meta?.noRedirect) route.redirect = `${fullPath}/${route.children[0].path}`
        return route.children.length
      }
      return true
    }

    return false
  })
}
