<template>
  <div main-container>
    <JTablePro
      :url="url"
      :table-options="tableOptions"
      :form-options="formOptions"
      :dialog-options="dialogOptions"
    >
      <template #control="{ row }">
        <el-button type="primary" link @click="otherFn(row)">点我获取名字</el-button>
      </template>
    </JTablePro>
  </div>
</template>

<route lang="yaml">
meta:
  name: JTablePro
</route>

<script setup lang='ts'>
import { ElMessage } from 'element-plus'

const url = {
  get: new URL('./data/data.json', import.meta.url).href,
  create: '1',
  update: '2',
  delete: '3',
}

const formItems: JFormItem[] = [
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
]

const formOptions: JFormOptions = { formItems }

const tableOptions: JTableOptions = {
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

const dialogOptions: JDialogOptions = { formItems }

function otherFn(row: any) {
  ElMessage.info(row.name)
}
</script>
