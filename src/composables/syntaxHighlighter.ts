import { codeToHtml } from 'shikiji'

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
}
