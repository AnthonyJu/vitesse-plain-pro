<!-- 仅适用于 multiple -->

<template>
  <el-select v-model="value" multiple v-bind="$attrs" @change="handleChange">
    <el-option
      v-for="item in options"
      :key="item.label"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script setup lang='ts'>
interface Props {
  data: string
  options?: SelectOptionItem[]
}

const { data } = defineProps<Props>()

// tips 如果你的options的值是number,记得传options时转为string
const value = ref(data.split(','))
const bindValue = defineModel({ default: '' })
bindValue.value = data

function handleChange(val: string[]) {
  bindValue.value = val.join(',')
}
</script>
