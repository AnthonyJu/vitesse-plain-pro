<template>
  <div layout-default>
    <div ref="usage" mb-16px />
    <div ref="vueCode" />
  </div>
</template>

<script setup lang='ts'>
import { tsStr, vueStr } from './data/highlight'

const usage = useTemplateRef('usage')
const vueCode = useTemplateRef('vueCode')

useSyntaxHighlighter(tsStr, 'ts', usage)
useSyntaxHighlighter(vueStr, 'vue', vueCode)
</script>
