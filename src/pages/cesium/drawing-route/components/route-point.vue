<template>
  <VcEntity
    v-if="position"
    :position="position"
    @mouseout="image = FlyDot"
    @mouseover="image = FlyDotActive"
  >
    <VcGraphicsBillboard
      :image="image"
      :height-reference="0"
      :pixel-offset="{ x: 0, y: -19 }"
      :disable-depth-test-distance="infinity"
    />
  </VcEntity>
</template>

<script setup lang="ts">
import FlyDotActive from '@/assets/cesium/fly-dot-active.svg'
import FlyDot from '@/assets/cesium/fly-dot.svg'
// @ts-expect-error no exported
import { VcEntity, VcGraphicsBillboard } from 'vue-cesium'

defineProps<{
  position?: Position
}>()

const image = ref(FlyDot)
const infinity = Number.POSITIVE_INFINITY
</script>
