import type { RouteItem } from './routes'
import { routes } from './routes'

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
    if (route.meta.roles) {
      hasAuth = route.meta.roles.includes(role)
    }
    // 递归判断子路由
    else if (route.children) {
      route.children = filterAuthMenus(route.children, role)
      hasAuth = route.children!.length > 0
    }
    // 无权限标识，且无子路由，则默认有权限
    else {
      hasAuth = true
    }
    return hasAuth
  })
}
