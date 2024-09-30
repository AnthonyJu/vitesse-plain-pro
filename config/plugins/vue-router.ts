import VueRouter from 'unplugin-vue-router/vite'
import { flatRoutes } from '../../src/router/routes'

// https://github.com/posva/unplugin-vue-router
export function vueRouter() {
  return VueRouter({
    extensions: ['.vue'],
    routeBlockLang: 'yaml',
    dts: 'src/typed-router.d.ts',
    exclude: ['**/components/**/*'],
    extendRoute(route) {
      // Add route meta from `src/router/routes.ts`
      const matchRoute = flatRoutes.find(item => item.path === route.fullPath)
      if (matchRoute) route.addToMeta(matchRoute.meta)
    },
  })
}
