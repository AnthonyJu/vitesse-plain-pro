<template>
  <!-- Blog 中演示用 -->
  <router-view v-if="$route.query.demo" />

  <!-- 正式layout -->
  <el-container v-else>
    <!-- 侧边栏 -->
    <el-aside v-show="!isSmallScreen" class="flex-col bd-r !w-240px bg-default">
      <Logo />
      <Menu />
    </el-aside>

    <!-- 主体 -->
    <el-container>
      <!-- 顶部 -->
      <el-header class="h-auto! bg-default p-0!">
        <!-- 顶部主体 -->
        <div class="h-60px flex-bc px-16px bd-b">
          <!-- 横屏或小屏 -->
          <template v-if="isSmallScreen">
            <Logo />
            <Menu />
          </template>

          <!-- 面包屑 -->
          <Breadcrumb v-else />

          <!-- 用户操作 -->
          <User />
        </div>

        <!-- 标签栏 -->
        <TagsView />
      </el-header>

      <!-- 内容 -->
      <main class="flex-1 overflow-hidden">
        <el-scrollbar ref="scrollbar" class="custom-scrollbar">
          <div class="h-[calc(100vh-120px)] w-full flex-col p-16px">
            <router-view v-slot="{ Component }">
              <transition mode="out-in" name="opacity">
                <component :is="Component" />
              </transition>
            </router-view>
          </div>
        </el-scrollbar>
      </main>

      <!-- 底部 -->
      <Footer />
    </el-container>
  </el-container>
</template>

<script setup lang='ts'>
import type { ScrollbarInstance } from 'element-plus'
import Logo from './components/Logo.vue'
import Menu from './components/Menu.vue'
import User from './components/User.vue'
import Breadcrumb from './components/Breadcrumb.vue'
import Footer from './components/Footer.vue'
import TagsView from './components/TagsView.vue'

const scrollbar = ref<ScrollbarInstance>()

// function handleBeforeEnter() {
//   nextTick(() => {
//     scrollbar.value?.update()
//     scrollbar.value?.scrollTo({ top: 0 })
//   })
// }
</script>

<style lang='scss' scoped>
// .custom-scrollbar {
//   & > ::v-deep(.el-scrollbar__wrap) {
//     @apply min-h-full;
//   }
// }

.opacity-enter-active,
.opacity-leave-active {
  transition: all 0.3s ease;
  will-change: transform;
}

.opacity-enter-from,
.opacity-leave-to {
  opacity: 0;
}
</style>
