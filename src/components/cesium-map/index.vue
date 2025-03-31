<template>
  <div id="cesium-map" class="relative full">
    <div class="absolute bottom-10px left-10px z-10">
      <slot name="left-bottom" />
      <ScaleBar />
    </div>

    <div id="tool-rb" class="absolute bottom-10px right-10px z-10 flex-col gap-5px">
      <slot name="right-bottom" />
      <Measure />
      <ZoomController :center="center" />
    </div>

    <slot />
  </div>
</template>

<script setup lang='ts'>
import {
  CameraEventType,
  Cartesian3,
  CesiumTerrainProvider,
  Color,
  GeoJsonDataSource,
  Math,
  SceneMode,
  Terrain,
  UrlTemplateImageryProvider,
  Viewer,
  WebMercatorTilingScheme,
} from 'cesium'

import Measure from './components/measure/index.vue'
import ScaleBar from './components/scale-bar/index.vue'
import ZoomController from './components/zoom-controller/index.vue'

const token = '4d7cd169dc5eb26f19c59253685bc202'
// 服务域名
const tdtUrl = 'https://t{s}.tianditu.gov.cn/'
// 服务负载子域
const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']

const viewer = shallowRef<Viewer | null>(null)
provide('viewer', viewer)

const center = Cartesian3.fromDegrees(103.84, 31.15, 15000000)

function initCesiumMap() {
  viewer.value = new Viewer('cesium-map', {
    animation: false,
    baseLayerPicker: false,
    fullscreenButton: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    selectionIndicator: false,
    timeline: false,
    navigationHelpButton: false,
    showRenderLoopErrors: false,
    sceneMode: SceneMode.SCENE3D,
    creditContainer: document.createElement('div'),
  })

  // 抗锯齿
  viewer.value.scene.postProcessStages.fxaa.enabled = true

  // 设置最小和最大缩放距离
  viewer.value.scene.screenSpaceCameraController.minimumZoomDistance = 100
  viewer.value.scene.screenSpaceCameraController.maximumZoomDistance = 20000000

  // 设置鼠标事件
  viewer.value.scene.screenSpaceCameraController.zoomEventTypes = [CameraEventType.WHEEL]
  viewer.value.scene.screenSpaceCameraController.tiltEventTypes = [CameraEventType.RIGHT_DRAG]

  // 将三维球定位到中国
  viewer.value!.camera.setView({
    destination: center,
    orientation: {
      heading: Math.toRadians(360),
      pitch: Math.toRadians(-90),
      roll: Math.toRadians(0),
    },
  })
}

function addLayerServer() {
  // 叠加Cesium默认地形
  // const terrain = Terrain.fromWorldTerrain({
  //   requestVertexNormals: true,
  //   requestWaterMask: false,
  // })
  // 如果是arcgis地形服务，使用ArcGISTiledElevationTerrainProvider
  // const terrain = new Terrain(
  //   ArcGISTiledElevationTerrainProvider.fromUrl(
  //     'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer',
  //   ),
  // )
  // 如果是自定义地形服务，使用CesiumTerrainProvider
  const terrain = new Terrain(
    CesiumTerrainProvider.fromUrl(
      'https://terrain.kitebeam.com/airdwing/terrain',
    ),
  )
  viewer.value!.scene.setTerrain(terrain)

  // 叠加影像服务
  const imgMap = new UrlTemplateImageryProvider({
    url: `${tdtUrl}DataServer?T=img_w&x={x}&y={y}&l={z}&tk=${token}`,
    subdomains,
    tilingScheme: new WebMercatorTilingScheme(),
    maximumLevel: 18,
  })
  viewer.value!.imageryLayers.addImageryProvider(imgMap)

  // 叠加国界服务
  const iboMap = new UrlTemplateImageryProvider({
    url: `${tdtUrl}DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=${token}`,
    subdomains,
    tilingScheme: new WebMercatorTilingScheme(),
    maximumLevel: 10,
  })
  viewer.value!.imageryLayers.addImageryProvider(iboMap)

  // 叠加影像注记
  const ciaMap = new UrlTemplateImageryProvider({
    url: `${tdtUrl}DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=${token}`,
    subdomains,
    tilingScheme: new WebMercatorTilingScheme(),
    maximumLevel: 18,
  })
  viewer.value!.imageryLayers.addImageryProvider(ciaMap)

  // 叠加禁飞区geojson
  const noFlyZone = GeoJsonDataSource.load('/geojson/defaultNoFlyZone.json', {
    stroke: Color.RED,
    fill: Color.RED.withAlpha(0.5),
    strokeWidth: 3,
  })
  viewer.value!.dataSources.add(noFlyZone)
}

onMounted(() => {
  initCesiumMap()
  addLayerServer()
})
</script>

<style lang='scss' scoped>
@import "cesium/Build/Cesium/Widgets/widgets.css";
</style>
