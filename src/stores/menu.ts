import type { RouteRecordRaw } from 'vue-router'
import { routes } from 'vue-router/auto/routes'

export const useMenuStore = defineStore(
  'menu',
  () => {
    const menus = ref<RouteRecordRaw[]>([])

    function getMenu() {
      // TODO 模拟从接口获取菜单
      return new Promise((resolve) => {
        const allPages = routes.filter(page => !['/', '/login', '/401', '/:all(.*)'].includes(page.path))
        menus.value = [
          {
            meta: { name: '首页', icon: 'carbon-home' },
            ...generateInfo(allPages, 'home'),
          },
          {
            meta: { name: 'J 组件', icon: 'carbon-dicom-overlay' },
            ...generateInfo(allPages, 'j-components'),
          },
          {
            meta: { name: 'ArcGIS', icon: 'carbon-map' },
            ...generateInfo(allPages, 'arcgis'),
          },
          {
            meta: { name: 'Vue-ECharts', icon: 'carbon-chart-multitype' },
            ...generateInfo(allPages, 'vue-echarts'),
          },
        ]
        resolve(true)
      })
    }

    function generateInfo(allPages: RouteRecordRaw[], name: string) {
      return {
        name,
        path: `/${name}`,
        children: allPages.find(page => page.path === `/${name}`)?.children || [],
      }
    }
    return {
      menus,
      getMenu,
    }
  },
  {
    persist: true,
  },
)

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot))
