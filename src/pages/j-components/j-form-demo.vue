<template>
  <div main-container>
    <JForm
      :loading="loading"
      :form-items="formItems"
      :form-props="{
        inline: true,
      }"
      @search="onSearch"
    >
      <template #toolbar>
        <el-button type="primary">+ 新增</el-button>
      </template>
    </JForm>
  </div>
</template>

<route lang="yaml">
meta:
  name: JForm
</route>

<script setup lang='ts'>
interface Form {
  name: string
  age: string
  timeFrame: [string, string]
}

const loading = ref(false)
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

function onSearch(page: number, form: Form) {
  // eslint-disable-next-line no-console
  console.log('🚀 ~ form:', form)
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}
</script>
