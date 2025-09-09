<template>
  <el-icon v-if="icon">
    <span :class="icon" class="mr-6px text-16px" />
  </el-icon>
  <span :class="{ 'ml-12px': !icon }">{{ title }}</span>
</template>

<script setup lang='ts'>
interface Props {
  icon?: string
  title?: string
}

defineProps<Props>()
</script>
