<template>
  <el-scrollbar flex-1>
    <el-menu
      :default-active="route.path"
      router
      unique-opened
      collapse-transition
      :collapse="menu.collapse" width
      :mode="menu.aside ? 'vertical' : 'horizontal'"
    >
      <!-- TODO width 首次进入 mode 变更 -->
      <template v-for="item in menuStore.menus">
        <el-sub-menu v-if="item.children?.length" :key="item.path" :index="item.path">
          <template #title>
            <Iconify v-if="item.meta?.icon" mr-8px h-16px w-16px :icon="item.meta?.icon" />
            <span>{{ item.meta?.title }}</span>
          </template>
          <SubMenu :children="item.children" />
        </el-sub-menu>

        <el-menu-item v-else :key="item.path!" :index="item.path">
          <Iconify v-if="item.meta?.icon" mr-8px h-16px w-16px :icon="item.meta?.icon" />
          <span>{{ item.meta?.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
import SubMenu from './SubMenu.vue'

const route = useRoute()
const menuStore = useMenuStore()
const themeStore = useThemeStore()
const { menu } = storeToRefs(themeStore)
</script>

<style lang="scss" scoped>
.el-menu {
  --el-menu-item-height: 52px;

  border: none;

  ::v-deep(.el-sub-menu.is-active:not(.is-opened)) {
    .el-sub-menu__title {
      color: var(--el-color-primary);
      background: var(--el-color-primary-light-9);
    }
  }

  ::v-deep(.el-menu-item),
  ::v-deep(.el-sub-menu__name),
  ::v-deep(.el-sub-menu__title) {
    margin: 5px 10px;
    border-radius: 4px;

    &.is-active {
      background: var(--el-color-primary-light-9);
    }
  }

  &.el-menu--horizontal {
    ::v-deep(.el-menu-item),
    ::v-deep(.el-sub-menu__name),
    ::v-deep(.el-sub-menu__title) {
      margin: 0;
      border-radius: 0;

      &.is-active {
        background: none;
      }
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

    &.el-menu--horizontal {
      ::v-deep(.el-menu-item),
      ::v-deep(.el-sub-menu__name),
      ::v-deep(.el-sub-menu__title) {
        &.is-active {
          background: none;
        }
      }
    }
  }
}
</style>
