<template>
  <el-config-provider
    size="default"
    :locale="zhCn"
    :button="{ autoInsertSpace: true }"
    :message="{ max: 3 }"
  >
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

ElNotification({
  title: '提示',
  message: '网站换代中，内部样式可能会有所变化',
  type: 'warning',
})

if (import.meta.env.DEV) useMenuStore().getMenu()
</script>
