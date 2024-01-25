import { codeToHtml } from 'shikiji'

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
