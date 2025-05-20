<template>
  <div class="relative full layout-default">
    <el-select
      v-model="type"
      class="absolute left-20px top-20px z-10 w-200px overflow-hidden rounded-default bg-default"
      placeholder="请选择全景类型"
    >
      <el-option
        v-for="item in types"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <PanoramaOne v-if="type === 0" :url="Equirectangular" />
    <PanoramaTwo v-else-if="type === 1" :url="CubeMapStrip" />
  </div>
</template>

<script setup lang="ts">
import CubeMapStrip from '@/assets/images/panorama/cube.png'
import Equirectangular from '@/assets/images/panorama/equirectangular.png'

import PanoramaOne from './components/panorama-one.vue'
import PanoramaTwo from './components/panorama-two.vue'

const type = ref(0)

const types = [
  {
    label: '等矩形图全景',
    value: 0,
  },
  {
    label: '立方体图全景',
    value: 1,
  },
  // {
  //   label: '六位图全景',
  //   value: 2,
  // },
]
</script>
