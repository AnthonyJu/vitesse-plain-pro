<template>
  <RouterView v-if="route.query.demo" />

  <div
    v-else
    class="flex flex-1 bg-$el-color-primary dark:bg-transparent"
    p="l16px y16px"
    overflow-auto
  >
    <!-- 侧边栏 -->
    <el-aside
      v-show="!smallScreen"
      class="flex-col-center overflow-hidden rounded-10px !w-210px bg-default"
    >
      <Logo />
      <Menu />
    </el-aside>

    <el-container :class="{ 'ml-16px': !smallScreen }">
      <!-- 头部 -->
      <el-header mr-16px flex-b-c rounded-10px pl-16px pr-0 bg-default>
        <Logo v-if="smallScreen" />
        <div v-else />
        <User />
      </el-header>

      <!-- 主体 -->
      <div mr-16px mt-16px flex-1 overflow-hidden rounded-10px>
        <el-scrollbar class="custom-scrollbar">
          <router-view v-slot="{ Component }">
            <transition name="opacity" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-scrollbar>
      </div>
    </el-container>
  </div>
</template>

<script setup lang='ts'>
import Logo from './components/Logo.vue'
import Menu from './components/Menu.vue'
import User from './components/User.vue'

const { width } = useWindowSize()
const smallScreen = computed(() => width.value <= 1000)

const route = useRoute()
</script>

<style lang='scss' scoped>
.custom-scrollbar {
  ::v-deep(.el-scrollbar__bar.is-vertical) {
    position: fixed;
    top: 95px;
    right: 5px;
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
