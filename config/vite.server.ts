import type { ConfigEnv, UserConfig } from 'vite'
import process from 'node:process'
import { loadEnv } from 'vite'

function serverConfig(mode: ConfigEnv['mode']): UserConfig['server'] {
  const env = loadEnv(mode, process.cwd())
  const api = env.API_BASE_URL
  return {
    hmr: true,
    host: true,
    open: true,
    port: env.VITE_PORT as unknown as number,
    proxy: {
      [api]: {
        target: env.VITE_API_URL,
        changeOrigin: true,
        rewrite: path => path.replace(api, ''),
      },
    },
  }
}

export default serverConfig
