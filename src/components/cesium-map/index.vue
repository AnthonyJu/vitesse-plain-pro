<template>
  <BasicMap>
    <MapMode />
    <DrawTool />
    <MeasureTool />
    <ZoomController />
    <ScaleBar />
    <slot />
  </BasicMap>
</template>

<script setup lang="ts">
import BasicMap from './basic-map/index.vue'
import DrawTool from './draw-tool/index.vue'
import MapMode from './map-mode/index.vue'
import MeasureTool from './measure-tool/index.vue'
import ScaleBar from './scale-bar/index.vue'
import ZoomController from './zoom-controller/index.vue'
</script>
