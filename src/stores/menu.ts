import type { RouteRecordRaw } from 'vue-router'
import { routes } from 'vue-router/auto/routes'

export const useMenuStore = defineStore(
  'menu',
  () => {
    const menus = ref<RouteRecordRaw[]>([])

    function getMenu() {
      // TODO 使用真实接口获取菜单
      return new Promise((resolve) => {
        const allPages = routes.filter(page => !['/', '/login', '/401', '/:all(.*)'].includes(page.path))
        menus.value = [
          {
            meta: { name: '首页', icon: 'carbon-home' },
            name: 'home',
            path: '/home',
            children: [],
          },
          {
            meta: { name: 'Unity 交互', icon: 'carbon-map' },
            name: 'unity',
            path: '/unity-in-web',
            children: [],
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
      const children = allPages.find(page => page.path === `/${name}`)?.children
      return {
        name,
        path: `/${name}`,
        children: children?.map(el => ({ ...el, path: `/${name}/${el.path}` })) || [],
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
