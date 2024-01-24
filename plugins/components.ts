import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://github.com/antfu/unplugin-vue-components
export function components() {
  return Components({
    dts: 'src/components.d.ts',
    include: [/\.vue$/, /\.vue\?vue/],
    exclude: ['src/components/**/components/**/*data/*.ts'],
    resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
  })
}
