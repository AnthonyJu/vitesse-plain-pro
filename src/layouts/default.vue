<template>
  <!-- Blog 中演示用 -->
  <router-view v-if="$route.query.demo" />

  <!-- 正式layout -->
  <el-container v-else>
    <!-- 侧边栏 -->
    <el-aside v-show="!isSmallScreen" class="flex-col !w-220px" border="red solid r-1 t-0 l-0 b-0">
      <Logo />
      <Menu />
    </el-aside>

    <!-- 主体 -->
    <el-container>
      <!-- 头部 -->
      <el-header class="h-auto! p-0!">
        <!--  -->
        <div class="h-60px flex-b-c px-16px" border="red solid  b-1 t-0 l-0 r-0">
          <template v-if="isSmallScreen">
            <Logo />
            <Menu />
          </template>

          <!-- 面包屑 -->
          <Breadcrumb v-else />

          <!-- 拥护操作 -->
          <User />
        </div>

        <!--  -->
        <TagsView border="red solid b-1 t-0 l-0 r-0" />
      </el-header>

      <!-- 内容 -->
      <main flex-1 overflow-hidden>
        <el-scrollbar ref="scrollbar" class="custom-scrollbar">
          <router-view v-slot="{ Component }">
            <transition mode="out-in" name="opacity">
              <component :is="Component" />
            </transition>
          </router-view>
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
