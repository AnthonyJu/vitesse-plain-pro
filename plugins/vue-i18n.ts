import path from 'node:path'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'

// https://github.com/intlify/bundle-tools/tree/main/packages/unplugin-vue-i18n
export function vueI18n() {
  return VueI18n({
    runtimeOnly: true,
    compositionOnly: true,
    fullInstall: true,
    include: [path.resolve(__dirname, '../locales/**')],
  })
}
