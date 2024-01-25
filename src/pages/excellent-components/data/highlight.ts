export const tsStr = `import { codeToHtml } from 'shikiji'

/**
 * @description: Syntax highlighter
 * @param {string} str code string
 * @param {string} lang language
 * @param {string} container container selector
 * @return { html: Ref<string> } html: highlight HTML string
 */
export function useSyntaxHighlighter(str: string, lang: string, container?: string) {
  const html = ref('')

  onMounted(() => {
    codeToHtml(str, {
      lang,
      theme: 'vitesse-dark',
    })
      .then((value) => {
        html.value = value

        if (!container) return

        const el = document.querySelector(container)
        if (el) el.innerHTML = value
      })
  })

  return {
    html,
  }
}`

export const vueStr = `<template>
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
`
