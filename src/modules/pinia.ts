import type { App } from 'vue'
import piniaPersist from 'pinia-plugin-persistedstate'

// https://pinia.vuejs.org/
const pinia = createPinia()
pinia.use(piniaPersist)

// 保证 setup 方式的 store 也能使用 $reset 方法
pinia.use(({ store }) => {
  // 保存初始状态
  const key = `${store.$id}_init`
  Local.set(key, JSON.stringify(store.$state))

  // 重写 reset 方法
  store.$reset = () => {
    const state = Local.get(key)
    if (state) store.$patch(JSON.parse(state))
  }
})

export default (app: App) => app.use(pinia)
