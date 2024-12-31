<template>
  <el-table
    id="scroll-table"
    :data="tableData"
    height="230"
    class="rollTableRow"
  >
    <el-table-column
      v-for="col in columns"
      :key="col.id"
      :prop="col.id"
      :label="col.label"
      :width="col.width"
      show-overflow-tooltip
    />
  </el-table>
</template>

<script lang="ts" setup>
const columns = [
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
const tableData = [
  {
    date: '2016-05-01',
    name: '王小虎1',
    address: '上海市普陀区金沙江路 1 弄',
  },
  {
    date: '2016-05-02',
    name: '王小虎2',
    address: '上海市普陀区金沙江路 2 弄',
  },
  {
    date: '2016-05-03',
    name: '王小虎3',
    address: '上海市普陀区金沙江路 3 弄',
  },
  {
    date: '2016-05-04',
    name: '王小虎4',
    address: '上海市普陀区金沙江路 4 弄',
  },
  {
    date: '2016-05-05',
    name: '王小虎5',
    address: '上海市普陀区金沙江路 5 弄',
  },
  {
    date: '2016-05-01',
    name: '王小虎1',
    address: '上海市普陀区金沙江路 1 弄',
  },
  {
    date: '2016-05-02',
    name: '王小虎2',
    address: '上海市普陀区金沙江路 2 弄',
  },
  {
    date: '2016-05-03',
    name: '王小虎3',
    address: '上海市普陀区金沙江路 3 弄',
  },
  {
    date: '2016-05-04',
    name: '王小虎4',
    address: '上海市普陀区金沙江路 4 弄',
  },
  {
    date: '2016-05-05',
    name: '王小虎5',
    address: '上海市普陀区金沙江路 5 弄',
  },
]

useElTableScroll('scroll-table')
</script>
