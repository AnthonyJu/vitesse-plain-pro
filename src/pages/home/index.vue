<template>
  <div class="full flex-col">
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <template #header>
        <div>
          <span>card title1</span>
        </div>
      </template>
      card body content
    </el-card>
    <div h-100px w-full rounded-2 bg-red />
    <div w-full flex-1 rounded-2 bg-blue />
  </div>
</template>

<route lang="yaml">
meta:
  name: 首页
</route>

<script setup lang="ts">

</script>
