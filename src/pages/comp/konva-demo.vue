<template>
  <div layout-default>
    <el-card shadow="hover" header="Konva标注组件">
      <KonvaAnnotation
        :width="1000"
        :height="600"
      />
    </el-card>

    <el-card shadow="hover" header="Konva标注组件：参数" class="mt-15px">
      <el-table :data="state.tableData" style="width: 100%;">
        <el-table-column prop="a1" label="参数" />
        <el-table-column prop="a2" label="说明" />
        <el-table-column prop="a3" label="类型" />
        <el-table-column prop="a4" label="可选值" />
        <el-table-column prop="a5" label="默认值" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang='ts'>
const state = reactive({
  tableData: [
    { a1: 'width', a2: '宽度', a3: 'number', a4: '-', a5: '500px' },
    { a1: 'height', a2: '高度', a3: 'number', a4: '-', a5: '500px' },
  ],
})
</script>
