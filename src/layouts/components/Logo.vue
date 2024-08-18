<template>
  <div
    class="h-60px flex-center animate-bounce-in cursor-default"
    :class="{ 'cursor-pointer': menu.drawer, 'w-full shadow-b': menu.aside && !menu.drawer }"
    @click="showDrawer = true"
  >
    <img class="w-25px" src="@/assets/logo.svg">
    <span class="ml-8px text-20px text-$el-color-primary">
      vitesse plain pro
    </span>
  </div>

  <el-drawer
    v-if="menu.drawer"
    v-model="showDrawer"
    class="menu-drawer"
    direction="ltr"
    size="220px"
    :with-header="false"
  >
    <Menu />
  </el-drawer>

  <Menu v-else-if="!menu.aside" pl-15px />
</template>

<script setup lang="ts">
import Menu from './Menu.vue'

const themeStore = useThemeStore()
const { menu } = storeToRefs(themeStore)

const showDrawer = ref(false)
</script>

<style lang="scss" scoped>
.menu-drawer {
  .dark & {
    background: var(--el-layout-bg-color-dark);
  }

  .el-drawer__body {
    padding: 10px 0;
  }
}
</style>
