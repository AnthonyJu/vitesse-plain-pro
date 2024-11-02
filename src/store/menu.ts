import { getMenuFromBackend } from '@/router/from-backend'
import { getMenuFromFrontend } from '@/router/from-frontend'

export const useMenuStore = defineStore(
  'menu',
  () => {
    // 加载中
    const loading = ref(false)
    // 是否前端控制菜单
    const isFrontendCtrl = true
    // 菜单
    const menus = ref<RouteItem[]>([])
    // 按钮
    const buttons = ref<string[]>([])
    // 权限路径
    const permissionPaths = ref<string[]>([])

    const tagsViewStore = useTagsViewStore()

    // 获取菜单
    function getMenu() {
      if (isFrontendCtrl) {
        setMenu(getMenuFromFrontend())
      }
      else {
        loading.value = true
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

    // 计算权限路径，并筛选出固定标签
    function computedPath(acc: string[], cur: RouteItem) {
      acc.push(cur.path)
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
      // 筛选出固定标签
      else if (cur.meta.isAffix) {
        tagsViewStore.addAffixTag(cur)
      }
      return acc
    }

    return {
      loading,
      menus,
      buttons,
      getMenu,
      permissionPaths,
    }
  },
)

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot))
