import type { ConfigEnv, UserConfig } from 'vite'
import process from 'node:process'
import { loadEnv } from 'vite'

function serverConfig(mode: ConfigEnv['mode']): UserConfig['server'] {
  const env = loadEnv(mode, process.cwd()) as ImportMetaEnv
  const api = env.API_BASE_URL
  return {
    hmr: true,
    host: true,
    open: true,
    port: env.VITE_PORT,
    proxy: {
      [api]: {
        target: env.VITE_API_URL,
        changeOrigin: true,
        rewrite: path => path.replace(api, ''),
      },

      // 大华
      '/rtspoverwebsocket': {
        ws: true,
        target: 'xxx',
        changeOrigin: true,
      },
      '/web_caps': {
        target: 'xxx',
        changeOrigin: true,
      },
      '^/(RPC2|RPC2_Login|RPC_Loadfile)': {
        target: 'xxx',
        changeOrigin: true,
      },
      '/module': {
        target: 'http://localhost:5050/',
        rewrite: path => path.replace('/module', '/libs/dh-nvr-sdk/module'),
      },

      // 海康
      '^/(ISAPI|SDK)': {
        target: 'http://192.168.1.194',
        changeOrigin: true,
      },

      '^/webSocketVideoCtrlProxy': {
        target: 'http://192.168.1.194',
        ws: true,
        changeOrigin: true,
      },
    },
  }
}

export default serverConfig
