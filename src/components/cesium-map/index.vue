<template>
  <div class="relative full">
    <div :id="cesiumId" class="full" />

    <ScaleBar />

    <div class="absolute bottom-10px right-10px z-10 w-0 flex-col items-end gap-5px">
      <MapModeTool @set-map-mode="setMapMode" />
      <DrawTool />
      <MeasureTool />
      <ZoomTool :center="mapCenter" />
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
import {
  CameraEventType,
  Cartesian3,
  Math as CesiumMath,
  EllipsoidTerrainProvider,
  SceneMode,
  ScreenSpaceEventType,
  UrlTemplateImageryProvider,
  Viewer,
} from 'cesium'
import { useCesium } from '@/composables/use-cesium'
import { TdtTerrainProvider } from './GeoTerrainProvider'

const { terrain = true, cesiumId = 'cesiumId', center } = defineProps<{
  cesiumId?: string
  center?: {
    destination: Cartesian3
    orientation: {
      heading: number
      pitch: number
      roll: number
    }
  }
  terrain?: boolean
}>()

const emit = defineEmits<{
  ready: [viewer: Viewer]
}>()

provide('cesiumId', cesiumId)

window.CESIUM_BASE_URL = './libs/cesium/'

const { registerViewer, unregisterViewer } = useCesium(cesiumId)

// 默认视角
const mapCenter = center || {
  destination: Cartesian3.fromDegrees(103.84, 31.15, 15000000),
  orientation: {
    heading: CesiumMath.toRadians(360),
    pitch: CesiumMath.toRadians(-90),
    roll: CesiumMath.toRadians(0),
  },
}

let viewer: Viewer

onMounted(() => {
  initCesiumViewer()
})

onUnmounted(() => {
  unregisterViewer()
  if (viewer && !viewer.isDestroyed()) viewer.destroy()
})

function initCesiumViewer() {
  // 创建 Cesium Viewer
  viewer = new Viewer(cesiumId, {
    sceneMode: SceneMode.SCENE3D,
    showRenderLoopErrors: false,
    shouldAnimate: true,
    creditContainer: document.createElement('div'), // 隐藏版权信息
    infoBox: false,
    selectionIndicator: false,
    homeButton: false,
    sceneModePicker: false,
    baseLayerPicker: false,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    fullscreenButton: false,
    vrButton: false,
    geocoder: false,
  })

  // 移除默认图层
  viewer.imageryLayers.removeAll()

  // 配置场景
  setupScene()

  // 添加天地图图层
  addTdtLayers()

  // 注册 viewer 到 composable
  registerViewer(viewer)

  // 触发 ready 事件
  emit('ready', viewer)
}

function setupScene() {
  // 抗锯齿
  viewer.scene.postProcessStages.fxaa.enabled = true

  // 设置最小和最大缩放距离
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 100
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 15000000

  // 设置鼠标事件
  viewer.scene.screenSpaceCameraController.zoomEventTypes = [CameraEventType.WHEEL]
  viewer.scene.screenSpaceCameraController.tiltEventTypes = [CameraEventType.RIGHT_DRAG]

  // 双击某个entity之后, 左键只能旋转了, 不能再拖拽地图, 经过查询发现cesium 源码中自带了 entity 的单击和双击事件
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

  // 设置默认视角
  viewer.camera.flyTo({ ...mapCenter, duration: 0 })
}

// 服务域名
const tdtUrl = 'https://t{s}.tianditu.gov.cn'
// 天地图密钥
const tdtToken = '436ce7e50d27eede2f2929307e6b33c0'
// 服务负载子域
const tdtSubdomains = ['0', '1', '2', '3', '4', '5', '6', '7']

function addTdtLayers() {
  // 天地图影像底图
  viewer.imageryLayers.addImageryProvider(
    new UrlTemplateImageryProvider({
      url: `${tdtUrl}/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=${tdtToken}`,
      subdomains: tdtSubdomains,
      maximumLevel: 18,
    }),
  )

  // 天地图影像标注
  viewer.imageryLayers.addImageryProvider(
    new UrlTemplateImageryProvider({
      url: `${tdtUrl}/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=${tdtToken}`,
      subdomains: tdtSubdomains,
    }),
  )
}

// 地图模式
function setMapMode(mode: string) {
  if (mode === '3D' && terrain) {
    // 开启地形
    viewer.scene.globe.depthTestAgainstTerrain = true

    // 天地图地形图层
    const TerrainProvider = TdtTerrainProvider()
    viewer.terrainProvider = new TerrainProvider({
      url: `${tdtUrl}/mapservice/swdx?T=elv_c&x={x}&y={y}&l={z}&tk=${tdtToken}`,
      subdomains: tdtSubdomains,
    }) as any
  }
  else {
    // 关闭地形
    viewer.scene.globe.depthTestAgainstTerrain = false
    viewer.terrainProvider = new EllipsoidTerrainProvider()
  }
}
</script>

<style lang="scss">
@import "/libs/cesium/Widgets/widgets.css";

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
