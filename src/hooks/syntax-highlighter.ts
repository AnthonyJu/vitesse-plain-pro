import type { BundledTheme } from 'shikiji'
import type { ShallowRef } from 'vue'
import { codeToHtml } from 'shikiji'

/**
 * @description: Syntax highlighter
 * @param {string} str code string
 * @param {string} lang language
 * @param {string|Ref<HTMLElement | undefined>} container container selector
 * @param {BundledTheme} theme theme，default is auto according to system theme（vitesse-dark/vitesse-light）
 * @return { html: Ref<string> | string  } html: highlight HTML string
 */
export function useSyntaxHighlighter(
  str: string,
  lang: string,
  container?: ShallowRef<HTMLElement | null>,
  theme?: BundledTheme,
): { html: Ref<string> | string } {
  const html = ref('')
  const syntaxTheme = computed(() => theme || (isDark.value ? 'vitesse-dark' : 'vitesse-light'))

  const unWatch = watch(
    syntaxTheme,
    (val) => {
      codeToHtml(str, {
        lang,
        theme: val,
      })
        .then((value) => {
          html.value = value
          if (container) container.value!.innerHTML = value
          // 指定了主题，不再根据系统主题变化
          if (theme) unWatch()
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
