<template>
  <div id="zoom-control" />
</template>

<script setup lang="ts">
import type { Cartesian3, Viewer } from 'cesium'
import type { ShallowRef } from 'vue'
import ZoomController from './zoom'

const { center } = defineProps<{
  center: Cartesian3
}>()

const viewer = inject('viewer') as ShallowRef<Viewer | null>

watchOnce(
  viewer,
  () => {
    // eslint-disable-next-line no-new
    new ZoomController(viewer.value!, {
      home: center,
      container: document.getElementById('zoom-control')!,
    })
  },
  {
    flush: 'post',
  },
)
</script>
