<template>
  <CesiumMap />
</template>

<script setup lang="ts">
// @ts-expect-error useVueCesium
import { useVueCesium } from 'vue-cesium'

let viewer: Cesium.Viewer

onMounted(() => {
  const vc = useVueCesium(DEFAULT_CESIUM_ID)
  vc.creatingPromise.then(() => {
    viewer = vc.viewer
    // eslint-disable-next-line no-console
    console.log(viewer)
  })
})
</script>
