<template>
  <div v-if="showPermission" class="loading-next flex-center pb-100px">
    <!-- loading -->
    <div v-if="commonDataStore.loading" class="loading-next-box-warp">
      <div v-for="i in 9" :key="`loading_${i}`" class="loading-next-box-item" />
    </div>

    <!-- fail -->
    <div
      v-if="commonDataStore.isFail"
      class="min-w-500px flex-col-center animate-head-shake gap-10px"
    >
      <div class="text-55px text-$el-color-danger">
        <Iconify icon="ep-warning-filled" />
      </div>
      <div class="text-22px text-$el-text-color-primary">
        部分数据加载失败
      </div>
      <div class="text-13px text-$el-text-color-secondary">
        请检查您的网络连接，或给管理员进行反馈，也可进入系统后再次刷新
      </div>
      <div mt-30px>
        <el-button type="success" round @click="commonDataStore.loadCommonData()">
          刷新重试
        </el-button>
        <el-button type="warning" round @click="commonDataStore.enterSystem()">
          进入系统
        </el-button>
      </div>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang='ts'>
const commonDataStore = useCommonDataStore()
const showPermission = computed(() => commonDataStore.loading || commonDataStore.isFail)
</script>

<style scoped lang='scss'>
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
