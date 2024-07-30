import type { RouteRecordRaw } from 'vue-router'
import { routes } from '@/router/routes'

export const useMenuStore = defineStore(
  'menu',
  () => {
    const menus = ref<RouteRecordRaw[]>([])

    function getMenu() {
      return new Promise((resolve) => {
        menus.value = routes as unknown as RouteRecordRaw[]
        resolve(true)
      })
    }

    return {
      menus,
      getMenu,
    }
  },
  {
    persist: {
      storage: sessionStorage,
    },
  },
)

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot))
