// import VueCesium from 'vue-cesium'
import App from './App.vue'

import './styles/main.scss'

import 'uno.css'

const app = createApp(App)

// app.use(VueCesium, {
//   cesiumPath: '/cesium/Cesium.js',
// })

const modules = import.meta.glob('./modules/*.ts', { eager: true })
Object.values(modules).reverse().forEach((ctx: any) => {
  ctx.default(app)
})

app.mount('#app')
