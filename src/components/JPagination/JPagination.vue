<template>
  <el-pagination
    class="mt-18px self-end"
    v-bind="$attrs"
    :disabled="loading"
    :current-page="current"
    :page-size="size"
    :total="total"
    :layout="layout"
    :background="true"
    :page-sizes="pageSizes"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script setup lang="ts">
/**
 * 分页组件
 * @param current 当前页
 * @param size 每页数量
 * @param total 总数
 * @param loading 是否加载中
 * @param layout 组件布局
 * @param pageSizes 每页数量选项
 */
interface Props {
  current: number // 当前页
  size: number // 每页数量
  total: number // 总数
  loading: boolean // 是否加载中
  layout?: string // 组件布局
  pageSizes?: number[] // 每页数量选项
}

// 默认第一页，每页15条
withDefaults(defineProps<Props>(), {
  layout: 'total, sizes, prev, pager, next, jumper',
  pageSizes: () => [15, 30, 50, 100],
})

const emit = defineEmits<{
  'update:current': [number]
  'update:size': [number]
  'handleSearch': []
}>()

/** 当前页变化 */
function handleSizeChange(size: number) {
  emit('update:size', size)
  emit('handleSearch')
}
/** 每页数量变化 */
function handleCurrentChange(current: number) {
  emit('update:current', current)
  emit('handleSearch')
}
</script>
