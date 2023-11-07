import type { RouteRecordRaw } from 'vue-router'
import pages from '~pages'

export const useMenuStore = defineStore(
  'menu',
  () => {
    const menu = ref<RouteRecordRaw[]>([])

    function getMenu() {
      // TODO 模拟从接口获取菜单
      return new Promise((resolve) => {
        const allPages = pages.filter(page => !['/login', '/401', '/:all(.*)*'].includes(page.path))
        menu.value = [
          {
            ...allPages.find(page => page.path === '/home')!,
          },
          {
            name: 'j-components',
            path: '/j-components',
            meta: {
              name: 'J 组件',
            },
            children: allPages.filter(page => page.path.startsWith('/j-components'))!,
          },
          {
            name: 'arcgis',
            path: '/arcgis',
            meta: {
              name: 'ArcGIS',
            },
            children: allPages.filter(page => page.path.startsWith('/arcgis'))!,
          },
          {
            name: 'vue-echarts',
            path: '/vue-echarts',
            meta: {
              name: 'Vue-ECharts',
            },
            children: allPages.filter(page => page.path.startsWith('/vue-echarts'))!,
          },
        ]
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
