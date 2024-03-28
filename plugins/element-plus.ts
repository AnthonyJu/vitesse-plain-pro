import type { ConfigEnv, Plugin } from 'vite'

// 开发环境完整引入element-plus
export function elementPlus(command: ConfigEnv['command']): Plugin {
  return {
    name: 'vite:element-plus-auto-import-in-dev',
    transform(code, id) {
      if (command === 'serve' && /src\/main.ts$/.test(id)) {
        return {
          code: `
            import ElementPlus from 'element-plus'
            import 'element-plus/theme-chalk/src/index.scss'
            ${code.split('const app = createApp(App)').join('const app = createApp(App);app.use(ElementPlus);')};
          `,
          map: null,
        }
      }
    },
  }
}
