<template>
  <ElForm ref="formRef" :model="form" :rules="rules ?? {}" inline v-bind="formProps">
    <!-- 检索条件 -->
    <template v-for="{ prop, type, options, fieldProps, ...otherProps } in renderForms" :key="prop">
      <!-- 输入框 -->
      <el-form-item v-if="type === 'input'" v-bind="otherProps">
        <el-input v-model="form[prop]" placeholder="请输入" v-bind="fieldProps" />
      </el-form-item>

      <!-- 文本框 -->
      <el-form-item v-else-if="type === 'textarea'" v-bind="otherProps">
        <el-input v-model="form[prop]" type="textarea" placeholder="请输入" v-bind="fieldProps" />
      </el-form-item>

      <!-- 选择器 -->
      <el-form-item v-else-if="type === 'select'" v-bind="otherProps">
        <el-select v-model="form[prop]" placeholder="请选择" clearable v-bind="fieldProps">
          <el-option
            v-for="item in options"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <!-- 自定义 -->
      <el-form-item v-else-if="type === 'slot'" v-bind="otherProps">
        <slot :name="prop" :form="form" />
      </el-form-item>
    </template>

    <!-- 搜索与重置 -->
    <el-form-item v-if="isSearch" id="formBtn" class="!mr-0">
      <el-button :loading="loading" :icon="Search" type="primary" @click="search">搜索</el-button>
      <el-button :icon="RefreshLeft" @click="formRef!.resetFields()">重置</el-button>
    </el-form-item>

    <!-- 工具栏 -->
    <el-form-item class="!mr-0" float-right pl-80px>
      <slot name="toolbar" />
    </el-form-item>
  </ElForm>
</template>

<script setup lang="ts">
import { ElForm } from 'element-plus'
import { RefreshLeft, Search } from '@element-plus/icons-vue'
import type { FormInstance, FormProps, FormRules } from 'element-plus'

interface Props {
  isSearch?: boolean // 是否显示搜索按钮
  loading: boolean // 是否为loading状态
  renderForms: JFormItem[] // 需要循环渲染的表单项
  rules?: FormRules // 表单验证规则
  formProps?: Partial<FormProps> // 表单属性
}

const { isSearch, renderForms } = defineProps<Props>()
const emit = defineEmits(['search'])

// 定义表单ref
const formRef = ref<FormInstance>()
const form: Record<string, any> = reactive({})
// 组装表单数据
renderForms!.forEach((item) => {
  form[item.prop] = item.value
})

// 搜索
function search() {
  // 校验表单，校验不通过则不执行搜索
  formRef.value?.validate().then(() => {
    emit('search', 1, form)
  })
}

// 默认渲染结束后执行搜索
onMounted(() => {
  if (isSearch) search()
})
</script>
