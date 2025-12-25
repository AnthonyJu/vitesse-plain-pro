<template>
  <CesiumMap />
</template>

<script setup lang="ts">
import { useCesium } from '@/composables/use-cesium'

const { viewer, onViewerReady } = useCesium('cesiumId')

onViewerReady(() => {
  // eslint-disable-next-line no-console
  console.log('viewer.value:', viewer.value)
})
</script>
