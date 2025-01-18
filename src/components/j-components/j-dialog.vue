<template>
  <el-dialog
    v-model="visible"
    class="j-dialog"
    destroy-on-close
    v-bind="dialogProps"
    @closed="handleClose"
  >
    <el-scrollbar max-height="600px" class="h-auto!">
      <ElForm ref="formRef" :model="form" :disabled="loading" label-width="80px" v-bind="formProps">
        <el-row :gutter="20" class="mx-0!">
          <el-col
            v-for="{ prop, label, span, type, options, fieldProps, formItemProps } in formItems"
            :key="prop"
            :span="span || 24"
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
              <JSelect
                v-if="fieldProps?.multiple"
                v-model="form[prop]"
                :options="options!"
                placeholder="请选择"
                clearable
                v-bind="fieldProps"
              />

              <el-select
                v-else
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

            <!-- 自定义 -->
            <el-form-item
              v-else
              :prop="prop"
              :label="label"
              v-bind="formItemProps"
            >
              <slot :name="prop" :form="form" />
            </el-form-item>
          </el-col>
        </el-row>
      </ElForm>
    </el-scrollbar>
    <div class="flex justify-end px-10px pt-5px">
      <el-button :disabled="loading" @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="submit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { ElForm } from 'element-plus'
import { generateForm } from './j-tools'

interface Props {
  visible: boolean // 用于控制显示隐藏
  loading: boolean // 用于控制确定按钮的loading状态及禁用
  formItems: JFormItem[] // 表单项
  formProps?: JFormProps // form的配置项
  dialogProps?: JDialogProps // dialog的配置项
}

const props = defineProps<Props>()

const emit = defineEmits<{
  onClosed: []
  onSubmit: []
}>()

const visible = defineModel('visible', { default: false })
const form = defineModel<Record<string, any>>('form', { default: {} })
if (JSON.stringify(form.value) === '{}') {
  form.value = generateForm(props.formItems)
}

const formRef = ref<FormInstance>()

/** 弹窗关闭时重置表单 */
function handleClose() {
  formRef.value!.resetFields()
  emit('onClosed')
}

/** 提交表单 */
function submit() {
  formRef.value!.validate((valid: boolean) => {
    if (valid) emit('onSubmit')
  })
}
</script>

<style lang="scss">
.j-dialog {
  .el-dialog__body {
    padding: var(--el-dialog-padding-primary) 0 0;
  }
}
</style>
