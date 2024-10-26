<template>
  <div>
    <el-input v-model="locale" readonly style="width: 220px;" />
    <el-button
      ml-20px
      type="primary"
      :loading="loading"
      @click="changeLanguage"
    >
      {{ t('button.toggle_lang') }}
    </el-button>
  </div>
</template>

<script setup lang='ts'>
import { loadLanguageAsync } from '@/modules/i18n'

const { t, locale } = useI18n()

const loading = ref(false)

async function changeLanguage() {
  loading.value = true
  locale.value = await loadLanguageAsync(locale.value === 'zh-CN' ? 'en' : 'zh-CN')
  loading.value = false
}
</script>
