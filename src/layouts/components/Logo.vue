<template>
  <div
    class="h-60px flex-center animate-bounce-in cursor-default"
    :class="width > 1000 ? 'custom-class' : 'cursor-pointer'"
    @click="openDrawer"
  >
    <img class="w-26px" src="@/assets/logo.svg">
    <span class="ml-8px text-20px text-$el-color-primary">
      vitesse plain pro
    </span>
  </div>

  <el-drawer
    v-model="drawer"
    class="menu-drawer"
    direction="ltr"
    size="220px"
    :with-header="false"
  >
    <Menu />
  </el-drawer>
</template>

<script setup lang="ts">
import Menu from './Menu.vue'

const { width } = useWindowSize()

const drawer = ref(false)
function openDrawer() {
  if (width.value <= 1000) drawer.value = true
}
</script>

<style lang="scss" socoped>
.custom-class {
  width: 100%;
  border-bottom: 2px solid var(--el-color-primary-light-3);
}

.menu-drawer {
  .dark & {
    background: var(--el-layout-bg-color-dark);
  }

  .el-drawer__body {
    padding: 0;
  }
}
</style>
