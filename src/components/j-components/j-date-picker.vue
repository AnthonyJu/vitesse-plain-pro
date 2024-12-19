<!-- 仅适用于 datetimerrange -->
<template>
  <el-date-picker v-model="value" v-bind="$attrs" />
</template>

<script setup lang='ts'>
const value = defineModel({ default: ['', ''] })
const startTime = defineModel('startTime', { default: '' })
const endTime = defineModel('endTime', { default: '' })

watch(
  value,
  (val) => {
    const [start, end] = val || ['', '']
    startTime.value = start
    endTime.value = end
  },
  {
    deep: true,
  },
)
</script>
