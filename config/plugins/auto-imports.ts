import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { VueRouterAutoImports } from 'unplugin-vue-router'

// https://github.com/antfu/unplugin-auto-import
export function autoImports() {
  return AutoImport({
    imports: [
      'vue',
      'pinia',
      'vue-i18n',
      '@vueuse/core',
      VueRouterAutoImports,
      {
        // add any other imports you were relying on
        'vue-router/auto': ['useLink'],
      },
    ],
    resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
    dts: 'src/auto-imports.d.ts',
    dirs: [
      'src/constants',
      'src/hooks/**/*',
      'src/store',
      'src/utils',
    ],
    vueTemplate: true,
  })
}
