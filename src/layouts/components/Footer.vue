<template>
  <div :style="{ height: `${footer.height}px` }" flex-center>footer</div>
</template>

<script setup lang='ts'>
const layoutStore = useLayoutStore()
const { footer } = storeToRefs(layoutStore)
</script>
