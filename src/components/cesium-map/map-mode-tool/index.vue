<template>
  <div
    v-show="show"
    class="cesium-tool-btn flex-col-center gap-5px"
    position="absolute bottom-180px right-10px z-10"
    :title="`切换到${mode}`"
    @click="changeMode"
  >
    {{ mode === '3D' ? '2D' : '3D' }}
  </div>
</template>

<script setup lang="ts">
// @ts-expect-error no exported
import { useVueCesium } from 'vue-cesium'

const emit = defineEmits(['setTerrain'])

const cesiumId = inject('cesiumId') as string

const mode = ref('3D')
const show = ref(false)

const vc = useVueCesium(cesiumId)
vc.creatingPromise.then(() => {
  show.value = true
  emit('setTerrain', mode.value)
})

function changeMode() {
  if (mode.value === '3D') {
    vc.viewer.scene.morphTo2D(0)
    mode.value = '2D'
  }
  else {
    vc.viewer.scene.morphTo3D(0)
    mode.value = '3D'
  }
  emit('setTerrain', mode.value)
}
</script>
