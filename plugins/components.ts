import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import type { ConfigEnv } from 'vite'

// https://github.com/antfu/unplugin-vue-components
export function components(command: ConfigEnv['command']) {
  return Components({
    dts: 'src/components.d.ts',
    include: [/\.vue$/, /\.vue\?vue/],
    exclude: ['src/components/**/components/**/*data/*.ts'],
    // 生产环境下按需引入element-plus
    resolvers: command === 'build' ? ElementPlusResolver({ importStyle: 'sass' }) : undefined,
  })
}
