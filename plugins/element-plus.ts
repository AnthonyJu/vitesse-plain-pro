import process from 'node:process'
import type { Plugin } from 'vite'

// 开发环境完整引入element-plus
export function elementPlus(): Plugin {
  return {
    name: 'vite:element-plus-auto-import-in-dev',
    transform(code, id) {
      if (process.env.NODE_ENV === 'development' && /src\/main.ts$/.test(id)) {
        return {
          code: `
            import ElementPlus from 'element-plus';
            import 'element-plus/dist/index.css';
            ${code.split('const app = createApp(App)').join('const app = createApp(App);app.use(ElementPlus);')};
          `,
          map: null,
        }
      }
    },
  }
}
