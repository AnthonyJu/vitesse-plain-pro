<template>
  <div
    v-show="isReady"
    class="flex-center gap-10px"
    position="absolute bottom-145px right-10px z-10"
  >
    <div v-show="showTools" class="flex-center gap-10px">
      <div class="cesium-tool-btn" title="清除" @click="clear">
        <div class="i-carbon-trash-can text-18px" />
      </div>
      <div
        v-for="tool in drawTools"
        :key="tool.name"
        class="cesium-tool-btn"
        :class="{ 'bg-#0ff': activeTool === tool.name }"
        :title="tool.title"
        @click="toggleTool(tool.name)"
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
import { useCesium } from '@/composables/use-cesium'

const showTools = ref(false)
const activeTool = ref('')

const { isReady } = useCesium()

const drawTools = [
  { name: 'pin', title: '点', icon: 'i-carbon-location' },
  { name: 'polyline', title: '线段', icon: 'i-carbon-pen' },
  { name: 'polygon', title: '多边形', icon: 'i-carbon-pentagon-outline' },
  { name: 'circle', title: '圆形', icon: 'i-carbon-circle-outline' },
]

function toggleTool(toolName: string) {
  ElMessage.info(`已切换到${toolName}绘制工具（功能开发中）`)
}

function clear() {
  ElMessage.info('已清除所有绘制结果（功能开发中）')
}
</script>
