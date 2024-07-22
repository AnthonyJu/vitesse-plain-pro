<template>
  <JList v-model:data="data" layout-default :url="url" :form-options="formOptions">
    <template #age="{ row }">
      <el-input v-model="row.age" placeholder="请输入" />
    </template>
    <template #toolbar>
      <el-button type="primary">+ 新增</el-button>
    </template>
    <div full flex-col overflow-hidden>
      <div v-for="item in data" :key="item.name" my-10px>
        {{ item.name }} - {{ item.age }} - {{ item.address }}
      </div>
    </div>
  </JList>
</template>

<route lang="yaml">
meta:
  name: JList
</route>

<script setup lang='ts'>
interface Data {
  name: string
  age: number
  address: string
}

const url = '/mock/data.json'

const data = ref<Data[]>([])

const formOptions: JFormOptions = {
  formItems: [
    { type: 'input', prop: 'name', label: '名称' },
    { type: 'slot', prop: 'age', label: '年龄' },
  ],
}
</script>
