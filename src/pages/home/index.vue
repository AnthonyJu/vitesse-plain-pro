<template>
  <div class="flex-col">
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <template #header>
        <div>
          <span>card</span>
        </div>
      </template>
      card body
    </el-card>
    <div h-100px w-full rounded-2 bg-red />
    <div h-1000px w-full rounded-2 bg-blue />
  </div>
</template>

<script setup lang="ts">

</script>
