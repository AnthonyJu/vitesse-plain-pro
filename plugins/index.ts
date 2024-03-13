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

export const plugins = [
  vueRouter(),
  vue(),
  supportSetupName(),
  vueI18n(),
  autoImports(),
  components(),
  elementPlus(),
  layouts(),
  unocss(),
  vueDevTools(),
  vitePWA(),
]
