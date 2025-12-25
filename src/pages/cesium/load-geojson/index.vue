<template>
  <CesiumMap />
</template>

<script setup lang="ts">
import { Color, GeoJsonDataSource } from 'cesium'

const { viewer, onViewerReady } = useCesium('cesiumId')

// 加载模型
onViewerReady(() => {
  // 加载GeoJson数据
  const noFlyZone = GeoJsonDataSource.load('/static/geojson/defaultNoFlyZone.json', {
    stroke: Color.RED,
    fill: Color.RED.withAlpha(0.4),
    strokeWidth: 3,
    clampToGround: true,
  })
  viewer.value!.dataSources.add(noFlyZone)

  // 加载kml或kmz数据源
  // const kmlDataSource = KmlDataSource.load('/kml/defaultNoFlyZone.kmz', {
  //   camera: viewer.value!.camera,
  //   canvas: viewer.value!.canvas,
  //   clampToGround: true,
  // })
  // viewer.value!.dataSources.add(kmlDataSource)
})
</script>
