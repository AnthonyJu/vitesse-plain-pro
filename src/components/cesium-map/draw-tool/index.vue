<template>
  <VcDrawings
    ref="drawToolRef"
    position="bottom-right"
    :main-fab-opts=" {
      modelValue: false,
      direction: 'left',
    }"
    :drawings="['pin', 'polyline', 'circle', 'rectangle', 'polygon']"
    :offset="[10, 145]"
    :editable="false"
    :clamp-to-ground="true"
    :pin-drawing-opts=" {
      billboardOpts: { image: PinPng },
    }"
  >
    <template #body="instances">
      <CustomToolBtn :instances="instances" title="绘制" :parent="drawToolRef" icon="carbon-edit" />
    </template>
  </VcDrawings>
</template>

<script setup lang="ts">
import PinPng from '@/assets/maker.png'
// @ts-expect-error no exported
import { VcDrawings } from 'vue-cesium'
import CustomToolBtn from '../cumton-tool-btn/index.vue'

const drawToolRef = ref()
</script>
