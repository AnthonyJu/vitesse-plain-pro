import gridLayout  from 'vue-grid-layout'
import VueDraggableResizable from 'vue-draggable-resizable'
import App from './App.vue'
import './styles/main.scss'
import 'uno.css'
import 'echarts-wordcloud'
import 'vue-draggable-resizable/style.css'

const app = createApp(App)
app.component('vue-draggable-resizable', VueDraggableResizable)

const modules = import.meta.glob('./modules/*.ts', { eager: true })
Object.values(modules).reverse().forEach((ctx: any) => {
  ctx.default(app)
})

app.mount('#app')
app.use(gridLayout)
