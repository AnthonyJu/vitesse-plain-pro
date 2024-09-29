<template>
  <div layout-default>
    <NoticeBar
      text="🎉Tour 漫游式引导-ElementPlus-v2.5.0，地址：https://element-plus.org/zh-CN/component/tour.html，点击前往"
      right-icon="carbon:chevron-right"
      mode="link"
      @link="linkFn"
    />
    <el-card class="mt-15px" shadow="hover" header="漫游式引导：简单示例">
      <el-button type="primary" @click="open = true">开始漫游</el-button>

      <el-divider />

      <el-space>
        <el-button ref="ref1">上传文件</el-button>
        <el-button ref="ref2" type="primary">保存</el-button>
        <el-button ref="ref3" :icon="MoreFilled" />
        <!-- 子组件 -->
        <Child ref="refChild" />
      </el-space>

      <el-tour v-model="open">
        <el-tour-step :target="ref1?.$el" title="上传文件">
          <img
            src="https://element-plus.org/images/element-plus-logo.svg"
            alt="tour.png"
          >
          <div>把想要上传的文件放在这</div>
        </el-tour-step>
        <el-tour-step
          :target="ref2?.$el"
          title="保存"
          description="保存你的更改"
        />
        <el-tour-step
          :target="ref3?.$el"
          title="其他选项"
          description="点击查看其他选项"
        />
        <el-tour-step
          :target="ref4?.$el"
          title="查看上传"
          description="这是一个子组件的漫游"
        />
      </el-tour>

      <el-divider />
      <div class="my-10px">代码</div>
      <CodeBlock :code="tourDemoStr" lang="html" />
    </el-card>
  </div>
</template>

<script setup lang='ts'>
import type { ButtonInstance } from 'element-plus'
import { MoreFilled } from '@element-plus/icons-vue'
import Child from './components/child.vue'
import { tourDemoStr } from './data/highlight'

const open = ref(false)
const ref1 = ref<ButtonInstance>()
const ref2 = ref<ButtonInstance>()
const ref3 = ref<ButtonInstance>()
const refChild = ref()
const ref4 = ref<ButtonInstance>()

function linkFn() {
  window.open('https://element-plus.org/zh-CN/component/tour.html')
}
onMounted(() => {
  ref4.value = refChild.value.refGoView
})
</script>
