import type { RouteItem } from '@/router/routes'
import { getMenuFromBackend } from '@/router/fromBackend'
import { getMenuFromFrontend } from '@/router/fromFrontend'

export const useMenuStore = defineStore(
  'menu',
  () => {
    // 是否前端控制菜单
    const isFrontendCtrl = true
    const loading = ref(false)
    // 菜单
    const menus = ref<RouteItem[]>([])
    // 权限路径
    const permissionPaths = ref<string[]>([])

    // 获取菜单
    function getMenu() {
      loading.value = true
      if (isFrontendCtrl) {
        // ! 模拟异步请求，查看Permission的loading，实际开发中请删除
        return new Promise((resolve) => {
          setTimeout(() => {
            setMenu(getMenuFromFrontend())
            resolve(true)
            loading.value = false
          }, 3000)
        })
      }
      else {
        return getMenuFromBackend()
          .then((res) => {
            setMenu(res)
          })
          .finally(() => {
            loading.value = false
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

        // 计算隐藏的子路由
        const hideChildren = cur.children.filter(item => item.meta.isHide)
        // 有隐藏的子路由，则递归计算
        if (hideChildren.length) hideChildren.forEach(item => computedPath(acc, item))
      }
      // 没有子路由，则加入权限路径
      else {
        acc.push(cur.path)
      }
      return acc
    }

    return {
      loading,
      menus,
      getMenu,
      permissionPaths,
    }
  },
)

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot))
