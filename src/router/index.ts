import type { RouteItem } from './routes'
import { routes } from './routes'

// 从后端获取菜单
export async function getMenuFromBackend() {
  // TODO：从后端获取菜单
  return new Promise<RouteItem[]>((resolve) => {
    resolve(routes)
  })
}

// 从前端获取菜单
export function getMenuFromFrontend() {
  const userStore = useUserStore()
  // 筛选，根据登录用户权限过滤菜单
  return filterAuthMenus(JSON.parse(JSON.stringify(routes)), userStore.userInfo!.role)
}

// 递归过滤函数
function filterAuthMenus(arr: RouteItem[], role: string): RouteItem[] {
  return arr.filter((route) => {
    let hasAuth = false

    // 当前路由有权限标识，以权限标识为准
    if (route.meta.roles) hasAuth = route.meta.roles.includes(role)
    // 无权限标识，且无子路由，则默认有权限
    else hasAuth = !route.children?.length

    if (hasAuth) return true
    if (route.children) {
      route.children = filterAuthMenus(route.children, role)
      hasAuth = route.children!.length > 0
    }
    return hasAuth
  })
}
