<template>
  <div
    v-show="isReady"
    class="flex-center gap-10px"
    position="absolute bottom-110px right-10px z-10"
  >
    <div v-show="showTools" class="flex-center gap-10px">
      <div class="cesium-tool-btn" title="清除" @click="clear">
        <div class="i-carbon-trash-can text-18px" />
      </div>
      <div
        v-for="tool in measureTools"
        :key="tool.name"
        class="cesium-tool-btn"
        :class="{ 'bg-#1BCBEA': activeTool === tool.name }"
        :title="tool.title"
        @click="toggleTool(tool.name)"
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
import { useCesium } from '@/composables/use-cesium'

const showTools = ref(false)
const activeTool = ref('')

const { isReady } = useCesium()

const measureTools = [
  { name: 'distance', title: '距离测量', icon: 'i-carbon-ruler' },
  { name: 'area', title: '面积测量', icon: 'i-carbon-area' },
  { name: 'height', title: '高度测量', icon: 'i-carbon-arrow-up' },
]

function toggleTool(toolName: string) {
  ElMessage.info(`已切换到${toolName}测量工具（功能开发中）`)
}

function clear() {
  ElMessage.info('已清除所有测量结果（功能开发中）')
}
</script>
