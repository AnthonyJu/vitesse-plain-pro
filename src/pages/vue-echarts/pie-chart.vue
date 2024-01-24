<template>
  <VChart
    class="main-container"
    autoresize
    :option="option"
    :init-options="{ renderer: 'svg' }"
    :theme="isDark ? 'dark' : 'light'"
  />
</template>

<route lang="yaml">
meta:
  name: Pie Chart
</route>

<script setup lang="ts">
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { SVGRenderer } from 'echarts/renderers'
import { LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components'

import type { ComposeOption } from 'echarts/core'
import type { PieSeriesOption } from 'echarts/charts'
import type { LegendComponentOption, TitleComponentOption, TooltipComponentOption } from 'echarts/components'

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
type EChartsOption = ComposeOption<
  TitleComponentOption |
  TooltipComponentOption |
  LegendComponentOption |
  PieSeriesOption
>

use([SVGRenderer, LegendComponent, TitleComponent, TooltipComponent, PieChart])

const option = ref<EChartsOption>({
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
    formatter: '{a} <br/>{b} : {c} ({d}%)',
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
</script>
