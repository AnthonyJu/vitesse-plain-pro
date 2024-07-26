<template>
  <div full flex-center flex-wrap>
    <div h-full min-w-500px flex-col-center>
      <div
        class="text-$el-color-primary"
        mb-15px animate-head-shake text-55px
      >
        401
      </div>

      <div
        class="text-$el-text-color-primary"
        mb-10px animate-head-shake text-22px
      >
        权限不足，或授权已过期~
      </div>

      <div
        class="text-$el-text-color-secondary"
        mb-30px animate-head-shake text-12px
      >
        您可以先检查用户重新授权或给管理员反馈问题。
      </div>

      <div animate-head-shake>
        <el-button
          type="warning"
          round
          @click="userStore.handleLogout()"
        >
          重新授权
        </el-button>
      </div>
    </div>

    <div ml-40px animate-head-shake>
      <img class="full turn-light dark:turn-dark" src="@/assets/401.png">
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: none
</route>

<script setup lang="ts">
const userStore = useUserStore()
</script>
