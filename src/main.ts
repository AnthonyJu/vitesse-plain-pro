import App from './App.vue'

import './styles/main.scss'
import 'uno.css'
import 'echarts-wordcloud'

const app = createApp(App)

const modules = import.meta.glob('./modules/*.ts', { eager: true })
Object.values(modules).reverse().forEach((ctx: any) => {
  ctx.default(app)
})

app.mount('#app')
