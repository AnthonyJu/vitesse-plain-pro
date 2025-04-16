import Vue from '@vitejs/plugin-vue'

// https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#readme
export function vue() {
  return Vue({
    // include: [/\.vue$/],
    template: {
      compilerOptions: {
        isCustomElement: tag => (tag.startsWith('Tres') && tag !== 'TresCanvas') || tag === 'primitive',
      },
    },
  })
}
