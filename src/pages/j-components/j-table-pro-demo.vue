<template>
  <JTablePro
    layout-default
    :url="url"
    :table-options="tableOptions"
    :form-options="formOptions"
    :dialog-options="dialogOptions"
  >
    <template #control="{ row }">
      <el-button type="primary" link @click="otherFn(row)">获取名字</el-button>
    </template>
  </JTablePro>
</template>

<script setup lang='ts'>
import { ElMessage } from 'element-plus'

const url = {
  get: '/mock/data.json',
  create: '1',
  update: '2',
  delete: '3',
}

const formItems: JFormItem[] = [
  {
    prop: 'name',
    label: '姓名',
    type: 'input',
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
      width: 220,
    },
  ],
}

const dialogOptions: JDialogOptions = {
  formItems,
  formProps: {
    rules: {
      name: [
        { required: true, message: '请输入姓名', trigger: 'change' },
      ],
    },
  },
}

function otherFn(row: any) {
  ElMessage.info(row.name)
}
</script>
