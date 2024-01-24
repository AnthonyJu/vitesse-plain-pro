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
  name: Water liquid fill
</route>

<script setup lang="ts">
import 'echarts-liquidfill'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'

use([SVGRenderer])

const option = ref({
  backgroundColor: 'transparent',
  series: [
    {
      type: 'liquidFill',
      radius: '100%',
      center: ['50%', '50%'],
      data: [0.65, 0.6], // data长度代表波浪数，data值代表波浪高度
      color: ['#8190E3', '#71B1FC'],
      outline: {
        // 轮廓设置
        show: true,
        borderDistance: 10, // 边框与球中间间距
        itemStyle: {
          borderWidth: 2,
          borderColor: '#ECECF8',
        },
      },
      itemStyle: {
        shadowColor: 'rgba(22, 22, 22, 0.5)',
        shadowBlur: 10,
      },
      backgroundStyle: {
        borderWidth: 5,
        borderColor: '#EEF2FD',
        shadowColor: '#008DCE',
        color: '#fffe',
      },
      label: {
        position: ['50%', '35%'],
        formatter: '60%',
        color: '#313131',
        fontSize: 50,
      },
    },
  ],
})
</script>
