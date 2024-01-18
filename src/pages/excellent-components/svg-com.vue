<template>
  <div class="main-container">
    Svg-icon
    <SvgIcon :name="Pinia" color="#09f" :size="30" />
    <SvgIcon name="ele-Plus" color="#09f" :size="30" />
  </div>
</template>

<route lang="yaml">
  meta:
    name: Svg-icon
</route>

<script setup lang='ts'>
import Pinia from '@/assets/pinia.svg'
</script>
