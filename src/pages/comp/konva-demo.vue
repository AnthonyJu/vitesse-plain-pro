<template>
  <div layout-default>
    <el-card shadow="hover" header="Konva标注组件" class="w-full">
      <div class="flex">
        <div class="tools flex-col flex-1">
          <el-button @click="konvaRef?.enableDrawPoint()">画点</el-button>
          <el-button @click="konvaRef?.enableDrawLine()">画线</el-button>
          <el-button @click="konvaRef?.enableDrawRect()">画矩形</el-button>
          <el-button @click="konvaRef?.enableDrawCircle()">画圆</el-button>
          <el-button @click="konvaRef?.enableDrawPolygon()">画多边形</el-button>
          <el-button @click="konvaRef?.clear()">清除</el-button>
        </div>
        <div :style="{ width: `${konvaWidth}px`, height: `${konvaHeight}px` }" class="bg-#eee">
          <KonvaAnnotation
            ref="konvaRef"
            :width="konvaWidth"
            :height="konvaHeight"
          />
        </div>
        <div class="flex-1">
          <el-scrollbar class="ml-10px" :height="konvaHeight">
            画布中的数据
          </el-scrollbar>
        </div>
      </div>
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
import konvaBgImg from '@/assets/images/konva/konva_bg.png'

const konvaRef = ref<any>()

const konvaWidth = ref(1200)
const konvaHeight = computed(() => Math.round(konvaWidth.value * 9 / 16))

const state = reactive({
  tableData: [
    { a1: 'width', a2: '宽度', a3: 'number', a4: '-', a5: '500px' },
    { a1: 'height', a2: '高度', a3: 'number', a4: '-', a5: '500px' },
  ],
})

onMounted(() => {
  konvaRef.value?.addBg(konvaBgImg)
})
</script>

<style lang="scss" scoped>
.tools {
  .el-button {
    margin: 4px;
  }
}
</style>
