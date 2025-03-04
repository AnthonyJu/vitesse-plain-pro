import { templateCompilerOptions } from '@tresjs/core'
import Vue from '@vitejs/plugin-vue'

// https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#readme
export function vue() {
  return Vue({
    include: [/\.vue$/],
    ...templateCompilerOptions,
  })
}
