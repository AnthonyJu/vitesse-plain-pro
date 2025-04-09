<template>
  <CesiumMap>
    <ScaleBar />
    <ZoomController :center="center" />
    <MeasureTool />
  </CesiumMap>
</template>

<script setup lang="ts">
import type { Viewer } from 'cesium'
import { DEFAULT_CESIUM_ID } from '@/constants'
import { Cartesian3, Math as CMath, Color, GeoJsonDataSource } from 'cesium'
// @ts-expect-error useVueCesium
import { useVueCesium } from 'vue-cesium'

let viewer: Viewer

const center = {
  destination: Cartesian3.fromDegrees(103.84, 31.15, 15000000),
  orientation: {
    heading: CMath.toRadians(360),
    pitch: CMath.toRadians(-90),
    roll: CMath.toRadians(0),
  },
}

// 添加GeoJson数据源
function addGeoJson() {
  // 加载GeoJson数据
  const noFlyZone = GeoJsonDataSource.load('/geojson/defaultNoFlyZone.json', {
    stroke: Color.RED,
    fill: Color.RED.withAlpha(0.4),
    strokeWidth: 3,
    clampToGround: true,
  })
  viewer.dataSources.add(noFlyZone)
}

onMounted(() => {
  const vc = useVueCesium(DEFAULT_CESIUM_ID)
  vc.creatingPromise.then(() => {
    viewer = vc.viewer
    // 设置地图视角
    viewer.camera.setView(center)
    // 添加GeoJson数据源
    addGeoJson()
  })
})
</script>
