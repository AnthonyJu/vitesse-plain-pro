<template>
  <div>
    <el-input v-model="locale" readonly style="width: 220px;" />
    <el-button
      ml-20px
      type="primary"
      :loading="loading"
      @click="changeLanguage"
    >
      {{ t('button.toggle_langs') }}
    </el-button>
  </div>
</template>

<route lang='yaml'>
meta:
  name: i18n
</route>

<script setup lang='ts'>
import { loadLanguageAsync } from '@/modules/i18n'

const { t, locale } = useI18n()

const loading = ref(false)

async function changeLanguage() {
  loading.value = true
  const newLocale = await loadLanguageAsync(locale.value === 'zh-CN' ? 'en' : 'zh-CN')
  locale.value = newLocale
  loading.value = false
}
</script>
