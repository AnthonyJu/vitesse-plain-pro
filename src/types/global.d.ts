interface AnyObject {
  [key: string]: unknown
}

interface Res<T> {
  status: number
  message?: string
  data: T
}

declare module 'vue' {
  export interface GlobalComponents {
    Iconify: typeof import('@iconify/vue')['Icon']
  }
}

export {}
