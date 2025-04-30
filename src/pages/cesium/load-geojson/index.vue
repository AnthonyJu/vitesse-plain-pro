<template>
  <CesiumMap />
</template>

<script setup lang="ts">
// @ts-expect-error useVueCesium
import { useVueCesium } from 'vue-cesium'

let viewer: Cesium.Viewer

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

onMounted(() => {
  const vc = useVueCesium(DEFAULT_CESIUM_ID)
  vc.creatingPromise.then(() => {
    viewer = vc.viewer
    loadGeoJson()
  })
})
</script>
