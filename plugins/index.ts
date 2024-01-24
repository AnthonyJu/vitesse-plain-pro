import { autoImports } from './auto-imports'
import { components } from './components'
import { elementPlus } from './element-plus'
import { layouts } from './layouts'
import { unocss } from './unocss'
import { vitePWA } from './vite-pwa'
import { vueDevTools } from './vue-devtools'
import { vueI18n } from './vue-i18n'
import { vueRouter } from './vue-router'
import { vue } from './vue'
import { webFontDownload } from './web-font-download'

export const plugins = [
  autoImports(),
  components(),
  elementPlus(),
  layouts(),
  unocss(),
  vitePWA(),
  vueDevTools(),
  vueRouter(),
  vueI18n(),
  vue(),
  webFontDownload(),
]
