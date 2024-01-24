<template>
  <ElTable :data="data" v-bind="tableProps">
    <ElTableColumn
      v-for="col in columns"
      :key="col.prop"
      align="center"
      show-overflow-tooltip
      v-bind="col"
    >
      <template #default="scope">
        <slot v-if="col.slot" :name="col.prop" :row="scope.row" />
      </template>
    </ElTableColumn>
  </ElTable>
</template>

<script setup lang="ts">
import type { TableProps } from 'element-plus'

interface Props {
  data: any[]
  columns: JTableColumn[]
  tableProps?: Partial<TableProps<any>>
}

defineProps<Props>()
</script>
