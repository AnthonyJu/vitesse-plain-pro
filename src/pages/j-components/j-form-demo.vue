<template>
  <JForm
    v-model:form="formData"
    layout-default
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
</template>

<script setup lang='ts'>
const formItems: JFormItem[] = [
  {
    prop: 'name',
    label: '姓名',
    type: 'input',
    fieldProps: {
      onInput: (value) => {
        // eslint-disable-next-line no-console
        console.log('🚀 ~ value:', value)
      },
    },
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

const loading = ref(false)
const formData = ref({
  name: '张三',
  age: '',
  timeFrame: ['', ''],
})

function onSearch(form: any) {
  // eslint-disable-next-line no-console
  console.log('🚀 ~ form:', form)
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}
</script>
