<template>
  <div id="map" full bg="light dark:dark" overflow-hidden />
</template>

<route lang="yaml">
meta:
  name: 自定义弹窗
  fullContent: true
</route>

<script setup lang='ts'>
import type { App } from 'vue'
import Point from '@arcgis/core/geometry/Point'
import Graphic from '@arcgis/core/Graphic'
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol'
import { createApp } from 'vue'
import CustomPopup from './components/CustomPopup.vue'

const { view } = useArcgis('map')

// 创建点
const point = new Point({ x: 120.38, y: 36.06 })
const graphic = new Graphic({
  geometry: point,
  symbol: new SimpleMarkerSymbol({
    color: [226, 119, 40],
    outline: {
      color: [255, 255, 255],
      width: 2,
    },
  }),
  attributes: {
    name: '自定义弹窗',
  },
})

// 定义 Popup 组件
let popup: App<Element> | null = null

onMounted(() => {
  // 创建 Popup 组件的 content
  const content = document.createElement('div')
  content.style.position = 'absolute'
  // 将 constent 添加到地图容器中
  document.getElementById('map')!.appendChild(content)

  // 创建点的 Graphic
  view.graphics.add(graphic)

  // 监听点击事件
  view.on('click', (event) => {
    view.hitTest(event).then((response) => {
      const res = response.results[0]
      if (res?.type === 'graphic' && res?.graphic?.attributes?.name === '自定义弹窗') {
        if (!popup) {
          popup = createApp(CustomPopup, {
            view,
            attributes: res.graphic.attributes,
            onClosePopup: () => {
              popup!.unmount()
              popup = null
            },
          })
          popup.mount(content)
        }
      }
    })
  })

  // 监听地图中心点变化
  view.watch('center', () => {
    // 将Popup点坐标转为屏幕坐标
    const screenPoint = view.toScreen(point)
    // content 的定位改为屏幕坐标
    content.style.left = `${screenPoint.x - 200}px`
    content.style.top = `${screenPoint.y - 200}px`
    // TODO 底部中心点
  })
})
</script>
