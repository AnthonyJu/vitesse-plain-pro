<template>
  <el-container>
    <!-- 侧边栏 -->
    <el-aside v-if="asideMenu" :width="menuWidth" class="z-10 flex-col transition-width shadow-r bg-default">
      <!-- Logo -->
      <Logo />
      <!-- 侧边菜单 -->
      <Menu />
    </el-aside>

    <!-- 主体 -->
    <el-container>
      <!-- 顶部 -->
      <el-header :height="headerHeight" class="z-1 bg-default p-0!">
        <!-- 顶部主体 -->
        <Header />
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
          <Footer v-if="!footerFixed" />
        </el-scrollbar>
      </main>

      <!-- 底部 -->
      <Footer v-if="footerFixed" />
    </el-container>
  </el-container>
</template>

<script setup lang='ts'>
import type { ScrollbarInstance } from 'element-plus'
import Footer from './components/layout-footer.vue'
import Header from './components/layout-header.vue'
import Logo from './components/logo.vue'
import Menu from './components/menu/index.vue'
import TagsView from './components/tags-view.vue'

defineOptions({ name: 'DefaultLayout' })

const themeStore = useThemeStore()
const { menu, footer, mainHeight, headerHeight, menuWidth } = storeToRefs(themeStore)

const asideMenu = computed(() => menu.value.aside && !menu.value.drawer)
const footerFixed = computed(() => footer.value.show && footer.value.fixed)

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
