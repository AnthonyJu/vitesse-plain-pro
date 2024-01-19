<template>
  <div main-container>
    <JTablePro :url="url" :table-options="tableOptions" :form-options="formOptions">
      <template #control>
        <el-button type="primary" link>其他</el-button>
      </template>
    </JTablePro>
  </div>
</template>

<route lang="yaml">
meta:
  name: JTablePro
</route>

<script setup lang='ts'>
const url = new URL('./data.json', import.meta.url).href

const formOptions: JFormOptions = {
  formItems: [
    {
      prop: 'name',
      label: '姓名',
      type: 'input',
      defaultValue: '张三',
    },
    {
      prop: 'age',
      label: '年龄',
      type: 'select',
      options: [
        {
          label: '请选择',
          value: '',
        },
        {
          label: '18',
          value: 18,
        },
        {
          label: '19',
          value: 19,
        },
        {
          label: '20',
          value: 20,
        },
      ],
    },
    {
      prop: 'timeFrame',
      label: '时间',
      type: 'dateTime',
    },
  ],
}

const tableOptions: JTableOptions<any> = {
  columns: [
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
    {
      label: '操作',
      slot: true,
      prop: 'control',
    },
  ],
}
</script>
