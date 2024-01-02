<template>
  <el-card shadow="always" :body-style="{ padding: '20px' }">
    <template #header>
      <div>
        <span>card title</span>
      </div>
    </template>
    card body
  </el-card>
  <div h-100px w-full rounded-2 bg-red />
  <div h-1000px w-full rounded-2 bg-blue />
</template>

<route lang="yaml">
meta:
  name: 首页
</route>

<script setup lang="ts">

</script>
