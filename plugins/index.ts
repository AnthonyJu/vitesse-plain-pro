import type { ConfigEnv } from 'vite'
import { autoImports } from './auto-imports'
import { components } from './components'
import { elementPlus } from './element-plus'
import { layouts } from './layouts'
import { supportSetupName } from './vue-support-setup-name'
import { unocss } from './unocss'
import { vitePWA } from './vite-pwa'
import { vueDevTools } from './vue-devtools'
import { vueI18n } from './vue-i18n'
import { vueRouter } from './vue-router'
import { vue } from './vue'

export function getPlugins(command: ConfigEnv['command']) {
  return [
    vueRouter(),
    vue(),
    supportSetupName(),
    vueI18n(),
    autoImports(),
    components(command),
    elementPlus(command),
    layouts(),
    unocss(),
    vueDevTools(),
    vitePWA(),
  ]
}
