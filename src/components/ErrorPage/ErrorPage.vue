<template>
  <div class="full flex-center flex-wrap">
    <div class="h-full min-w-500px flex-col-center animate-head-shake">
      <div class="mb-15px text-55px text-$el-color-primary">
        {{ errorInfo.type }}
      </div>

      <div class="mb-10px text-22px text-$el-text-color-primary">
        {{ errorInfo.msg }}
      </div>

      <div class="mb-30px text-12px text-$el-text-color-secondary">
        {{ errorInfo.subMsg }}
      </div>

      <div>
        <el-button type="primary" round @click="$router.back()">
          返回上一页
        </el-button>
        <el-button
          v-if="errorInfo.type === 401"
          type="warning"
          round
          @click="userStore.handleLogout()"
        >
          重新授权
        </el-button>
      </div>
    </div>

    <div class="ml-40px animate-head-shake">
      <img class="full turn-light dark:turn-dark" :src="errorInfo.img">
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  errorInfo: {
    type: number
    msg: string
    subMsg: string
    img: string
  }
}>()

const userStore = useUserStore()
</script>
