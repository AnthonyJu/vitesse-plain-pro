<template>
  <div main-container>
    <JTable
      :data="data"
      :columns="columns"
      :table-props="{
        border: true,
        stripe: true,
      }"
    />
  </div>
</template>

<route lang='yaml'>
meta:
  name: JTable
</route>

<script setup lang='ts'>
const columns = ref<JTableColumn<any>[]>([
  {
    label: '姓名',
    prop: 'name',
  },
  {
    label: '年龄',
    prop: 'age',
  },
  {
    label: '地址',
    prop: 'address',
  },
])

const data = ref([
  {
    name: '张三',
    age: 18,
    address: '上海市普陀区金沙江路 1518 弄',
  },
  {
    name: '李四',
    age: 19,
    address: '上海市普陀区金沙江路 1517 弄',
  },
  {
    name: '王五',
    age: 20,
    address: '上海市普陀区金沙江路 1519 弄',
  },
  {
    name: '赵六',
    age: 21,
    address: '上海市普陀区金沙江路 1516 弄',
  },
])
</script>
