<template>
  <div main-container>
    <div id="vue" />
  </div>
</template>

<route lang='yaml'>
meta:
  name: 语法高亮
</route>

<script setup lang='ts'>
import { vueStr } from './data/highlight'

useSyntaxHighlighter(vueStr, 'vue', '#vue')
</script>
