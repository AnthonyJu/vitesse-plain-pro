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

export const noticeBarSimpleStr = `<NoticeBar text="😎孩儿立志出乡关,👨‍💻学不成名誓不还。🌳埋骨何须桑梓地,🏕人生无处不青山。"/>`

export const noticeBarIconStr = `<NoticeBar
 :text="state.textStr"
 left-icon="carbon:user-speaker"
 right-icon="carbon:chevron-right"
 background="#ecf5ff"
 mode="link"
 color="#409eff"
 :speed="100"
 @link="window.open('xxxxx')"
/>`

export const noticeBarScrollStr =
`<NoticeBar :scrollable="true">
  <el-carousel
    height="40px"
    direction="vertical"
    :autoplay="true"
    indicator-position="none"
    :interval="3000"
  >
    <el-carousel-item v-for="v in state.noticeList" :key="v">{{ v }} </el-carousel-item>
  </el-carousel>
</NoticeBar>`
