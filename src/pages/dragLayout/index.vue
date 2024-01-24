<template>
  <div class="main-container gridDrag">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="拖拽类型一" name="first">
        <NoticeBar text="项目地址：https://github.com/jbaysolutions/vue-grid-layout" />
        <grid-layout
              v-model:layout="state.layout"
              :col-num="12"
              :row-height="30"
              :is-draggable="true"
              :is-resizable="true"
              :is-mirrored="false"
              :vertical-compact="true"
              :margin="[10, 10]"
              :use-css-transforms="true"
      >

          <grid-item v-for="item in state.layout"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i"
            :key="item.i">
              {{item.i}}
          </grid-item>
        </grid-layout>
      </el-tab-pane>
      <el-tab-pane label="拖拽类型二" name="second">
        <NoticeBar text="项目地址：https://github.com/mauricius/vue-draggable-resizable?tab=readme-ov-file" />
        <div class="h-600px w-800px dragResizable">
          <vue-draggable-resizable :min-width="250" :min-height="100" :w="300" :h="200"
            :parent="true">
          </vue-draggable-resizable>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">

// 定义变量内容
const state = reactive({
	layout: [
		{ x: 0, y: 0, w: 2, h: 2, i: '0' },
		{ x: 2, y: 0, w: 2, h: 4, i: '1' },
		{ x: 4, y: 0, w: 2, h: 5, i: '2' },
		{ x: 6, y: 0, w: 2, h: 3, i: '3' },
		{ x: 8, y: 0, w: 2, h: 3, i: '4' },
		{ x: 10, y: 0, w: 2, h: 3, i: '5' },
		{ x: 0, y: 5, w: 2, h: 5, i: '6' },
	],
});

const activeName = ref('first')


function handleClick(tab: any, event: any) {
  console.log(tab, event)
}
</script>

<style lang="scss">
.gridDrag {
  .vue-grid-item {
    color: #fff;
    background: #2fc8fc;
  }
}

.dragResizable {
  border: 1px solid #2fc8fc;
  border-radius: 5px;
}

.main-container .vdr {
  background-color: #2fc8fc;
  border: 1px solid #2fc8fc;
}
</style>
