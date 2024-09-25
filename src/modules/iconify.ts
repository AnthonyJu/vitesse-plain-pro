import type { App } from 'vue'
import { Icon } from '@iconify/vue'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    Iconify: typeof Icon
  }
}

// https://iconify.design/
export default (app: App) => app.component('Iconify', Icon)
