<template>
  <div full flex-center flex-wrap>
    <div h-full min-w-500px flex-col-center>
      <div
        class="text-$el-color-primary"
        mb-15px animate-head-shake text-56px
      >
        404
      </div>

      <div
        class="text-$el-text-color-primary"
        mb-10px animate-head-shake text-22px
      >
        地址输入错误，请重新输入地址~
      </div>

      <div
        class="text-$el-text-color-secondary"
        mb-30px animate-head-shake text-12px
      >
        您可以先检查网址，然后重新输入或给管理员反馈问题。
      </div>

      <div animate-head-shake>
        <el-button
          type="primary"
          round
          @click="router.replace('/')"
        >
          返回首页
        </el-button>
      </div>
    </div>

    <div ml-40px animate-head-shake>
      <img class="full turn-light dark:turn-dark" src="@/assets/404.png">
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: none
</route>

<script setup lang="ts">
const router = useRouter()
</script>
