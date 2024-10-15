<template>
  <div>
    <div>{{ route.params }}</div>
    <div>{{ route.meta }}</div>
    <el-input v-model="value" />
  </div>
</template>

<script setup lang='ts'>
const route = useRoute('/menu/menu-0/[id]')
const value = ref('')
</script>
