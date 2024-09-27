<template>
  <el-button ref="refGoView">子组件: 查看上传</el-button>
</template>

<script setup lang='ts'>
import type { ButtonInstance } from 'element-plus'
import { ref } from 'vue'

const refGoView = ref<ButtonInstance>()

defineExpose({
  refGoView,
})
</script>
