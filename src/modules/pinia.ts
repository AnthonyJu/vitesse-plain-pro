import type { App } from 'vue'
import piniaPersist from 'pinia-plugin-persistedstate'

// https://pinia.vuejs.org/
const pinia = createPinia()
pinia.use(piniaPersist)

// TODO 刷新后就不好使了
// 保证 setup 方式的 store 也能使用 $reset 方法
pinia.use(({ store }) => {
  // 保存初始状态
  const initialState = JSON.parse(JSON.stringify(store.$state))

  // 重写 reset 方法
  store.$reset = () => {
    store.$patch(initialState)
  }
})

export default (app: App) => app.use(pinia)
