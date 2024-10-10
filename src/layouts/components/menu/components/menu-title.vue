<template>
  <el-icon><Iconify v-if="icon" h-18px w-18px :icon="icon" /></el-icon>
  <span ml-15px>{{ title }}</span>
</template>

<script setup lang='ts'>
defineProps<{
  icon?: string
  title?: string
}>()
</script>
