import type { ConfigEnv } from 'vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

// https://github.com/antfu/unplugin-vue-components
export function components(command: ConfigEnv['command']) {
  return Components({
    dts: 'src/components.d.ts',
    include: [/\.vue$/, /\.vue\?vue/],
    exclude: ['src/components/**/*.ts'],
    // 生产环境下按需引入element-plus
    resolvers: command === 'build' ? [ElementPlusResolver({ importStyle: 'sass' })] : undefined,
  })
}
