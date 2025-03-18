<template>
  <div class="flex-col">
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <template #header>
        <div>
          <span>card title122</span>
        </div>
      </template>
      card body content test
    </el-card>
    <div h-100px w-full rounded-2 bg-red @click="saveFile('/xx/fireStation.xlsx')" />
    <div h-1000px w-full rounded-2 bg-blue />
  </div>
</template>

<script setup lang="ts">
import { saveFile } from '@/utils/tool-functions'
</script>
