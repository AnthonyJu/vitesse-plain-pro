interface ImportMetaEnv {
  [key: string]: any
  readonly VITE_PORT: number
  readonly VITE_BASE_URL: string
  readonly VITE_OUT_DIR: string
  readonly VITE_REDIRECT_PATH: string
  readonly API_BASE_URL: string
  readonly VITE_API_URL: string
}

declare module 'vue-draggable-resizable'

declare interface Window {
  // extend the window
  [key: string]: any
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}
