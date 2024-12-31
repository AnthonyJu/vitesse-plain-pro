<template>
  <VChart
    ref="chartRef"
    autoresize
    class="h-400px w-400px"
    :option="option"
    :theme="isDark ? 'dark' : 'light'"
    @mouseenter="stopPolling"
    @mouseleave="startPolling"
  />
</template>

<script lang="ts" setup>
import { PieChart } from 'echarts/charts'
import { LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'

use([SVGRenderer, LegendComponent, TitleComponent, TooltipComponent, PieChart])

const option = ref({
  backgroundColor: 'transparent',
  legend: {
    orient: 'vertical',
    left: 'left',
    data: ['Direct', 'Email', 'Ad Networks', 'Video Ads', 'Search Engines'],
  },
  title: {
    text: 'Traffic Sources',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    confine: true,
  },
  series: [
    {
      name: 'Traffic Sources',
      type: 'pie',
      radius: '55%',
      center: ['50%', '60%'],
      data: [
        { value: 335, name: 'Direct' },
        { value: 310, name: 'Email' },
        { value: 234, name: 'Ad Networks' },
        { value: 135, name: 'Video Ads' },
        { value: 1548, name: 'Search Engines' },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
})

let timerId: NodeJS.Timeout | null = null
let dataIndex = -1
const chartRef = ref()

// 提示轮播转动
function startPolling() {
  if (timerId !== null) return
  timerId = setInterval(() => {
    const dataLen = 10 // TODO 数据长度

    // 取消之前高亮的图形
    chartRef.value?.dispatchAction({
      type: 'downplay',
      seriesIndex: 0,
      dataIndex,
    })
    dataIndex = (dataIndex + 1) % dataLen

    // 高亮当前图形
    chartRef.value?.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      dataIndex,
    })

    // 显示 tooltip
    chartRef.value?.dispatchAction({
      type: 'showTip',
      seriesIndex: 0,
      dataIndex,
    })
  }, 3000)
}

function stopPolling() {
  if (timerId !== null) {
    chartRef.value.dispatchAction({
      type: 'downplay',
      seriesIndex: 0,
      dataIndex,
    })
    clearInterval(timerId)
    timerId = null
  }
}

onMounted(startPolling)
onBeforeUnmount(stopPolling)
</script>
