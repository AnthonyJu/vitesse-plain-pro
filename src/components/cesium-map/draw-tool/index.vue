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
    <div class="cesium-tool-btn" title="绘制" @click="showTools = !showTools">
      <div class="i-carbon-edit text-20px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DrawMode } from './use-draw'
import { useCesium } from '@/composables/use-cesium'
import { useToolState } from '../use-tool-state'
import { useDraw } from './use-draw'

const showTools = ref(false)
const { viewer, isReady } = useCesium()
const { activeMode, toggleMode, stop, clearAll } = useDraw(viewer)
const { activate, deactivate, registerDeactivate } = useToolState('draw')

// 注册停用回调（被其他工具激活时调用）
registerDeactivate(() => stop())

const tools = [
  { name: 'pin', title: '点', icon: 'i-carbon-location' },
  { name: 'polyline', title: '线段', icon: 'i-carbon-pen' },
  { name: 'polygon', title: '多边形', icon: 'i-carbon-pentagon-outline' },
  { name: 'circle', title: '圆形', icon: 'i-carbon-circle-outline' },
]

function handleToggle(name: string) {
  activate()
  toggleMode(name as DrawMode)
}

function handleClear() {
  clearAll()
  deactivate()
  ElMessage.success('已清除所有绘制结果')
}
</script>
