<!-- 仅适用于 datetimerrange -->
<template>
  <el-date-picker
    v-model="value"
    range-separator="-"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
    v-bind="$attrs"
  />
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

watch([startTime, endTime], () => {
  const [start, end] = [startTime.value, endTime.value]
  value.value = [start, end]
})

// TODO 两次问题
</script>
