import AutoImport from 'unplugin-auto-import/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

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
      'src/composables/**/*',
      'src/events',
      'src/stores',
      'src/utils',
    ],
    vueTemplate: true,
  })
}
