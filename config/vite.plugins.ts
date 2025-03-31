import type { ConfigEnv } from 'vite'
import { autoImports } from './plugins/auto-imports'
import { cesium } from './plugins/cesium'
import { components } from './plugins/components'
import { elementPlus } from './plugins/element-plus'
import { generateComponentName } from './plugins/generate-component-name'
import { svgLoader } from './plugins/svg-loader'
import { unocss } from './plugins/unocss'
import { vitePWA } from './plugins/vite-pwa'
import { vue } from './plugins/vue'
import { vueDevTools } from './plugins/vue-devtools'
import { vueI18n } from './plugins/vue-i18n'
import { vueJsx } from './plugins/vue-jsx'
import { layouts } from './plugins/vue-layouts'
import { vueRouter } from './plugins/vue-router'

function pluginsConfig(command: ConfigEnv['command']) {
  return [
    vueRouter(),
    vue(),
    vueJsx(),
    generateComponentName(),
    vueI18n(),
    autoImports(),
    components(command),
    elementPlus(command),
    layouts(),
    svgLoader(),
    unocss(),
    cesium(),
    vueDevTools(),
    vitePWA(),
  ]
}

export default pluginsConfig
