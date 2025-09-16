<template>
  <BasicMap @ready="handleReady">
    <DrawTool />
    <MeasureTool />
    <ZoomController />
    <ScaleBar />
    <slot />
  </BasicMap>
</template>

<script setup lang="ts">
import type { VcReadyObject } from 'vue-cesium/es/utils/types'

provide('cesiumId', 'cesiumId')

let viewer: Cesium.Viewer
function handleReady(vc: VcReadyObject) {
  viewer = vc.viewer
  // eslint-disable-next-line no-console
  console.log('VueCesium is ready', viewer)
}
</script>
