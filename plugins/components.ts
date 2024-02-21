import process from 'node:process'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://github.com/antfu/unplugin-vue-components
export function components() {
  return Components({
    dts: 'src/components.d.ts',
    include: [/\.vue$/, /\.vue\?vue/],
    exclude: ['src/components/**/components/**/*data/*.ts'],
    // 生产环境下按需引入element-plus
    resolvers: process.env.NODE_ENV === 'production' ? ElementPlusResolver({ importStyle: 'sass' }) : undefined,
    // resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
  })
}
