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
      <ToolBtn :instances="instances" title="绘制" :parent="drawToolRef" icon="i-carbon-edit" />
    </template>
  </VcDrawings>
</template>

<script setup lang="ts">
// @ts-expect-error no exported
import { VcDrawings } from 'vue-cesium'
import PinPng from '@/assets/maker.png'
import ToolBtn from '../tool-btn/index.vue'

const drawToolRef = ref()
</script>
