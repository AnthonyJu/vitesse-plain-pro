import path from 'node:path'
import { defineConfig } from 'vite'
import { getPlugins } from './plugins'

// https://cn.vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    server: {
      hmr: true,
      host: true,
      open: true,
      port: 5050,
      proxy: {
      // '/api': {
      //   target: 'http://localhost:5500/',
      //   changeOrigin: true,
      //   rewrite: path => path.replace(/^\/api/, ''),
      // },
      },
    },

    resolve: {
      alias: {
        '@/': `${path.resolve(__dirname, 'src')}/`,
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

    plugins: getPlugins(command),
  }
})
