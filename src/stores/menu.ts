import type { RouteRecordRaw } from 'vue-router'
import pages from '~pages'

export const useMenuStore = defineStore(
  'menu',
  () => {
    const menu = ref<RouteRecordRaw[]>([])

    function getMenu() {
      // TODO 模拟从接口获取菜单
      return new Promise((resolve) => {
        menu.value = pages
        resolve(true)
      })
    }

    return {
      menu,
      getMenu,
    }
  },
  {
    persist: true,
  },
)

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot))
