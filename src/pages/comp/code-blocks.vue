<template>
  <div>
    <el-card shadow="hover" header="代码高亮：右上角添加了展示语言和复制功能">
      <CodeBlock :code-data="codeData" />
    </el-card>
  </div>
</template>

<route lang="yaml">
  meta:
    name: 代码高亮块
</route>

<script setup lang='ts'>
import { noticeBarIconStr } from './data/highlight'

const codeData = reactive({
  id: '#noticeBarIcon',
  code: noticeBarIconStr,
  language: 'html',
})
</script>
