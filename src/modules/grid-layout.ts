import type { App } from 'vue'
import VueGridLayout from 'vue-grid-layout'

export default (app: App) => {
  app.use(VueGridLayout)
}
