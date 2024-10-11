<template>
  <el-icon v-if="icon" class="iconify">
    <Iconify h-18px w-18px :icon="icon" />
  </el-icon>
  <span :class="{ 'ml-12px': !icon }">{{ title }}</span>
</template>

<script setup lang='ts'>
defineProps<{
  icon?: string
  title?: string
}>()
</script>
