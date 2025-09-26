<template>
  <VcMeasurements
    ref="measureToolRef"
    position="bottom-right"
    :offset="[10, 110]"
    :editable="false"
    :main-fab-opts=" {
      modelValue: false,
      direction: 'left',
    }"
    :clamp-to-ground="true"
    :measurements="['vertical', 'polyline', 'area', 'circle']"
    active-color="#1BCBEA"
  >
    <template #body="instances">
      <ToolBtn :instances="instances" title="测量" :parent="measureToolRef" icon="i-carbon-ruler-alt" />
    </template>
  </VcMeasurements>
</template>

<script setup lang="ts">
// @ts-expect-error no exported
import { VcMeasurements } from 'vue-cesium'
import ToolBtn from '../tool-btn/index.vue'

const measureToolRef = ref()
</script>
