import type { App } from 'vue'
import { authDirective } from './auth'

export default (app: App) => {
  authDirective(app)
}
