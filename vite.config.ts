import path from 'node:path'
import { defineConfig } from 'vite'
import { plugins } from './plugins'

// https://cn.vitejs.dev/config/
export default defineConfig({
  server: {
    hmr: true,
    host: true,
    open: true,
    port: 9090,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4523/m1/3947489-0-default',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
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

  plugins,
})
