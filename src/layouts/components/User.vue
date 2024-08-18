<template>
  <el-space :size="10" spacer="|">
    <!-- GitHub -->
    <a
      class="pt-3px text-dark dark:text-light"
      target="_blank"
      href="https://github.com/AnthonyJu/vitesse-plain"
      title="GitHub"
    >
      <Iconify :width="24" icon="carbon:logo-github" />
    </a>

    <!-- 切换主题 -->
    <el-switch
      v-model="isDark"
      size="large"
      class="custom-switch"
      inline-prompt
      :active-icon="Dark"
      :inactive-icon="Light"
    />

    <!-- 用户头像 -->
    <el-dropdown v-if="userStore.userInfo">
      <el-avatar
        class="cursor-pointer !bg-$el-color-primary"
        :src="userStore.userInfo?.avatar || avatar"
      />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="router.push('/personal')">
            个人信息
          </el-dropdown-item>
          <el-dropdown-item @click="exitLogin">
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-avatar
      v-else
      class="cursor-pointer !bg-$el-color-primary"
      @click="router.push('/login')"
    >
      登录
    </el-avatar>
  </el-space>
</template>

<script setup lang='ts'>
import avatar from '@/assets/avatar.png'

const isDark = useDark()
watch(isDark, (val) => {
  Session.set('theme', val)
})

const router = useRouter()
const userStore = useUserStore()
function exitLogin() {
  ElMessageBox({
    title: '退出登陆',
    message: '此操作将退出登录, 是否继续?',
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    showCancelButton: true,
    lockScroll: false,
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = '退出中...'
        userStore.handleLogout()
          .then(() => done())
          .catch(() => {
            done()
            ElMessage.error('退出登录失败')
          })
      }
      else { done() }
    },
  })
}

// 定义Light图标组件
const Light = h('svg', { viewBox: '0 0 24 24' }, [
  h('path', {
    d: 'M6.05 4.14l-.39-.39a.993.993 0 0 0-1.4 0l-.01.01a.984.984 0 0 0 0 1.4l.39.39c.39.39 1.01.39 1.4 0l.01-.01a.984.984 0 0 0 0-1.4zM3.01 10.5H1.99c-.55 0-.99.44-.99.99v.01c0 .55.44.99.99.99H3c.56.01 1-.43 1-.98v-.01c0-.56-.44-1-.99-1zm9-9.95H12c-.56 0-1 .44-1 .99v.96c0 .55.44.99.99.99H12c.56.01 1-.43 1-.98v-.97c0-.55-.44-.99-.99-.99zm7.74 3.21c-.39-.39-1.02-.39-1.41-.01l-.39.39a.984.984 0 0 0 0 1.4l.01.01c.39.39 1.02.39 1.4 0l.39-.39a.984.984 0 0 0 0-1.4zm-1.81 15.1l.39.39a.996.996 0 1 0 1.41-1.41l-.39-.39a.993.993 0 0 0-1.4 0c-.4.4-.4 1.02-.01 1.41zM20 11.49v.01c0 .55.44.99.99.99H22c.55 0 .99-.44.99-.99v-.01c0-.55-.44-.99-.99-.99h-1.01c-.55 0-.99.44-.99.99zM12 5.5c-3.31 0-6 2.69-6 6s2.69 6 6 6s6-2.69 6-6s-2.69-6-6-6zm-.01 16.95H12c.55 0 .99-.44.99-.99v-.96c0-.55-.44-.99-.99-.99h-.01c-.55 0-.99.44-.99.99v.96c0 .55.44.99.99.99zm-7.74-3.21c.39.39 1.02.39 1.41 0l.39-.39a.993.993 0 0 0 0-1.4l-.01-.01a.996.996 0 0 0-1.41 0l-.39.39c-.38.4-.38 1.02.01 1.41z',
  }),
])

// 定义Dark图标组件
const Dark = h('svg', { viewBox: '0 0 24 24' }, [
  h('path', {
    d: 'M11.01 3.05C6.51 3.54 3 7.36 3 12a9 9 0 0 0 9 9c4.63 0 8.45-3.5 8.95-8c.09-.79-.78-1.42-1.54-.95A5.403 5.403 0 0 1 11.1 7.5c0-1.06.31-2.06.84-2.89c.45-.67-.04-1.63-.93-1.56z',
  }),
])
</script>

<style lang='scss' scoped>
::v-deep(.custom-switch) {
  --el-switch-off-color: var(--el-color-primary);
  --el-switch-on-color: var(--el-html-color-dark);

  &.is-checked {
    .el-switch__core {
      background-color: var(--el-color-primary);
      border: none;
    }
  }

  .el-switch__core .el-switch__inner {
    z-index: 1;
    padding: 0 26px 0 0;

    .el-icon {
      font-size: 16px;
      color: var(--el-color-primary);
    }
  }

  &.is-checked .el-switch__core .el-switch__inner {
    z-index: 1;
    padding: 0 0 0 26px;

    .el-icon {
      color: var(--el-color-black);
    }
  }
}

::v-deep(.el-space__item) {
  &:last-child {
    margin-right: 0 !important;
  }
}
</style>
