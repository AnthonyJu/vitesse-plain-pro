<template>
  <div layout-default>
    <el-button type="primary" @click="visible = true">Open dialog</el-button>

    <JDialog
      v-model:visible="visible"
      v-model:form="formData"
      :loading="loading"
      :form-items="formItems"
      :form-props="formProps"
      :dialog-props="dialogProps"
      @on-submit="onSubmit"
    />
  </div>
</template>

<route lang='yaml'>
meta:
  name: JDialog
</route>

<script setup lang='ts'>
import { ElMessage } from 'element-plus'

const loading = ref(false)
const visible = ref(false)

const dialogProps: JDialogProps = {
  title: 'JDialog',
  width: '30%',
}

const formProps: JFormProps = {
  rules: {
    name: [
      { required: true, message: '请输入姓名', trigger: 'change' },
    ],
    age: [
      { required: true, message: '请选择年龄', trigger: 'change' },
    ],
  },
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
]

const formData = ref({
  name: '张三',
  age: '',
})

function onSubmit() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    visible.value = false
    ElMessage.success('提交成功')
  }, 1000)
}
</script>
