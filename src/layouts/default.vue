<template>
  <!-- Blog 中演示用 -->
  <router-view v-if="$route.query.demo" />

  <!-- 正式layout -->
  <div
    v-else
    class="flex flex-1 bg-$el-color-primary py-16px pl-16px dark:bg-transparent"
    overflow="hidden"
  >
    <!-- 侧边栏 -->
    <el-aside
      v-show="!isSmallScreen"
      class="flex-col rounded-10px !w-210px !overflow-hidden bg-default"
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
        <router-view v-slot="{ Component, route }">
          <el-scrollbar
            ref="scrollbar"
            class="custom-scrollbar"
            :class="{ 'full-content': route.meta.fullContent }"
          >
            <transition mode="out-in" name="opacity" @before-enter="handleBeforeEnter">
              <component :is="Component" />
            </transition>
          </el-scrollbar>
        </router-view>
      </main>
    </el-container>
  </div>
</template>

<script setup lang='ts'>
import type { ScrollbarInstance } from 'element-plus'
import Logo from './components/Logo.vue'
import Menu from './components/Menu.vue'
import User from './components/User.vue'

const scrollbar = ref<ScrollbarInstance>()

function handleBeforeEnter() {
  nextTick(() => {
    scrollbar.value?.update()
    scrollbar.value?.scrollTo({ top: 0 })
  })
}
</script>

<style lang='scss' scoped>
.custom-scrollbar {
  ::v-deep(.el-scrollbar__wrap) {
    @apply bg-default p-16px min-h-full;
  }

  ::v-deep(.el-scrollbar__bar.is-vertical) {
    @apply fixed top-95px right-4.5px;
  }

  &.full-content {
    ::v-deep(.el-scrollbar__view) {
      height: 100%;
    }
  }
}

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
