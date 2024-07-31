import { getMenuFromBackend, getMenuFromFrontend } from '@/router'
import type { RouteItem } from '@/router/routes'
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
      // 过滤出meta.isWhite为true的路由，必须在nextTick中执行，否则会出现初始化store时menus为空的情况
      nextTick(() => {
        menus.value = filterWhiteMenus()
        whitePaths.value = menus.value.reduce<string[]>(computedWhitePath, [])
      })
    }

    // 递归过滤函数
    function filterWhiteMenus(menus: RouteItem[] = routes): RouteItem[] {
      return menus.filter((route) => {
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
      return new Promise((resolve, reject) => {
        if (isFrontendCtrl) {
          setMenu(getMenuFromFrontend())
          resolve(true)
        }
        else {
          getMenuFromBackend().then((res) => {
            setMenu(res)
            resolve(true)
          }).catch(reject)
        }
      })
    }

    // 设置菜单
    function setMenu(val: RouteItem[]) {
      menus.value = val
      permissionPaths.value = menus.value.reduce<string[]>(computedPath, [])
    }

    // 计算权限路径
    function computedPath(acc: string[], cur: RouteItem) {
      if (cur.children) {
        cur.children.forEach(item => computedPath(acc, item))
      }
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
