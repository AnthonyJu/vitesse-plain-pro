import type { ConfigEnv, UserConfig } from 'vite'
import process from 'node:process'
import { loadEnv } from 'vite'

function buildConfig(mode: ConfigEnv['mode']): UserConfig['build'] {
  const env = loadEnv(mode, process.cwd())
  return {
    outDir: env.VITE_OUT_DIR,
    assetsInlineLimit: 1025 * 5, // 小于5kb的文件转换为base64
    chunkSizeWarningLimit: 1500, // 大于1500kb进行打包警告
    rollupOptions: {
      output: {
        // 打包文件归类
        chunkFileNames: 'assets/js/[name].[hash].js',
        entryFileNames: 'assets/js/[name].[hash].js',
        assetFileNames: 'assets/[ext]/[name].[hash].[ext]',
        // 手动分包，大文件单独打包
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
  }
}

export default buildConfig
