import VueRouter from 'vue-router/vite'

// https://github.com/vuejs/router
export function vueRouter() {
  return VueRouter({
    extensions: ['.vue'],
    dts: 'src/route-map.d.ts',
  })
}
