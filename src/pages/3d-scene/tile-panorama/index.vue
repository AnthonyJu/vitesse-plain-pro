<template>
  <div class="relative full layout-default">
    <div ref="panoContainer" class="relative full overflow-hidden" />
    <el-button class="absolute bottom-25px right-25px" type="primary" @click="changeAutorotate">
      {{ isRotating ? '暂停游览' : '自动游览' }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { useMarzipano } from '@/composables/useMarzipano'

const panoContainer = ref(null)
const { createPano, isRotating, changeAutorotate } = useMarzipano(panoContainer, {
  path: '/static/panorama-tiles',
  levels: [
    {
      tileSize: 256,
      size: 256,
      fallbackOnly: true,
    },
    {
      tileSize: 512,
      size: 512,
    },
    {
      tileSize: 512,
      size: 1024,
    },
    {
      tileSize: 512,
      size: 2048,
    },
    {
      tileSize: 512,
      size: 4096,
    },
  ],
})

onMounted(() => {
  nextTick(async () => {
    await createPano()
  })
})
</script>
