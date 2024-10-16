<template>
  <el-container>
    <!-- 侧边栏 -->
    <el-aside
      v-if="asideMenu && !fullScreen"
      :width="menuWidth"
      class="z-10 flex-col transition-width shadow-r bg-default"
    >
      <!-- Logo -->
      <Logo />
      <!-- 侧边菜单 -->
      <Menu />
    </el-aside>

    <!-- 主体 -->
    <el-container>
      <!-- 顶部 -->
      <el-header v-if="!fullScreen" :height="headerHeight" class="z-1 bg-default p-0!">
        <!-- 顶部主体 -->
        <Header />
        <!-- 标签栏 -->
        <TagsView />
      </el-header>

      <!-- 内容 -->
      <main class="flex-1 overflow-hidden">
        <el-scrollbar ref="scrollbar" class="custom-scrollbar">
          <!-- 内容主体 -->
          <MainView :style="{ height: mainHeight }" @before-enter="handleBeforeEnter" />
          <!-- 底部 -->
          <Footer v-if="!footerFixed" />
        </el-scrollbar>
      </main>

      <!-- 底部 -->
      <Footer v-if="footerFixed" />
    </el-container>

    <!-- 关闭全屏 -->
    <closeFullscreen v-if="fullScreen" />
  </el-container>
</template>

<script setup lang='ts'>
import type { ScrollbarInstance } from 'element-plus'
import closeFullscreen from './components/close-fullscreen.vue'
import Footer from './components/layout-footer.vue'
import Header from './components/layout-header.vue'
import Logo from './components/logo.vue'
import MainView from './components/main-view.vue'
import Menu from './components/menu/index.vue'
import TagsView from './components/tags-view/index.vue'

defineOptions({ name: 'DefaultLayout' })

const themeStore = useThemeStore()
const { fullScreen, menu, footer, mainHeight, headerHeight, menuWidth } = storeToRefs(themeStore)

const asideMenu = computed(() => menu.value.aside && !menu.value.drawer)
const footerFixed = computed(() => footer.value.show && footer.value.fixed && !fullScreen.value)

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
</style>
