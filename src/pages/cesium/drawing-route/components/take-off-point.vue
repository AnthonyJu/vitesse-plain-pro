<template>
  <VcEntity
    v-if="position"
    :position="position"
    @mouseout="image = TakeOffPoint"
    @mouseover="image = TakeOffActive"
  >
    <VcGraphicsBillboard
      :image="image"
      :height-reference="1"
      :disable-depth-test-distance="infinity"
    />
  </VcEntity>
</template>

<script setup lang="ts">
import TakeOffActive from '@/assets/cesium/take-off-active.svg'
import TakeOffPoint from '@/assets/cesium/take-off.svg'
// @ts-expect-error no exported
import { VcEntity, VcGraphicsBillboard } from 'vue-cesium'

defineProps<{
  position?: Position
}>()

const image = ref(TakeOffPoint)
const infinity = Number.POSITIVE_INFINITY
</script>
