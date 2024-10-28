import process from 'node:process'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://devtools-next.vuejs.org/guide/vite-plugin
export function vueDevTools() {
  const launchEditor = process.env.VSCODE_GIT_ASKPASS_NODE ? 'code' : 'webstorm'
  return VueDevTools({ launchEditor })
}
