<template>
  <div flex-col layout-default>
    <el-form label-width="80px" inline>
      <el-form-item label="当前页">
        <el-input v-model="pagination.current" :max-length="20" />
      </el-form-item>
      <el-form-item label="每页数量">
        <el-input v-model="pagination.size" :max-length="20" />
      </el-form-item>
    </el-form>

    <JPagination
      v-model:current="pagination.current"
      v-model:size="pagination.size"
      :total="pagination.total"
      :loading="pagination.loading"
      @handle-search="handleSearch"
    />
  </div>
</template>

<script setup lang='ts'>
import { ElMessage } from 'element-plus'

const pagination = ref({
  current: 1,
  size: 15,
  total: 85,
  loading: false,
})

function handleSearch() {
  ElMessage.success('搜索')
}
</script>
