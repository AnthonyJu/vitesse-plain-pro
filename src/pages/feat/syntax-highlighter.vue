<template>
  <div layout-default>
    <div id="usage" mb-16px />
    <div id="vue" />
  </div>
</template>

<script setup lang='ts'>
import { tsStr, vueStr } from './data/highlight'

useSyntaxHighlighter(tsStr, 'ts', '#usage')
useSyntaxHighlighter(vueStr, 'vue', '#vue')
</script>
