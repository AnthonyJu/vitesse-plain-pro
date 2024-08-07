declare interface Window {
  // extend the window
  [key: string]: any
}

declare module 'vue-grid-layout'
declare module 'vue-draggable-resizable'

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
