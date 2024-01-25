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
import zhCn from 'element-plus/es/locale/lang/zh-cn'

if (import.meta.env.DEV) useMenuStore().getMenu()
</script>
