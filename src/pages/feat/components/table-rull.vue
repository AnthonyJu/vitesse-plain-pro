<template>
  <!-- Hack: 更好的方式 -->
  <div>
    <el-table
      ref="tableRef"
      :data="tableData"
      height="170"
      class="rollTableRow"
    >
      <el-table-column
        v-for="col in columns"
        :key="col.id"
        :prop="col.id"
        :label="col.label"
        :width="col.width"
        show-overflow-tooltip
      />
    </el-table>
  </div>
</template>

<route lang="yaml">
  meta:
    name: 无限滚动
</route>

<script lang="ts" setup>
interface Column {
  id: string
  label: string
  width?: number
}

const props = defineProps({
  tableData: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array as () => Column[],
    default: () => [],
  },
  speed: {
    type: Number,
    default: 2,
  },
})
const tableRef: Ref<HTMLElement | any> = ref(null) // 表格实例

function scrollFn(tableBody: any) {
  let isScroll = true // 滚动
  let direction = 1 // 滚动方向，1表示向下，-1表示向上
  const tableDom = tableBody.getElementsByClassName('el-scrollbar__wrap')[0]

  // 鼠标放上去，停止滚动；移开，继续滚动
  tableDom.addEventListener('mouseover', () => {
    isScroll = false
  })
  tableDom.addEventListener('mouseout', () => {
    isScroll = true
  })

  setInterval(() => {
    if (isScroll) {
      tableDom.scrollTop += direction * props.speed // 设置滚动速度
      if (tableDom.clientHeight + tableDom.scrollTop >= tableDom.scrollHeight) {
        direction = -1 // 到达底部，改变方向
      }
      else if (tableDom.scrollTop === 0) {
        direction = 1 // 到达顶部，改变方向
      }
    }
  }, 100)
}

onMounted(() => {
  scrollFn(tableRef.value.$refs.bodyWrapper) // 设置滚动
})
</script>
