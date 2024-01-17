<template>
  <div class="login-layout relative full overflow-hidden">
    <img src="@/assets/login-bg.svg" class="absolute bottom-0 left-0 w-40% -z-1">

    <!-- 登陆框 -->
    <div class="login-box flex-col-center bg-default" :style="style">
      <h2 class="my-50px flex text-$el-color-primary">
        <img src="@/assets/logo.svg" mr-10px w-40px>
        <span>vitesse plain pro</span>
      </h2>

      <span class="login-box-line-one" />
      <span class="login-box-line-two" />

      <!-- 登陆表单 -->
      <el-form
        ref="formRef"
        class="w-full flex-1"
        :model="form"
        :rules="rules"
        :disabled="loading"
        @keydown.enter="gotoLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入账号（随便填）"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码（随便填）"
            autocomplete="new-password"
          />
        </el-form-item>
        <el-form-item>
          <el-button w-full type="primary" :loading="loading" @click="gotoLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: none
</route>

<script setup lang="ts">
defineOptions({ name: 'Login' })

// 宽度小于等于586时，居中显示登录框
const { width } = useWindowSize()
const style = computed(() => (width.value > 586 ? { right: '18%' } : { right: 0, left: 0 }))

const userStore = useUserStore()
const formRef = ref()
const loading = ref(false)
const form = reactive({ username: '', password: '' })
const rules = reactive({
  username: [{
    required: true,
    message: '请输入用户名',
    trigger: 'change',
  }],
  password: [{
    required: true,
    message: '请输入密码',
    trigger: 'change',
  }],
})

function gotoLogin() {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      userStore.handleLogin(form).finally(() => {
        loading.value = false
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.login-layout {
  &::before,
  &::after {
    position: absolute;
    z-index: -1;
    content: "";
    background: var(--el-color-primary);
    transition: all 0.3s ease;
  }

  &::before {
    bottom: 0;
    left: 0;
    width: 55%;
    height: 80%;
    -webkit-mask-box-image: url("data:image/svg+xml,%3Csvg width='1200' height='770' xmlns='http://www.w3.org/2000/svg' fill='none'%3E%3Cg%3E%3Cpath id='svg_1' d='M58.4 47.77C104.6 59.51 135.26 67.37 162.11 78.04C188.97 88.72 226.33 102.69 265.92 123.55C305.51 144.4 366.96 167.09 441.43 121.52C515.9 75.95 546.48 61.01 577.69 46.27C608.9 31.53 625.86 23.69 680.26 12.28C734.65 0.87 837.29 10.7 867.29 21.8C897.29 32.9 935.51 51.9 962.21 95.45C988.9 139.01 972.91 177.36 951.37 221.39C929.83 265.43 883.49 306 890.44 337.33C897.4 368.66 974.73 412.18 974.73 411.47C974.73 412.18 1066.36 457.62 1106.36 491.06C1146.36 524.5 1178.8 563.36 1184.03 579.63C1189.26 595.9 1200.4 622.49 1181.55 676.88C1162.71 731.26 1127.16 764.32 1115.31 778.64C1103.45 792.96 5.34 783.61 4.32 784.63C3.3 785.65 -172.34 2.38 1.13 35.04L58.4 47.77L58.4 47.77Z' fill='%23409eff'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");
  }

  &::after {
    top: 0;
    right: 0;
    width: 15%;
    height: 40%;
    -webkit-mask-box-image: url("data:image/svg+xml,%3Csvg width='150' height='300' xmlns='http://www.w3.org/2000/svg' fill='none'%3E%3Cg%3E%3Cpath id='svg_1' d='M-0.56 -0.28C41.94 36.17 67.73 18.94 93.33 33.96C118.93 48.98 107.58 73.56 101.94 89.76C96.29 105.96 50.09 217.83 47.87 231.18C45.64 244.52 46.02 255.2 64.4 270.05C82.79 284.91 121.99 292.31 111.98 289.81C101.97 287.32 153.96 301.48 151.83 299.9C149.69 298.32 149.98 -1.36 149.71 -1.18C149.98 -1.36 -43.06 -36.74 -0.56 -0.28L-0.56 -0.28Z' fill='%23409eff'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");
  }
}

.login-box {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 375px;
  height: 350px;
  padding: 0 30px;
  margin: auto;
  overflow: hidden;
  border: 4px solid var(--el-color-primary-light-3);
  border-radius: 3px;
}

.login-box-line-one,
.login-box-line-two {
  position: absolute;
  display: block;
  width: inherit;
  height: inherit;

  &::before,
  &::after {
    position: absolute;
    content: "";
  }
}

.login-box-line-one {
  &::before {
    top: 4px;
    left: 4px;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--el-color-primary));
    filter: hue-rotate(0deg);
    animation: login-left 3s linear infinite;
  }

  &::after {
    top: -100%;
    right: 4px;
    width: 3px;
    height: 100%;
    background: linear-gradient(180deg, transparent, var(--el-color-primary));
    filter: hue-rotate(60deg);
    animation: login-top 3s linear infinite;
    animation-delay: 0.7s;
  }
}

.login-box-line-two {
  &::before {
    right: -100%;
    bottom: 4px;
    width: 100%;
    height: 3px;
    background: linear-gradient(270deg, transparent, var(--el-color-primary));
    filter: hue-rotate(120deg);
    animation: login-right 3s linear infinite;
    animation-delay: 1.4s;
  }

  &::after {
    bottom: -100%;
    left: 4px;
    width: 3px;
    height: 100%;
    background: linear-gradient(360deg, transparent, var(--el-color-primary));
    filter: hue-rotate(300deg);
    animation: login-bottom 3s linear infinite;
    animation-delay: 2.1s;
  }
}

@keyframes login-left {
  0% {
    left: -100%;
  }

  50%,
  100% {
    left: 100%;
  }
}

@keyframes login-top {
  0% {
    top: -100%;
  }

  50%,
  100% {
    top: 100%;
  }
}

@keyframes login-right {
  0% {
    right: -100%;
  }

  50%,
  100% {
    right: 100%;
  }
}

@keyframes login-bottom {
  0% {
    bottom: -100%;
  }

  50%,
  100% {
    bottom: 100%;
  }
}
</style>
