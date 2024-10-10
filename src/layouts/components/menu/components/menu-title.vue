<template>
  <Iconify v-if="icon" h-18px w-18px :icon="icon" />
  <span ml-15px>{{ title }}</span>
</template>

<script setup lang='ts'>
defineProps<{
  icon?: string
  title?: string
}>()
</script>
