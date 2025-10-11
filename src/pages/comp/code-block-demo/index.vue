<template>
  <div layout-default>
    <el-card shadow="hover" header="代码高亮：右上角添加了展示语言和复制功能">
      <CodeBlock :code="noticeBarIconStr" lang="html" />
    </el-card>
  </div>
</template>

<script setup lang='ts'>
import { noticeBarIconStr } from '../data/highlight'
</script>
