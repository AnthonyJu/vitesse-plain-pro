<script setup lang="ts">
import type { LargeAreaResult, SubRegionResult } from '../large-area-planner'
import RouteInfo from './RouteInfo.vue'

const props = defineProps<{
  result: LargeAreaResult
  altitude: number
}>()

const emit = defineEmits<{
  highlight: [subRegion: SubRegionResult | null]
}>()

// 当前激活的 tab
const activeTab = ref('summary')

/** 子区域 tab 切换时高亮对应区域 */
function onTabChange(tabName: string | number) {
  if (tabName === 'summary') {
    emit('highlight', null)
    return
  }
  const id = Number(String(tabName).replace('sub-', ''))
  const sub = props.result.subRegions.find(s => s.id === id)
  emit('highlight', sub ?? null)
}
</script>

<template>
  <el-tabs v-model="activeTab" class="full" type="card" @tab-change="onTabChange">
    <!-- 汇总 tab -->
    <el-tab-pane label="汇总" name="summary">
      <div class="gap-12px p-10px text-14px color-gray-600 grid-fill-300px">
        <div>总面积：<span class="color-gray-900">{{ result.totalArea }}</span> m²</div>
        <div>子区域数：<span class="color-gray-900">{{ result.subRegions.length }}</span> 个</div>
        <div>总飞行距离：<span class="color-gray-900">{{ result.totalFlightDistance }}</span> km</div>
        <div>总飞行时间：<span class="color-gray-900">{{ result.totalFlightTime }}</span></div>
        <div>总照片数：<span class="color-gray-900">{{ result.totalPictures }}</span> 张</div>
        <div>网格边长：<span class="color-gray-900">{{ result.gridCellSize.toFixed(2) }}</span> km</div>
      </div>
    </el-tab-pane>

    <!-- 每个子区域一个 tab -->
    <el-tab-pane
      v-for="sub in result.subRegions"
      :key="sub.id"
      :name="`sub-${sub.id}`"
    >
      <template #label>
        <span class="flex items-center gap-4px">
          <span
            class="inline-block h-8px w-8px rounded-full"
            :style="{ backgroundColor: sub.color }"
          />
          <span class="text-12px">区域 {{ sub.id + 1 }}</span>
          <el-tag v-if="sub.missionResult.exceedsLimit" type="danger" size="small" class="ml-2px">
            超限
          </el-tag>
        </span>
      </template>

      <RouteInfo :result="sub.missionResult" />
    </el-tab-pane>
  </el-tabs>
</template>
