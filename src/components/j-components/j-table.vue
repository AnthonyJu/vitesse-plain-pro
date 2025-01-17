<template>
  <el-table ref="tableRef" :data="data" v-bind="tableProps">
    <template v-for="col in columns" :key="col.prop || col.type">
      <el-table-column
        v-if="!col.slot || $slots[col.prop!]"
        align="center"
        show-overflow-tooltip
        v-bind="col"
      >
        <template #default="scope">
          <slot v-if="col.slot" :name="col.prop" :row="scope.row" />
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>

<script setup lang="ts">
import type { TableInstance, TableProps } from 'element-plus'

interface Props {
  data: any[]
  columns: JTableColumn[]
  tableProps?: Partial<TableProps<any>>
}

defineProps<Props>()

const tableRef = ref<TableInstance>()

defineExpose({ tableRef })
</script>
