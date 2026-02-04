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
      '/web_caps': {
        target: 'http://222.134.24.110:18086/',
        changeOrigin: true,
      },
      '/RPC2': {
        target: 'http://222.134.24.110:18086/',
        changeOrigin: true,
      },
      '/RPC2_Login': {
        target: 'http://222.134.24.110:18086/',
        changeOrigin: true,
      },
      '/RPC_Loadfile': {
        target: 'http://222.134.24.110:18086/',
        changeOrigin: true,
      },
      '/module': {
        target: 'http://localhost:5050/',
        rewrite: path => path.replace('/module', '/libs/dh-nvr-sdk/module'),
      },
      '/rtspoverwebsocket': {
        ws: true,
        target: 'http://222.134.24.110:18086/',
        changeOrigin: true,
      },
    },
  }
}

export default serverConfig
