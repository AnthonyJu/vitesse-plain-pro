import path from 'node:path'
import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import { getPlugins } from './plugins'

// https://cn.vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    base: env.VITE_BASE_URL,
    server: {
      hmr: true,
      host: true,
      open: true,
      port: env.VITE_PORT as unknown as number,
      proxy: {
        // '/api': {
        //   target: env.VITE_API_URL,
        //   changeOrigin: true,
        //   rewrite: path => path.replace(/^\/api/, ''),
        // },
      },
    },

    build: {
      outDir: 'dist',
      assetsInlineLimit: 1025 * 5, // 小于5kb的文件转换为base64
      chunkSizeWarningLimit: 1500, // 大于1500kb进行打包警告
      rollupOptions: {
        output: {
          // 打包文件归类
          chunkFileNames: 'assets/js/[name].[hash].js',
          entryFileNames: 'assets/js/[name].[hash].js',
          assetFileNames: 'assets/[ext]/[name].[hash].[ext]',
          // 手动分包，大文件单独打包，减少首屏加载时间
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('element-plus')) {
                return 'element-plus'
              }
              else if (id.includes('zrender')) {
                return 'zrender'
              }
              else if (id.includes('echarts')) {
                return 'echarts'
              }
              else if (id.includes('dayjs')) {
                return 'dayjs'
              }
              else if (id.includes('lodash-es')) {
                return 'lodash-es'
              }
              else if (id.includes('xlsx')) {
                return 'xlsx'
              }
              else if (id.includes('@arcgis/core') || id.includes('@esri')) {
                return 'arcgis'
              }
              else if (id.includes('konva')) {
                return 'konva'
              }
              else if (id.includes('shiki')) {
                return 'shiki'
              }
              else {
                return 'vendor'
              }
            }
          },
        },
      },
    },

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

    plugins: getPlugins(command),
  }
})
