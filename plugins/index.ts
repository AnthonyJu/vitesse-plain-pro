import type { ConfigEnv } from 'vite'
import { autoImports } from './auto-imports'
import { components } from './components'
import { elementPlus } from './element-plus'
import { layouts } from './layouts'
import { routeNameAsComponentName } from './routeNameAsComponentName'
import { svgLoader } from './svg-loader'
import { unocss } from './unocss'
import { vitePWA } from './vite-pwa'
import { vue } from './vue'
import { vueDevTools } from './vue-devtools'
import { vueI18n } from './vue-i18n'
import { vueRouter } from './vue-router'

export function getPlugins(command: ConfigEnv['command']) {
  return [
    vueRouter(),
    vue(),
    routeNameAsComponentName(),
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
