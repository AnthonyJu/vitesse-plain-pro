<template>
  <!-- Blog 中演示用 -->
  <router-view v-if="$route.query.demo" />

  <!-- 正式layout -->
  <el-container v-else>
    <!-- 侧边栏 -->
    <el-aside v-if="menu.aside && !menu.drawer" class="z-10 flex-col shadow-r !w-230px bg-default">
      <Logo />
      <Menu />
    </el-aside>

    <!-- 主体 -->
    <el-container>
      <!-- 顶部 -->
      <el-header class="z-1 h-auto! bg-default p-0!">
        <!-- 顶部主体 -->
        <div class="h-60px flex-bc px-15px shadow-b">
          <!-- 小屏Logo -->
          <Logo v-if="!menu.aside || menu.drawer" />
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
          <!-- 内容主体 -->
          <div class="w-full flex-col p-15px pb-0" :style="{ height: mainHeight }">
            <router-view v-slot="{ Component }">
              <transition mode="out-in" name="opacity" @before-enter="handleBeforeEnter">
                <component :is="Component" />
              </transition>
            </router-view>
          </div>
          <!-- 底部 -->
          <Footer v-if="footer.show && !footer.fixed" />
        </el-scrollbar>
      </main>

      <!-- 底部 -->
      <Footer v-if="footer.show && footer.fixed" />
    </el-container>
  </el-container>
</template>

<script setup lang='ts'>
import type { ScrollbarInstance } from 'element-plus'
import Breadcrumb from './components/Breadcrumb.vue'
import Footer from './components/Footer.vue'
import Logo from './components/Logo.vue'
import Menu from './components/Menu/index.vue'
import TagsView from './components/TagsView.vue'
import User from './components/User.vue'

defineOptions({ name: 'DefaultLayout' })

const themeStore = useThemeStore()
const { menu, footer, mainHeight } = storeToRefs(themeStore)

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
  & > ::v-deep(.el-scrollbar__bar.is-vertical) {
    top: 6px;
    right: 4px;
  }
}

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
