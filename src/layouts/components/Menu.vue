<template>
  <el-scrollbar flex-1>
    <el-menu
      :default-active="route.path"
      router
      unique-opened
      collapse-transition
    >
      <template v-for="menu in menuStore.menus">
        <el-sub-menu v-if="menu.children?.length" :key="menu.path" :index="menu.path">
          <template #title>
            <Iconify v-if="menu.meta?.icon" mr-8px h-16px w-16px :icon="menu.meta?.icon" />
            <span>{{ menu.meta?.name }}</span>
          </template>
          <SubMenu :children="menu.children" />
        </el-sub-menu>

        <el-menu-item v-else :key="menu.path!" :index="menu.path">
          <Iconify v-if="menu.meta?.icon" mr-8px h-16px w-16px :icon="menu.meta?.icon" />
          <span>{{ menu.meta?.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
import SubMenu from './SubMenu.vue'

const route = useRoute()
const menuStore = useMenuStore()
</script>

<style lang="scss" scoped>
.el-menu {
  --el-menu-item-height: 52px;

  border: none;

  ::v-deep(.el-menu-item),
  ::v-deep(.el-sub-menu__name),
  ::v-deep(.el-sub-menu__title) {
    margin: 4px 10px;
    border-radius: 4px;

    &.is-active {
      background: var(--el-color-primary-light-9);
    }
  }
}

.el-sub-menu ::v-deep(.el-menu) {
  overflow: hidden;
}

.dark {
  .el-menu {
    ::v-deep(.el-menu-item),
    ::v-deep(.el-sub-menu__name),
    ::v-deep(.el-sub-menu__title) {
      &.is-active {
        background: var(--el-color-primary-light-7);
      }
    }
  }
}
</style>
