<template>
  <div :style="{ height: `${tagsview.height}px` }" flex-items px-15px shadow-b>tagsview</div>
</template>

<script setup lang='ts'>
const layoutStore = useLayoutStore()
const { tagsview } = storeToRefs(layoutStore)
</script>
