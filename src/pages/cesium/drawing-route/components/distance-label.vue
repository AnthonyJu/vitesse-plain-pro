<template>
  <VcEntity :position="center">
    <VcGraphicsLabel
      :text="distance"
      font="16px"
      fill-color="#fff"
      show-background
      background-color="#000"
      :distance-display-condition="[10, 10000]"
      :disable-depth-test-distance="Number.POSITIVE_INFINITY"
    />
  </VcEntity>
</template>

<script setup lang="ts">
// @ts-expect-error no exported
import { VcEntity, VcGraphicsLabel } from 'vue-cesium'

const { positions } = defineProps<{
  positions: [Cesium.Cartesian3, Cesium.Cartesian3]
}>()

// 计算航线中心点
const center = computed(() => Cesium.Cartesian3.midpoint(positions[0], positions[1], new Cesium.Cartesian3()))
// 计算航程
const distance = computed(() => `${Cesium.Cartesian3.distance(positions[0], positions[1]).toFixed(2)} m`)
</script>
