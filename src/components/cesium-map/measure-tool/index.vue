<template>
  <div
    v-show="isReady"
    class="flex-center gap-10px"
  >
    <div v-show="showTools" class="flex-center gap-10px">
      <div class="cesium-tool-btn" title="清除" @click="handleClear">
        <div class="i-carbon-trash-can text-18px" />
      </div>
      <div
        v-for="tool in tools"
        :key="tool.name"
        class="cesium-tool-btn"
        :class="{ 'bg-#0ff!': activeMode === tool.name }"
        :title="tool.title"
        @click="handleToggle(tool.name)"
      >
        <div class="text-18px" :class="tool.icon" />
      </div>
    </div>
    <div class="cesium-tool-btn" title="测量" @click="showTools = !showTools">
      <div class="i-carbon-ruler-alt text-20px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MeasureMode } from './use-measure'
import { useCesium } from '@/composables/use-cesium'
import { useToolState } from '../use-tool-state'
import { useMeasure } from './use-measure'

const showTools = ref(false)
const { viewer, isReady } = useCesium()
const { activeMode, toggleMode, stop, clearAll } = useMeasure(viewer)
const { activate, deactivate, registerDeactivate } = useToolState('measure')

// 注册停用回调（被其他工具激活时调用）
registerDeactivate(() => stop())

const tools = [
  { name: 'distance', title: '距离测量', icon: 'i-carbon-ruler' },
  { name: 'area', title: '面积测量', icon: 'i-carbon-area' },
  { name: 'height', title: '高度测量', icon: 'i-carbon-arrow-up' },
]

function handleToggle(name: string) {
  activate()
  toggleMode(name as MeasureMode)
}

function handleClear() {
  clearAll()
  deactivate()
  ElMessage.success('已清除所有测量结果')
}
</script>
