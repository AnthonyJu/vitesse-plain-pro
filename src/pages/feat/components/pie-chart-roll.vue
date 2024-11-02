<template>
  <div
    class="echarts-box"
    @mouseenter="stopPolling"
    @mouseleave="startPolling"
  >
    <VChart
      ref="chartRef"
      autoresize
      class="h-400px w-400px"
      :option="echartsData"
      :init-options="{ renderer: 'svg' }"
      :theme="isDark ? 'dark' : 'light'"
    />
  </div>
</template>

<script lang="ts" setup>
import { PieChart } from 'echarts/charts'
import { LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'

const props = defineProps({
  echartsData: {
    type: Object,
    default: () => {},
  },
  speed: {
    type: Number,
    default: 2,
  },
})

use([SVGRenderer, LegendComponent, TitleComponent, TooltipComponent, PieChart])

let timerId: any = null
const currentIndex = ref(-1)
const chartRef = ref()

// 提示轮播转动
function startPolling() {
  if (timerId !== null) {
    return
  }
  timerId = setInterval(() => {
    const dataLen = props.echartsData.series[0].data.length
    // 取消之前高亮的图形
    chartRef.value?.dispatchAction({
      type: 'downplay',
      seriesIndex: 0,
      dataIndex: currentIndex.value,
    })
    currentIndex.value = (currentIndex.value + 1) % dataLen
    // 高亮当前图形
    chartRef.value?.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      dataIndex: currentIndex.value,
    })
    // 显示 tooltip
    chartRef.value?.dispatchAction({
      type: 'showTip',
      seriesIndex: 0,
      dataIndex: currentIndex.value,
    })
  }, props.speed)
}

function stopPolling() {
  if (timerId !== null) {
    clearInterval(timerId)
    timerId = null
    chartRef.value.dispatchAction({
      type: 'downplay',
      seriesIndex: 0,
      dataIndex: currentIndex.value,
    })
  }
}

onMounted(() => {
  startPolling()
})

onBeforeUnmount(() => {
  clearInterval(timerId)
})
</script>

<style lang="scss" scoped>
.echarts-box {
  width: fit-content;
}
</style>
