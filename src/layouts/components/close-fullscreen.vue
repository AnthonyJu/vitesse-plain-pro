<template>
  <div class="close-full hover:opacity-80" @click="fullScreen = false">
    <span
      title="关闭全屏"
      class="i-carbon-close absolute bottom-11px left-11px text-16px text-$el-color-primary"
    />
  </div>
</template>

<script setup lang="ts">
const themeStore = useThemeStore()
const { fullScreen } = storeToRefs(themeStore)
</script>

<style scoped lang="scss">
.close-full {
  position: fixed;
  top: -30px;
  right: -30px;
  z-index: 9999999999;
  width: 60px;
  height: 60px;
  cursor: pointer;
  background: rgb(0 0 0 / 15%);
  border-radius: 100%;
}
</style>
