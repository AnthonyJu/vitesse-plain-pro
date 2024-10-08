import { routes } from './routes'

// 从后端获取菜单
export async function getMenuFromBackend() {
  // TODO：从后端获取菜单
  return new Promise<RouteItem[]>((resolve) => {
    resolve(routes)
  })
}
