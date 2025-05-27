<template>
  <BasicMap>
    <ScaleBar />
    <ZoomController />
    <MeasureTool />
    <slot />
  </BasicMap>
</template>

<script setup lang="ts">
import BasicMap from './basic-map/index.vue'
import MeasureTool from './measure-tool/index.vue'
import ScaleBar from './scale-bar/index.vue'
import ZoomController from './zoom-controller/index.vue'
</script>
