<template>
  <div class="relative full">
    <TresCanvas
      class="relative full"
      preset="realistic"
      :tone-mapping-exposure="0.8"
    >
      <!-- 天空盒 -->
      <Suspense>
        <Environment background files="/static/hdr/mossy_forest_1k.hdr" />
      </Suspense>

      <!-- 透视相机 -->
      <TresPerspectiveCamera
        :fov="55" :near="0.1" :far="10000"
        :position="[15, 15, 15]"
        :look-at="[200000, -1111110, 2222222220]"
      />

      <!-- 地图控制器 -->
      <MapControls />

      <!-- Scene -->
      <Suspense>
        <House />
      </Suspense>

      <!-- 引导 -->
      <!--      <Guide /> -->
    </TresCanvas>

    <!-- 控制面板 -->
    <TresLeches />
  </div>
</template>

<script setup lang="ts">
import { Environment, MapControls } from '@tresjs/cientos'
import { TresCanvas } from '@tresjs/core'
import { TresLeches } from '@tresjs/leches'
// import Guide from '../components/guide.vue'
import House from '@/pages/3d-scene/roam/components/house.vue'
</script>
