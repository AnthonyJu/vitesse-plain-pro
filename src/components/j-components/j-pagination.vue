<template>
  <el-pagination
    v-show="total > 0"
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
import request from '@/utils/request'

interface Props {
  url?: string // 请求地址
  params?: Record<string, any> // 请求参数
  layout?: string // 组件布局
  pageSizes?: number[] // 每页数量选项
  dataFormator?: (data: any[]) => any[] // 返回数据处理函数
}

const {
  layout = 'total, sizes, prev, pager, next, jumper',
  pageSizes = [15, 30, 50, 100],
  ...props
} = defineProps<Props>()

const emit = defineEmits<{
  handleSearch: []
  handleError: [error: any]
}>()

// 默认第一页，每页15条
const size = defineModel('size', { default: 15 })
const current = defineModel('current', { default: 1 })
const total = defineModel('total', { default: 0 })
const loading = defineModel('loading', { default: false })

/** 当前页变化 */
function handleSizeChange(newSize: number) {
  size.value = newSize
  // 如果没有请求地址，则触发搜索事件
  if (!props.url) emit('handleSearch')
  else handleSearch()
}
/** 每页数量变化 */
function handleCurrentChange(newCurrent: number) {
  current.value = newCurrent
  // 如果没有请求地址，则触发搜索事件
  if (!props.url) emit('handleSearch')
  else handleSearch()
}

/** 数据 */
const data = defineModel<any[]>('data', { default: [] })

/** 搜索 */
function handleSearch() {
  loading.value = true
  request({
    url: props.url,
    method: 'get',
    params: {
      ...props.params,
      size: size.value,
      current: current.value,
    },
  })
    .then((res) => {
      // TODO 处理返回数据
      data.value = props.dataFormator?.(res.data.data.records) || res.data.data.records
      total.value = res.data.data.total
    })
    .catch((err) => {
      emit('handleError', err)
    })
    .finally(() => {
      loading.value = false
    })
}

// 存在请求地址则在挂在后进行数据请求
onMounted(() => {
  if (props.url) handleSearch()
})

defineExpose({ handleSearch })
</script>

<style scoped lang="scss">
.mt-18px {
  margin-top: 18px;
}

.self-end {
  align-self: flex-end;
}
</style>
