import { createI18n } from 'vue-i18n'

import type { App } from 'vue'
import type { Locale } from 'vue-i18n'

// https://vitejs.dev/guide/features.html#glob-import
const i18n = createI18n({
  legacy: false,
  locale: '',
  messages: {},
})

const localesMap = Object.fromEntries(
  Object.entries(import.meta.glob('../../locales/*.yml'))
    .map(([path, loadLocale]) => {
      return [path.match(/([\w-]*)\.yml$/)?.[1], loadLocale]
    }),
) as Record<Locale, () => Promise<{ default: Record<string, string> }>>

const loadedLanguages: string[] = []

function setI18nLanguage(lang: Locale) {
  i18n.global.locale.value = lang as any
  if (typeof document !== 'undefined')
    document.querySelector('html')?.setAttribute('lang', lang)
  return lang
}

export const availableLocales = Object.keys(localesMap)

export async function loadLanguageAsync(lang: string): Promise<Locale> {
  if (i18n.global.locale.value === lang)
    return setI18nLanguage(lang)

  if (loadedLanguages.includes(lang))
    return setI18nLanguage(lang)

  const messages = await localesMap[lang]()
  i18n.global.setLocaleMessage(lang, messages.default)
  loadedLanguages.push(lang)
  return setI18nLanguage(lang)
}

export default (app: App) => {
  app.use(i18n)
  loadLanguageAsync('zh-CN')
}
