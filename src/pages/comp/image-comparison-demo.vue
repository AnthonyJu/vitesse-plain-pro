<template>
  <div layout-default>
    <ImageComparison
      :images="[Png1, Png2]"
      :width="width"
      :aspect-ratio="aspectRatio"
    />
  </div>
</template>

<script setup lang="ts">
import Png1 from '@/assets/image-comparison/1.png'
import Png2 from '@/assets/image-comparison/2.png'

const width = ref(800)
const aspectRatio = ref('16/9')
</script>
