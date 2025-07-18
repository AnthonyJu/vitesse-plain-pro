<!-- 仅适用于 multiple -->
<template>
  <el-select v-model="value" placeholder="请选择" v-bind="$attrs" multiple>
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

interface Props extends /* @vue-ignore */ Partial<ISelectProps> {
  options: SelectOptionItem[]
  separator?: string
}

const { separator = ',' } = defineProps<Props>()

const bindValue = defineModel({ default: '' })

const initValue = returnValue(bindValue.value)

const value = ref(initValue)

watch(bindValue, (val) => {
  if (val) value.value = returnValue(val)
  else value.value = []
})

watch(value, handleChange)

function returnValue(val: string) {
  return val.split(separator).filter(Boolean)
}

function handleChange(val: string[]) {
  bindValue.value = val.join(separator)
}
</script>
