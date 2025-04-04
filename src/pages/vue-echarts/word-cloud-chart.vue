<template>
  <VChart
    autoresize
    layout-default
    :option="option"
    :init-options="{ renderer: 'svg' }"
    :theme="isDark ? 'dark' : 'light'"
  />
</template>

<script setup lang='ts'>
import type { WordCloudSeriesOption } from 'echarts'
import type { GridComponentOption, TooltipComponentOption } from 'echarts/components'
import type { ComposeOption } from 'echarts/core'

import maskImagePath from '@/assets/maskImage.png'

import { GridComponent, TooltipComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'

import wordCloudData from './data/wordCloud-data.json'
import 'echarts-wordcloud'

interface WordCloudSeries extends WordCloudSeriesOption {
  keepAspect: boolean
}

type EChartsOption = ComposeOption<
  TooltipComponentOption |
  GridComponentOption |
  WordCloudSeriesOption |
  WordCloudSeries
>

use([TooltipComponent, SVGRenderer, GridComponent])

const option = ref<EChartsOption>()

// 使用数据填充图片
const maskImage = new Image()
maskImage.src = maskImagePath
maskImage.onload = function () {
  initChart(maskImage)
}

// 数据初始化
function initChart(maskImage: HTMLImageElement) {
  option.value = {
    backgroundColor: 'transparent',
    grid: {
      top: 15,
      right: 15,
      bottom: 20,
      left: 30,
    },
    tooltip: {},
    series: [
      {
        type: 'wordCloud',
        sizeRange: [4, 150],
        rotationRange: [0, 0],
        gridSize: 0,
        shape: 'pentagon',
        maskImage,
        drawOutOfBound: false,
        layoutAnimation: true,
        keepAspect: true,
        textStyle: {
          fontWeight: 'bold',
          color() {
            return `rgb(${[
              Math.round(Math.random() * 200) + 50,
              Math.round(Math.random() * 50),
              Math.round(Math.random() * 50) + 50,
            ].join(',')})`
          },
        },
        emphasis: {
          textStyle: {
            color: '#528',
          },
        },
        data: wordCloudData,
      },
    ],
  }
}
</script>
