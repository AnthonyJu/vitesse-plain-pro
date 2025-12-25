<template>
  <div
    v-show="isReady"
    class="cesium-tool-btn flex-col-center gap-5px"
    position="absolute bottom-180px right-10px z-10"
    :title="`切换到${mode}`"
    @click="changeMode"
  >
    {{ mode === '3D' ? '2D' : '3D' }}
  </div>
</template>

<script setup lang="ts">
import { useCesium } from '@/composables/use-cesium'

const emit = defineEmits(['setMapMode'])

const mode = ref('3D')
const { viewer, isReady, onViewerReady } = useCesium()

// viewer 就绪后设置地形
onViewerReady(() => {
  emit('setMapMode', mode.value)
})

function changeMode() {
  if (!viewer.value) return

  if (mode.value === '3D') {
    viewer.value.scene.morphTo2D(0)
    mode.value = '2D'
  }
  else {
    viewer.value.scene.morphTo3D(0)
    mode.value = '3D'
  }
  emit('setMapMode', mode.value)
}
</script>
