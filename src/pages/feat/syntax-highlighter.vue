<template>
  <div>
    <div id="usage" mb-16px />
    <div id="vue" />
  </div>
</template>

<route lang='yaml'>
meta:
  name: 语法高亮
</route>

<script setup lang='ts'>
import { tsStr, vueStr } from './data/highlight'

useSyntaxHighlighter(tsStr, 'ts', '#usage')
useSyntaxHighlighter(vueStr, 'vue', '#vue')
</script>
