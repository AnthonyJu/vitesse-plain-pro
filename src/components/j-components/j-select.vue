<!-- 仅适用于 multiple -->
<template>
  <el-select v-model="value" v-bind="$props" multiple @change="handleChange">
    <el-option
      v-for="item in options"
      :key="item.label"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script setup lang='ts'>
import type { ISelectProps } from 'element-plus'

interface Props extends Partial<ISelectProps> {
  options: SelectOptionItem[]
}

defineProps<Props>()

const bindValue = defineModel({ default: '' })

const initValue = bindValue.value.split(',').filter(Boolean)

const value = ref(initValue)
function handleChange(val: string[]) {
  bindValue.value = val.join(',')
}
</script>
