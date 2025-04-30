<template>
  <div class="relative full">
    <VcConfigProvider :cesium-path="cesiumPath">
      <VcViewer v-bind="viewerConfig" @ready="onReady">
        <VcLayerImagery v-for="item in tdtLayer" :key="item.name">
          <VcImageryProviderUrltemplate v-bind="item" />
        </VcLayerImagery>
        <slot />
      </VcViewer>
    </VcConfigProvider>
  </div>
</template>

<script setup lang="ts">
import type { VcReadyObject } from 'vue-cesium/es/utils/types'
import { TdtTerrainProvider } from '@/plugin/cesium/GeoTerrainProvider'
// @ts-expect-error no exported
import { VcConfigProvider, VcImageryProviderUrltemplate, VcLayerImagery, VcViewer } from 'vue-cesium'
import 'vue-cesium/dist/index.css'

const { cesiumId = DEFAULT_CESIUM_ID } = defineProps<{
  cesiumId?: string
}>()

// Cesium 资源路径
const cesiumPath = `${location.origin + location.pathname}cesium/Cesium.js`

// Cesium Viewer 配置
const viewerConfig = {
  cesiumPath,
  containerId: cesiumId,
  sceneMode: 3,
  showCredit: false,
  // skeleton: false,
  infoBox: false,
  selectionIndicator: false,
  showRenderLoopErrors: false,
  shouldAnimate: true,
}

// 4d7cd169dc5eb26f19c59253685bc202，c9e1d3593f3cc3065d6546f425957ec3，2fc9d4c3ef688d81e9b943d172452123，436ce7e50d27eede2f2929307e6b33c0
// 天地图密钥
const tdtToken = '436ce7e50d27eede2f2929307e6b33c0'
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

// VueCesium 实例准备完成
function onReady(vc: VcReadyObject) {
  // 抗锯齿
  vc.viewer.scene.postProcessStages.fxaa.enabled = true

  // 设置最小和最大缩放距离
  vc.viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100
  vc.viewer.scene.screenSpaceCameraController.maximumZoomDistance = 15000000

  // 设置鼠标事件
  vc.viewer.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.WHEEL]
  vc.viewer.scene.screenSpaceCameraController.tiltEventTypes = [Cesium.CameraEventType.RIGHT_DRAG]

  // 开启地形
  vc.viewer.scene.globe.depthTestAgainstTerrain = true

  // 天地图地形图层
  const TerrainProvider = TdtTerrainProvider(vc.Cesium)
  // @ts-expect-error lack of type
  vc.viewer.terrainProvider = new TerrainProvider({
    url: `${tdtUrl}mapservice/swdx?T=elv_c&x={x}&y={y}&l={z}&tk=${tdtToken}`,
    subdomains: tdtSubdomains,
  })
}
</script>

<style lang="scss">
.cesium-tool-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  color: #fff;
  cursor: pointer;
  background-color: rgb(0 0 0 / 60%);
  border-radius: 5px;

  &:hover {
    background-color: rgb(0 0 0 / 80%);
  }
}
</style>
