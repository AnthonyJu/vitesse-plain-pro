import type { NavigationGuardNext, RouteLocationNormalizedTyped, RouteRecordRaw } from 'vue-router'
import { routes } from '@/router/routes'

export const useMenuStore = defineStore(
  'menu',
  () => {
    // 是否前端控制菜单
    const isFrontendCtrl = true
    const menus = ref<RouteRecordRaw[]>([])

    // 获取菜单
    function getMenu() {
      return new Promise((resolve, reject) => {
        if (isFrontendCtrl) {
          getMenuFromFrontend()
          resolve(true)
        }
        else {
          getMenuFromBackend()
            .then(() => {
              resolve(true)
            })
            .catch((err) => {
              reject(err)
            })
        }
      })
    }

    // 从前端获取菜单
    function getMenuFromFrontend() {
      // TODO：模拟筛选，根据登录用户权限菜单
      menus.value = routes as unknown as RouteRecordRaw[]
      menus.value = routes as unknown as RouteRecordRaw[]
    }

    // 从后端获取菜单
    async function getMenuFromBackend() {
      // TODO：从后端获取菜单
    }

    // 判断菜单权限
    function hasMenuPermission(
      to: RouteLocationNormalizedTyped,
      from: RouteLocationNormalizedTyped,
      next: NavigationGuardNext,
    ) {
      next()
    }

    return {
      menus,
      getMenu,
      hasMenuPermission,
    }
  },
  {
    persist: {
      storage: sessionStorage,
    },
  },
)

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot))
