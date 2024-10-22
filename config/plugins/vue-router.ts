import VueRouter from 'unplugin-vue-router/vite'

// https://github.com/posva/unplugin-vue-router
export function vueRouter() {
  return VueRouter({
    extensions: ['.vue'],
    routeBlockLang: 'json',
    dts: 'src/typed-router.d.ts',
    exclude: ['**/components/**/*'],
  })
}
