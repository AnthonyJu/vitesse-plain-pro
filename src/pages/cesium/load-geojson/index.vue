<template>
  <CesiumMap @ready="handleReady" />
</template>

<script setup lang="ts">
import type { VcReadyObject } from 'vue-cesium/es/utils/types'

provide('cesiumId', 'cesiumId')

let viewer: Cesium.Viewer
function handleReady(vc: VcReadyObject) {
  viewer = vc.viewer
  loadGeoJson()
}

// 添加GeoJson数据源
function loadGeoJson() {
  // 加载GeoJson数据
  const noFlyZone = Cesium.GeoJsonDataSource.load('/static/geojson/defaultNoFlyZone.json', {
    stroke: Cesium.Color.RED,
    fill: Cesium.Color.RED.withAlpha(0.4),
    strokeWidth: 3,
    clampToGround: true,
  })
  viewer.dataSources.add(noFlyZone)
}

// 加载kml或kmz数据源
// function loadKmlOrKmz() {
//   const kmlDataSource = Cesium.KmlDataSource.load('/kml/defaultNoFlyZone.kmz', {
//     camera: viewer.camera,
//     canvas: viewer.canvas,
//     clampToGround: true,
//   })
//   viewer.dataSources.add(kmlDataSource)
// }
</script>
