<template>
  <BasicMap @ready="handleReady" />
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
  const noFlyZone = Cesium.GeoJsonDataSource.load('/geojson/defaultNoFlyZone.json', {
    stroke: Cesium.Color.RED,
    fill: Cesium.Color.RED.withAlpha(0.4),
    strokeWidth: 3,
    clampToGround: true,
  })
  viewer.dataSources.add(noFlyZone)
}
</script>
