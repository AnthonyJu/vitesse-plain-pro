<template>
  <div flex-col layout-default>
    <el-form label-width="80px" inline>
      <el-form-item label="当前页">
        <el-input v-model="current" :max-length="20" />
      </el-form-item>
      <el-form-item label="每页数量">
        <el-input v-model="size" :max-length="20" />
      </el-form-item>
    </el-form>

    <JPagination
      v-model:current="current"
      v-model:size="size"
      :total="total"
      :loading="loading"
      @handle-search="handleSearch"
    />
  </div>
</template>

<route lang='yaml'>
meta:
  name: JPagination
</route>

<script setup lang='ts'>
import { ElMessage } from 'element-plus'

const current = ref(1)
const size = ref(15)
const total = ref(89)
const loading = ref(false)

function handleSearch() {
  ElMessage.success('搜索')
}
</script>
