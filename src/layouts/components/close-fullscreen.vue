<template>
  <div class="close-full hover:opacity-80" @click="fullScreen = false">
    <Iconify
      class="absolute bottom-11px left-11px text-$el-color-primary"
      icon="ep-close"
      size="15px"
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
