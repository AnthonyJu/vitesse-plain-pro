<template>
  <div class="flex-bc px-15px" :style="{ height: `${header.height}px` }">
    <!-- Logo -->
    <Logo v-if="drawerMenu" />
    <!-- 面包屑 -->
    <Breadcrumb v-else />
    <!-- 用户操作 -->
    <UserOperate />
  </div>
</template>

<script setup lang='ts'>
import Breadcrumb from './breadcrumb.vue'
import Logo from './logo.vue'
import UserOperate from './user-operate.vue'

const themeStore = useThemeStore()
const { menu, header } = storeToRefs(themeStore)
const drawerMenu = computed(() => !menu.value.aside || menu.value.drawer)
</script>
