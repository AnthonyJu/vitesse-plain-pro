<template>
  <div class="loading-next flex-center">
    <div class="loading-next-box-warp">
      <div
        v-for="i in 9"
        :key="`loading_${i}`"
        class="loading-next-box-item"
      />
    </div>
  </div>
</template>

<route lang='yaml'>
meta:
  layout: none
</route>

<script setup lang='ts'>
const commonStore = useCommonStore()
commonStore.loadCommonData()
</script>

<style lang='scss' scoped>
.loading-next .loading-next-box-warp {
  width: 90px;
  height: 90px;
}

.loading-next .loading-next-box-warp .loading-next-box-item {
  float: left;
  width: 30px;
  height: 30px;
  background: var(--el-color-primary);
  border-radius: 1px;
  animation: loading-next-animation 1.3s infinite ease;
}

.loading-next .loading-next-box-warp .loading-next-box-item:nth-child(7) {
  animation-delay: 0s;
}

.loading-next .loading-next-box-warp .loading-next-box-item:nth-child(4),
.loading-next .loading-next-box-warp .loading-next-box-item:nth-child(8) {
  animation-delay: 0.1s;
}

.loading-next .loading-next-box-warp .loading-next-box-item:nth-child(1),
.loading-next .loading-next-box-warp .loading-next-box-item:nth-child(5),
.loading-next .loading-next-box-warp .loading-next-box-item:nth-child(9) {
  animation-delay: 0.2s;
}

.loading-next .loading-next-box-warp .loading-next-box-item:nth-child(2),
.loading-next .loading-next-box-warp .loading-next-box-item:nth-child(6) {
  animation-delay: 0.3s;
}

.loading-next .loading-next-box-warp .loading-next-box-item:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes loading-next-animation {
  0%,
  70%,
  100% {
    transform: scale3d(1, 1, 1);
  }

  35% {
    transform: scale3d(0, 0, 1);
  }
}
</style>
