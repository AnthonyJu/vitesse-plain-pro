<template>
  <el-form
    ref="formRef"
    :model="form" :disabled="loading" v-bind="formProps"
    @keydown.enter="onSearch"
  >
    <!-- 检索条件 -->
    <template
      v-for="{ prop, label, type, options, fieldProps, formItemProps } in formItems"
      :key="prop"
    >
      <!-- 输入框 -->
      <el-form-item
        v-if="type === 'input'"
        :prop="prop"
        :label="label"
        :style="inputStyle"
        v-bind="formItemProps"
      >
        <el-input
          v-model="form[prop]"
          placeholder="请输入"
          clearable
          v-bind="fieldProps"
        />
      </el-form-item>

      <!-- 选择器 -->
      <el-form-item
        v-else-if="type === 'select'"
        :prop="prop"
        :label="label"
        v-bind="formItemProps"
      >
        <JSelect
          v-if="fieldProps?.multiple"
          v-model="form[prop]"
          :style="selectStyle"
          :data="form[prop]"
          :options="options!"
          placeholder="请选择"
          clearable
          v-bind="fieldProps"
        />

        <el-select
          v-else
          v-model="form[prop]"
          :style="selectStyle"
          placeholder="请选择"
          clearable
          v-bind="fieldProps"
        >
          <el-option
            v-for="item in options"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <!-- 日期时间选择器 -->
      <el-form-item
        v-else-if="prop === DATE_TIME_RANGE"
        :prop="prop"
        :label="label"
        v-bind="formItemProps"
      >
        <JDatePicker
          v-model="form[prop]"
          v-model:start-time="form[dateTimeKeys[0]]"
          v-model:end-time="form[dateTimeKeys[1]]"
          format="YYYY-MM-DD HH:mm"
          clearable
          value-format="YYYY-MM-DD HH:mm:ss"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :shortcuts="shortcuts"
          :default-time="defaultTime"
          v-bind="fieldProps"
          type="datetimerange"
        />
      </el-form-item>

      <!-- 自定义 -->
      <el-form-item
        v-else
        :prop="prop"
        :label="label"
        v-bind="formItemProps"
      >
        <slot :name="prop" :form="form" />
      </el-form-item>
    </template>

    <!-- 搜索与重置 -->
    <el-form-item v-if="!hideSearch" class="!mr-0">
      <el-button :loading="loading" :icon="Search as Component" type="primary" @click="onSearch">搜索</el-button>
      <el-button :icon="RefreshLeft" @click="resetForm">重置</el-button>
    </el-form-item>

    <!-- 工具栏 -->
    <el-form-item v-if="$slots.toolbar" class="mr-0" float-right pl-80px>
      <slot name="toolbar" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import type { Component } from 'vue'
import { RefreshLeft, Search } from '@element-plus/icons-vue'
import Dayjs from 'dayjs'
import { generateForm } from './j-tools'

interface Props {
  loading: boolean // 是否为loading状态
  inputWidth?: string // 输入框宽度,不包含时间选择器及自定义的非输入框和选择器
  hideSearch?: boolean // 是否显示搜索按钮
  searchOnMounted?: boolean // 是否在mounted后执行搜索
  formItems: JFormItem[] // 表单字段
  formProps?: JFormProps // 表单prop
  defaultSearchParams?: Record<string, any> // 默认搜索条件
}

const {
  loading,
  formItems,
  inputWidth = '220px',
  hideSearch,
  searchOnMounted = true,
  formProps,
  defaultSearchParams = {},
} = defineProps<Props>()

const emit = defineEmits<{
  search: [any]
}>()

const inputStyle = `--el-input-width: ${inputWidth}`
const selectStyle = `--el-select-width: ${inputWidth}`

// date picker 默认绑定的字段
const dateTimeKeys = formProps?.dateTimeKeys || DATE_TIME_KEYS

// 默认时间
const defaultTime: [Date, Date] = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
]

// 快捷选项
const end = Dayjs().endOf('day').toDate()
const shortcuts = [
  {
    text: '今天',
    value: [Dayjs().startOf('day').startOf('day').toDate(), end],
  },
  {
    text: '昨天',
    value: [Dayjs().subtract(1, 'day').startOf('day').toDate(), Dayjs().subtract(1, 'day').endOf('day').toDate()],
  },
  {
    text: '近三天',
    value: [Dayjs().subtract(3, 'day').startOf('day').toDate(), end],
  },
  {
    text: '近一周',
    value: [Dayjs().subtract(1, 'week').startOf('day').toDate(), end],
  },
  {
    text: '近一个月',
    value: [Dayjs().subtract(1, 'month').startOf('day').toDate(), end],
  },
  {
    text: '近三个月',
    value: [Dayjs().subtract(3, 'month').startOf('day').toDate(), end],
  },
  {
    text: '近一年',
    value: [Dayjs().subtract(1, 'year').startOf('day').toDate(), end],
  },
]

// 定义表单ref
const formRef = ref<FormInstance>()
const form = defineModel<Record<string, any>>('form', { default: {} })
if (JSON.stringify(form.value) === '{}') {
  form.value = {
    ...defaultSearchParams,
    ...generateForm(formItems, dateTimeKeys),
  }
}

/** 搜索 */
function onSearch() {
  // 校验表单，校验不通过则不执行搜索
  formRef.value?.validate().then(() => {
    const data = JSON.parse(JSON.stringify(form.value))
    delete data[DATE_TIME_RANGE]
    emit('search', data)
  })
}

/** 重置 */
function resetForm() {
  formRef.value?.resetFields()
}

// 默认onMounted后执行搜索
onMounted(() => {
  if (searchOnMounted) onSearch()
})

defineExpose({
  resetForm,
})
</script>
