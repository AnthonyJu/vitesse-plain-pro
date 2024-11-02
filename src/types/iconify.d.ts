declare module 'vue' {
  export interface GlobalComponents {
    Iconify: typeof import('@iconify/vue')['Icon']
  }
}

export {}
