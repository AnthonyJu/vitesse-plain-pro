import type { RouteItem } from './routes'
import { routes } from './routes'

// 从前端获取菜单
export function getMenuFromFrontend() {
  // TODO：模拟筛选，根据登录用户权限菜单
  return routes
}

// 从后端获取菜单
export async function getMenuFromBackend() {
  // TODO：从后端获取菜单
  return new Promise<RouteItem[]>((resolve) => {
    resolve(routes)
  })
}
