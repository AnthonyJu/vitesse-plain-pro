<template>
  <div id="map" full bg="light dark:dark" />
</template>

<route lang="yaml">
meta:
  name: 自定义弹窗
</route>

<script setup lang='ts'>
import { createApp } from 'vue'
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import CustomPopup from './components/CustomPopup.vue'
import '@arcgis/core/assets/esri/themes/light/main.css'

onMounted(() => {
  // 创建 Map 实例
  const map = new Map({ basemap: 'streets-navigation-vector' })

  // 创建 MapView 实例
  const view = new MapView({
    container: 'map',
    map,
    center: [120.38, 36.06],
    zoom: 13,
  })

  // 创建 Popup 组件的 content
  const content = document.createElement('div')
  createApp(CustomPopup, {
    view,
    onEventEmit: (arg: any) => {
      // eslint-disable-next-line no-alert
      alert(arg)
    },
  }).mount(content)

  view.when(() => {
    // 禁用弹出窗口自动出现，并使用单击事件手动打开弹出窗口。
    view.popupEnabled = false
    view.on('click', (e) => {
      // 把title当做id，通过title来判断是否是当前自定义的Popup组件
      if (!view.popup.visible && view.popup.title !== 'custom popup') {
        document.body.style.cursor = 'progress'
      }
      view.openPopup({ title: 'custom popup', content, location: e.mapPoint })
    })
  })
})
</script>
