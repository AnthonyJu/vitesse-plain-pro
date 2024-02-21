<template>
  <ElForm ref="formRef" :model="form" :disabled="loading" v-bind="formProps">
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
        v-bind="formItemProps"
      >
        <el-input
          v-model="form[prop]"
          placeholder="请输入"
          clearable
          v-bind="fieldProps"
        />
      </el-form-item>

      <!-- 文本框 -->
      <el-form-item
        v-else-if="type === 'textarea'"
        :prop="prop"
        :label="label"
        v-bind="formItemProps"
      >
        <el-input
          v-model="form[prop]"
          type="textarea"
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
        <el-select
          v-model="form[prop]"
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
        v-else-if="type === 'dateTime'"
        :prop="prop"
        :label="label"
        v-bind="formItemProps"
      >
        <el-date-picker
          v-model="form[prop]"
          clearable
          type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :shortcuts="shortcuts"
          :default-time="defaultTime"
          :disabled-date="(time:Date) => time.getTime() > Date.now()"
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
    <el-form-item v-if="!hideSearch" class="mr-0">
      <el-button :loading="loading" :icon="Search" type="primary" @click="onSearch">搜索</el-button>
      <el-button :icon="RefreshLeft" @click="onReset">重置</el-button>
    </el-form-item>

    <!-- 工具栏 -->
    <el-form-item class="mr-0" float-right pl-80px>
      <slot name="toolbar" />
    </el-form-item>
  </ElForm>
</template>

<script setup lang="ts">
import { ElForm } from 'element-plus'
import { RefreshLeft, Search } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

interface Props {
  loading: boolean // 是否为loading状态
  formItems: JFormItem[] // 表单项
  inputWidth?: number // 输入框宽度,不包含时间选择器及自定义的非输入框和选择器
  hideSearch?: boolean // 是否显示搜索按钮
  searchOnMounted?: boolean // 是否在mounted后执行搜索
  formProps?: JFormProps
}

const props = withDefaults(
  defineProps<Props>(),
  {
    inputWidth: 220,
    searchOnMounted: true,
  },
)

const emit = defineEmits<{
  search: [any]
}>()

// 默认时间
const defaultTime: [Date, Date] = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
]

// 快捷选项
const end = new Date()
const start = new Date().getTime()
const oneDay = 3600 * 1000 * 24
const shortcuts = [
  {
    text: '近一周',
    value: () => [new Date().setTime(start - oneDay * 7), end],
  },
  {
    text: '近一个月',
    value: () => [new Date().setTime(start - oneDay * 30), end],
  },
  {
    text: '近三个月',
    value: () => [new Date().setTime(start - oneDay * 90), end],
  },
  {
    text: '近一年',
    value: () => [new Date().setTime(start - oneDay * 365), end],
  },
]

// 定义表单ref
const formRef = ref<FormInstance>()
const form = defineModel<any>('form', { default: {} })
if (JSON.stringify(form.value) === '{}') {
  form.value = generateForm(props.formItems)
}

/** 搜索 */
function onSearch() {
  // 校验表单，校验不通过则不执行搜索
  formRef.value?.validate().then(() => {
    emit('search', JSON.parse(JSON.stringify(form.value)))
  })
}

/** 重置 */
function onReset() {
  formRef.value?.resetFields()
}

// 默认onMounted后执行搜索
onMounted(() => {
  if (props.searchOnMounted) onSearch()
})
</script>

<style scoped lang="scss">
.mr-0 {
  margin-right: 0;
}

.el-input {
  --el-input-width: v-bind(`${inputWidth}px`);
}

.el-select {
  --el-select-width: v-bind(`${inputWidth}px`);
}
</style>
