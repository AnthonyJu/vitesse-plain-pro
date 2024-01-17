<template>
  <!-- Blog 中演示用 -->
  <RouterView v-if="$route.query.demo" />

  <!-- 正式layout -->
  <div
    v-else
    class="flex flex-1 bg-$el-color-primary dark:bg-transparent"
    p="l-16px y-16px"
    overflow-auto
  >
    <!-- 侧边栏 -->
    <el-aside
      v-show="!isSmallScreen"
      class="flex-col-center overflow-hidden rounded-10px !w-210px bg-default"
    >
      <Logo />
      <Menu mt-10px />
    </el-aside>

    <!-- 主体 -->
    <el-container :class="isSmallScreen ? '' : 'ml-16px'">
      <!-- 头部 -->
      <el-header mr-16px flex-b-c rounded-10px pl-16px pr-0 bg-default>
        <Logo v-if="isSmallScreen" />
        <div v-else />
        <User />
      </el-header>

      <!-- 内容 -->
      <main mr-16px mt-16px flex-1 overflow-hidden rounded-10px>
        <Scrollbar>
          <router-view v-slot="{ Component }">
            <transition name="opacity" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </Scrollbar>
      </main>
    </el-container>
  </div>
</template>

<script setup lang='ts'>
import Logo from './components/Logo.vue'
import Menu from './components/Menu.vue'
import User from './components/User.vue'
</script>

<style lang='scss' scoped>
.opacity-enter-active,
.opacity-leave-active {
  will-change: transform;
  transition: all 0.3s ease;
}

.opacity-enter-from,
.opacity-leave-to {
  opacity: 0;
}
</style>
