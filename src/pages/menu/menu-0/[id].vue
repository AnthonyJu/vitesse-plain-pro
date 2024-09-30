<template>
  <div>
    <div>{{ route.params }}</div>
    <div>{{ route.meta }}</div>
  </div>
</template>

<script setup lang='ts'>
const route = useRoute('/menu/menu-0/[id]')
</script>
