<template>
  <div class="relative full">
    <VcConfigProvider :cesium-path="cesiumPath">
      <VcViewer v-bind="viewerConfig" @ready="onReady">
        <VcLayerImagery v-for="item in tdtLayer" :key="item.name">
          <VcImageryProviderUrltemplate v-bind="item" />
        </VcLayerImagery>
        <ScaleBar />
        <slot />
      </VcViewer>
    </VcConfigProvider>
  </div>
</template>

<script setup>
import { TdtTerrainProvider } from '@/utils/cesium/GeoTerrainProvider'
import {
  VcConfigProvider,
  VcImageryProviderUrltemplate,
  VcLayerImagery,
  VcViewer,
} from 'vue-cesium'
import ScaleBar from './scale-bar/index.vue'
import 'vue-cesium/dist/index.css'

// Cesium 资源路径
const cesiumPath = `${location.origin + location.pathname}Cesium/Cesium.js`

// Cesium Viewer 配置
const viewerConfig = {
  cesiumPath,
  sceneMode: 3,
  showCredit: false,
  skeleton: false,
  containerId: 'cesiumContainer',
  // showRenderLoopErrors: false,
  infoBox: false,
  selectionIndicator: false,
}

// 4d7cd169dc5eb26f19c59253685bc202，c9e1d3593f3cc3065d6546f425957ec3，2fc9d4c3ef688d81e9b943d172452123
// 天地图密钥
const tdtToken = 'c9e1d3593f3cc3065d6546f425957ec3'
// 服务域名
const tdtUrl = 'https://t{s}.tianditu.gov.cn/'
// 服务负载子域
const tdtSubdomains = ['0', '1', '2', '3', '4', '5', '6', '7']
// 要加载的图层
const tdtLayer = [
  {
    name: '天地图影像',
    url: `${tdtUrl}DataServer?T=img_w&x={x}&y={y}&l={z}&tk=${tdtToken}`,
    subdomains: tdtSubdomains,
    maximumLevel: 18,
  },
  {
    name: '天地图影像标注',
    url: `${tdtUrl}DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=${tdtToken}`,
    subdomains: tdtSubdomains,
  },
]

// 天地图地形图层
function onReady({ Cesium, viewer }) {
  const TerrainProvider = TdtTerrainProvider(Cesium)
  viewer.terrainProvider = new TerrainProvider({
    url: `${tdtUrl}mapservice/swdx?T=elv_c&x={x}&y={y}&l={z}&tk=${tdtToken}`,
    subdomains: tdtSubdomains,
  })
}
</script>
