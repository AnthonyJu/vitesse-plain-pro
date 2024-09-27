<template>
  <ErrorPage :error-info="errorInfo" />
</template>

<route lang="yaml">
meta:
  layout: none
</route>

<script setup lang="ts">
import img_401 from '@/assets/401.png'

const errorInfo = {
  type: 401,
  msg: '权限不足，或授权已过期~',
  subMsg: '您可以检查当前用户重新授权或给管理员进行反馈。',
  img: img_401,
}
</script>
