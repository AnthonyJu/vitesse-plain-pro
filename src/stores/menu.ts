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
            meta: { name: 'Unity 交互', icon: 'carbon-3d-mpr-toggle' },
            name: 'unity',
            path: '/unity-in-web',
            children: [],
          },
          {
            meta: { name: 'i18n 国际化', icon: 'carbon-ibm-watson-language-translator' },
            name: 'i18n',
            path: '/i18n',
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
          {
            meta: { name: '正则合集', icon: 'carbon-test-tool' },
            path: '/regexps',
            children: [],
          },
          {
            meta: { name: '组件封装', icon: 'carbon-cics-system-group' },
            ...generateInfo(allPages, 'excellent-components'),
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
    persist: {
      storage: sessionStorage,
    },
  },
)

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot))
