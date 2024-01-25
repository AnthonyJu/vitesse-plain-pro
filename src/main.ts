import VueGridLayout from 'vue-grid-layout'
import App from './App.vue'
import './styles/main.scss'
import 'uno.css'
import 'echarts-wordcloud'
import 'cropperjs/dist/cropper.css'
import 'vue-draggable-resizable/style.css'

const app = createApp(App)

const modules = import.meta.glob('./modules/*.ts', { eager: true })
Object.values(modules).reverse().forEach((ctx: any) => {
  ctx.default(app)
})

app.mount('#app')
app.use(VueGridLayout)
