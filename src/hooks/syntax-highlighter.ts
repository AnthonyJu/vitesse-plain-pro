import type { BundledTheme, CodeToHastOptions } from 'shiki'
import type { ShallowRef } from 'vue'
import { codeToHtml } from 'shiki'

/**
 * @description: 语法高亮
 * @param {string} str 代码字符串
 * @param {string} lang 语言
 * @param {string|Ref<HTMLElement | undefined>} container 容器
 * @param {BundledTheme | [BundledTheme, BundledTheme]} theme 主题，默认为 'vitesse-dark' | 'vitesse-light' 并根据系统主题变化
 * @param {CodeToHastOptions} codeToHtmlOptions codeToHtml选项
 * @return { html: Ref<string> | string  } html代码字符串
 */
export function useSyntaxHighlighter(
  str: string,
  lang: string,
  container?: ShallowRef<HTMLElement | null>,
  theme?: BundledTheme | [BundledTheme, BundledTheme],
  codeToHtmlOptions?: CodeToHastOptions,
): { html: Ref<string> | string } {
  // 生成的html代码
  const html = ref('')

  // 默认主题
  theme = theme || ['vitesse-dark', 'vitesse-light']

  // 语法主题
  const syntaxTheme = computed(() => {
    if (typeof theme === 'string') return theme
    return theme[isDark.value ? 0 : 1]
  })

  // 监听主题变化
  const unWatch = watch(
    isDark,
    () => {
      codeToHtml(str, {
        lang,
        theme: syntaxTheme.value,
        ...codeToHtmlOptions,
      })
        .then((value) => {
          // 设置html代码
          html.value = value

          // 容器存在，设置内容
          if (container) container.value!.innerHTML = value

          // 指定了主题，不再根据系统主题变化
          if (typeof theme === 'string') unWatch()
        })
    },
    {
      flush: 'post',
      immediate: true,
    },
  )

  return {
    html,
  }
}
