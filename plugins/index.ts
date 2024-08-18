import type { ConfigEnv } from 'vite'
import { autoImports } from './auto-imports'
import { components } from './components'
import { elementPlus } from './element-plus'
import { layouts } from './layouts'
import { svgLoader } from './svg-loader'
import { unocss } from './unocss'
import { vitePWA } from './vite-pwa'
import { vueDevTools } from './vue-devtools'
import { vueI18n } from './vue-i18n'
import { syncRouteName, vueRouter } from './vue-router'
import { vue } from './vue'

export function getPlugins(command: ConfigEnv['command']) {
  return [
    vueRouter(),
    vue(),
    syncRouteName(),
    vueI18n(),
    autoImports(),
    components(command),
    elementPlus(command),
    layouts(),
    svgLoader(),
    unocss(),
    vueDevTools(),
    vitePWA(),
  ]
}
