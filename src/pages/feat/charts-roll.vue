<template>
  <div layout-default>
    <el-card class="mt-15px" shadow="hover" header="table无限滚动">
      <tableRull :table-data="tableData" :columns="columns" :speed="speed" />
    </el-card>
    <el-card class="mt-15px" shadow="hover" header="echarts提示无限转动">
      <pieChartHint :echarts-data="option" :speed="echartsSpeed" />
    </el-card>
  </div>
</template>

<route lang="yaml">
  meta:
    name: 无限滚动
</route>

<script lang="ts" setup>
import tableRull from './components/table-rull.vue'
import pieChartHint from './components/pie-chart-hint.vue'

const speed = 2 // 滚动速度
const tableData = ref<any[]>([{
  date: '2016-05-01',
  name: '王小虎1',
  address: '上海市普陀区金沙江路 1 弄',
}, {
  date: '2016-05-02',
  name: '王小虎2',
  address: '上海市普陀区金沙江路 2 弄',
}, {
  date: '2016-05-03',
  name: '王小虎3',
  address: '上海市普陀区金沙江路 3 弄',
}, {
  date: '2016-05-04',
  name: '王小虎4',
  address: '上海市普陀区金沙江路 4 弄',
}, {
  date: '2016-05-05',
  name: '王小虎5',
  address: '上海市普陀区金沙江路 5 弄',
}]) // 定义表格list

interface Column {
  id: string
  label: string
  width?: number
}

const columns: Array<Column> = [
  {
    id: 'date',
    label: '日期',
    width: 180,
  },
  {
    id: 'name',
    label: '姓名',
    width: 180,
  },
  {
    id: 'address',
    label: '地址',
  },
]

// echarts数据

const echartsSpeed = 2000 // echartsSpeed毫秒
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
