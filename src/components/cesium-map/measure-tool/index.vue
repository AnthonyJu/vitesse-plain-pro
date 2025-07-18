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
      <CustomToolBtn :instances="instances" title="测量" :parent="measureToolRef" icon="carbon-ruler-alt" />
    </template>
  </VcMeasurements>
</template>

<script setup lang="ts">
// @ts-expect-error no exported
import { VcMeasurements } from 'vue-cesium'
import CustomToolBtn from '../cumton-tool-btn/index.vue'

const measureToolRef = ref()
</script>
