<template>
  <div :style="{ height: `${tagsview.height}px` }" flex-items px-15px shadow-b>tagsview</div>
</template>

<script setup lang='ts'>
const themeStore = useThemeStore()
const { tagsview } = storeToRefs(themeStore)
</script>
