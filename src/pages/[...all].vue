<template>
  <ErrorPage :error-info="errorInfo" />
</template>

<script setup lang="ts">
import img_404 from '@/assets/404.png'

const errorInfo = {
  type: 404,
  msg: '网址输入错误，请重新输入网址~',
  subMsg: '您可以先检查网址，然后重新输入或给管理员反馈。',
  img: img_404,
}
</script>
