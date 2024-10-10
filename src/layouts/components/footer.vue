<template>
  <div :style="{ height: `${footer.height}px` }" class="flex-center text-12px">
    <span>Vitesse plain pro，Made with</span>
    <span class="heartbeat mx-7px inline-block">❤️</span>
    <span>by AnthonyJu</span>
  </div>
</template>

<script setup lang='ts'>
const themeStore = useThemeStore()
const { footer } = storeToRefs(themeStore)
</script>

<style lang="scss" scoped>
.heartbeat {
  animation: heartbeat 1.5s infinite ease;
}

@keyframes heartbeat {
  0% {
    transform: scale(0.8);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(0.8);
  }
}
</style>
