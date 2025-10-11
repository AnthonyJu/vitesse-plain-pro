<template>
  <div class="layout-default">
    <el-card shadow="hover" header="table无限滚动">
      <TableRoll />
    </el-card>
    <el-card class="mt-15px" shadow="hover" header="Pie无限转动">
      <PieChartRoll />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import PieChartRoll from './components/pie-chart-roll.vue'
import TableRoll from './components/table-roll.vue'
</script>
