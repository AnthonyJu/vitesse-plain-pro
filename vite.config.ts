import path from 'node:path'
import process from 'node:process'
import buildConfig from 'config/vite.build'
import serverConfig from 'config/vite.server'
import { defineConfig, loadEnv } from 'vite'
import pluginsConfig from './config/vite.plugins'

// https://cn.vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    base: env.VITE_BASE_URL,

    server: serverConfig(mode),
    build: buildConfig(mode),
    plugins: pluginsConfig(command),

    resolve: {
      alias: {
        '@': `${path.resolve(__dirname, 'src')}`,
      },
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/styles/element/index.scss" as *;',
        },
      },
    },

    optimizeDeps: {
      include: [
        '@element-plus/icons-vue',
        '@vueuse/core',
        'axios',
        'element-plus/es',
        'element-plus/es/components/base/style/index',
        'element-plus/es/components/message/style/index',
        'element-plus/es/components/message-box/style/index',
        'element-plus/es/components/notification/style/index',
        'unplugin-vue-router/runtime',
        'unplugin-vue-router/data-loaders/basic',
      ],
    },
  }
})
