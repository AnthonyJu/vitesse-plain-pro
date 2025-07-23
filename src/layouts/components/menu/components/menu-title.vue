<template>
  <span v-if="icon" :class="icon" class="iconify mr-6px text-16px" />
  <span :class="{ 'ml-12px': !icon }">{{ title }}</span>
</template>

<script setup lang='ts'>
interface Props {
  icon?: string
  title?: string
}

defineProps<Props>()
</script>
