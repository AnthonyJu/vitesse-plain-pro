import { codeToHtml } from 'shikiji'

/**
 * @description: Syntax highlighter
 * @param {string} str code string
 * @param {string} lang language
 * @param {string|Ref<HTMLElement | undefined>} container container selector
 * @return { html: Ref<string> } html: highlight HTML string
 */
export function useSyntaxHighlighter(
  str: string,
  lang: string,
  container: string | Ref<HTMLElement | undefined>,
) {
  const html = ref('')

  if (typeof container !== 'string' && container.value) {
    codeToHtml(str, {
      lang,
      theme: 'vitesse-dark',
    })
      .then((value) => {
        html.value = value
        container.value!.innerHTML = value
      })
    return
  }

  onMounted(() => {
    codeToHtml(str, {
      lang,
      theme: 'vitesse-dark',
    })
      .then((value) => {
        html.value = value

        if (typeof container === 'string') {
          const el = document.querySelector(container)
          if (el) el.innerHTML = value
        }
      })
  })

  return {
    html,
  }
}
