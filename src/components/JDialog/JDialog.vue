<template>
  <el-dialog v-model="visible" class="j-dialog" v-bind="dialogProps" @closed="handleClose">
    <ElForm
      ref="formRef"
      :model="form"
      :rules="formOptions.rules"
      :disabled="loading"
      v-bind="formOptions.formProps"
    >
      <!-- 检索条件 -->
      <el-row :gutter="20">
        <el-col
          v-for="{
            span = 24,
            prop,
            type,
            options,
            fieldProps,
            ...otherProps
          } in formOptions.renderForms"
          :key="prop"
          :span="span"
        >
          <!-- 输入框 -->
          <el-form-item v-if="type === 'input'" v-bind="otherProps">
            <el-input v-model="form![prop]" placeholder="请输入" v-bind="fieldProps" />
          </el-form-item>

          <!-- 文本框 -->
          <el-form-item v-else-if="type === 'textarea'" v-bind="otherProps">
            <el-input
              v-model="form![prop]"
              type="textarea"
              placeholder="请输入"
              v-bind="fieldProps"
            />
          </el-form-item>

          <!-- 选择器 -->
          <el-form-item v-else-if="type === 'select'" v-bind="otherProps">
            <el-select
              v-model="form![prop]"
              placeholder="请选择"
              clearable
              w-full
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
          <el-form-item v-else-if="type === 'slot'" v-bind="otherProps">
            <slot :name="prop" :form="form" />
          </el-form-item>
        </el-col>
      </el-row>
    </ElForm>
    <template #footer>
      <el-button :disabled="loading" @click="visible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submit">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElForm } from 'element-plus'
import type { DialogProps, FormInstance } from 'element-plus'

interface Props {
  visible: boolean // 用于控制显示隐藏
  loading: boolean // 用于控制确定按钮的loading状态及禁用
  form: Record<string, any> // 用于双向绑定表单数据
  formOptions: JFormOptions // form的配置项
  dialogProps?: Partial<DialogProps> // dialog的配置项
}

defineProps<Props>()

const emit = defineEmits(['onSubmit', 'onClosed'])

const form = defineModel<Record<string, any>>('form')
const visible = defineModel<boolean>('visible')

const formRef = ref<FormInstance>()

// 弹窗关闭时重置表单
function handleClose() {
  emit('onClosed')
  formRef.value!.resetFields()
}

// 提交表单
function submit() {
  formRef.value!.validate((valid: boolean) => {
    if (valid) emit('onSubmit')
  })
}
</script>

<style lang="scss">
.j-dialog {
  .el-dialog__body {
    padding: var(--el-dialog-padding-primary) var(--el-dialog-padding-primary) 4px;
  }
}
</style>
