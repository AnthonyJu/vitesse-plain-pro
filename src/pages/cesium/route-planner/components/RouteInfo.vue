<script setup lang="ts">
import type { MissionResult } from '../generate-mission-route'

defineProps<{
  result: MissionResult
}>()
</script>

<template>
  <div class="w-full p-10px pt-0">
    <div class="mb-10px color-gray-700 font-700">航线信息</div>
    <div class="gap-12px text-14px color-gray-600 grid-fill-280px">
      <div>区域面积：<span class="color-gray-900">{{ result.areaSqMeters }}</span> m²</div>
      <div>航线数量：<span class="color-gray-900">{{ result.numOfStrips }}</span> 条</div>
      <div>航线间距：<span class="color-gray-900">{{ result.distBetweenLines }}</span> m</div>
      <div>飞行距离：<span class="color-gray-900">{{ result.flightDistance }}</span> km</div>
      <div>飞行时间：<span class="color-gray-900">{{ result.flightTime }}</span></div>
      <div>地面分辨率：<span class="color-gray-900">{{ result.groundResolution }}</span> cm/px</div>
      <div>
        照片地面覆盖：<span class="color-gray-900">
          {{ result.footprint.width }} × {{ result.footprint.height }}</span> m
      </div>
      <div>照片数量：<span class="color-gray-900">{{ result.pictures }}</span> 张</div>
      <div>拍照频率：<span class="color-gray-900">{{ result.photoIntervalSec }}</span> s</div>
      <div>照片间隔：<span class="color-gray-900">{{ result.distBetweenImages }}</span> m</div>
      <div>
        是否超限：
        <span v-if="result.exceedsLimit" class="color-red-500 font-600">是</span>
        <span v-else class="color-green-500 font-600">否</span>
      </div>
    </div>
  </div>
</template>
