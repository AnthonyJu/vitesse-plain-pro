import type { RouteItem } from '@/router/routes'
import { getMenuFromBackend } from '@/router/fromBackend'
import { getMenuFromFrontend } from '@/router/fromFrontend'
import { routes } from '@/router/routes'

export const useMenuStore = defineStore(
  'menu',
  () => {
    // 是否前端控制菜单
    const isFrontendCtrl = true
    // 菜单
    const menus = ref<RouteItem[]>([])
    // 路由白名单
    const whitePaths = ref<string[]>([])
    // 权限路径
    const permissionPaths = ref<string[]>([])

    // 初始化，设置默认菜单和白名单
    filterWhite()

    // 过滤白名单菜单
    function filterWhite() {
      // 过滤出 meta.isWhite 为true的路由
      menus.value = filterWhiteMenus(JSON.parse(JSON.stringify(routes)))
      whitePaths.value = menus.value.reduce<string[]>(computedWhitePath, [])
    }

    // 递归过滤函数
    function filterWhiteMenus(arr: RouteItem[]): RouteItem[] {
      return arr.filter((route) => {
        let isWhite = !!route.meta?.isWhite
        if (isWhite) return true
        if (route.children) {
          route.children = filterWhiteMenus(route.children)
          isWhite = route.children!.length > 0
        }
        return isWhite
      })
    }

    // 计算白名单路径
    function computedWhitePath(acc: string[], cur: RouteItem) {
      if (cur.children) {
        cur.children.forEach(item => computedWhitePath(acc, item))
      }
      else if (cur.meta?.isWhite) {
        acc.push(cur.path)
      }
      return acc
    }

    // 获取菜单
    function getMenu() {
      if (isFrontendCtrl) {
        // ! 模拟异步请求，查看Permission的loading，实际开发中请删除
        return new Promise((resolve) => {
          setTimeout(() => {
            setMenu(getMenuFromFrontend())
            resolve(true)
          }, 1000)
        })
      }
      else {
        return getMenuFromBackend()
          .then((res) => {
            setMenu(res)
          })
      }
    }

    // 设置菜单
    function setMenu(val: RouteItem[]) {
      menus.value = val
      permissionPaths.value = menus.value.reduce<string[]>(computedPath, [])
    }

    // 计算权限路径
    function computedPath(acc: string[], cur: RouteItem) {
      // 存在子路由，则递归计算
      if (cur.children) {
        // 过滤隐藏的子路由
        const children = cur.children.filter(item => !item.meta.isHide)
        // 有子路由，则递归计算
        if (children.length) children.forEach(item => computedPath(acc, item))
        // 没有展示的子路由，则加入权限路径
        else acc.push(cur.path)
      }
      // 没有子路由，则加入权限路径
      else {
        acc.push(cur.path)
      }
      return acc
    }

    return {
      menus,
      getMenu,
      whitePaths,
      permissionPaths,
    }
  },
  {
    persist: {
      storage: sessionStorage,
    },
  },
)

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot))
