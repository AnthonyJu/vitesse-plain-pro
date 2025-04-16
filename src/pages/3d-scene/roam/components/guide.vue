<template>
  <Html
    ref="obj"
    center
    :distance-factor="200"
    :position="position"
  >
    <h1 class="h-30px w-30px flex-center rounded-50% bg-dark" @click="logPosition">
      1
    </h1>
  </Html>
</template>

<script setup lang="ts">
import { Html } from '@tresjs/cientos'
import { useControls } from '@tresjs/leches'
import '@tresjs/leches/styles'

const obj = ref()

const { x, y, z } = useControls({
  x: 0,
  y: 0,
  z: 0,
})

const position = computed(() => [x.value.x, y.value.y, z.value.z])

// const camera = ref()

function logPosition() {
  // console.log(camera.value)
}
</script>
