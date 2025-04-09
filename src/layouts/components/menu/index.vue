<template>
  <el-scrollbar flex-1 px-10px>
    <el-menu
      :default-active="route.path"
      router
      unique-opened
      :collapse-transition="false"
      :collapse="themeStore.menu.collapse"
      :mode="themeStore.menu.aside ? 'vertical' : 'horizontal'"
    >
      <template v-for="menu in menuStore.menus" :key="menu.path">
        <el-sub-menu
          v-if="menu.children && !menu.meta.isLeaf"
          :key="`v-if_${menu.path}`"
          :index="menu.path"
        >
          <template #title>
            <MenuTitle :title="menu.meta?.title" :icon="menu.meta?.icon" />
          </template>
          <SubMenu :children="menu.children" />
        </el-sub-menu>

        <el-menu-item
          v-else-if="!menu.meta.isHide"
          :key="`v-else-if_${menu.path}`"
          :index="menu.path"
        >
          <MenuTitle :title="menu.meta?.title" :icon="menu.meta?.icon" />
        </el-menu-item>
      </template>
    </el-menu>
  </el-scrollbar>
</template>

<script setup lang="ts">
import MenuTitle from './components/menu-title.vue'
import SubMenu from './components/sub-menu.vue'

const route = useRoute()
const menuStore = useMenuStore()
const themeStore = useThemeStore()
</script>

<style lang="scss" scoped>
.el-menu {
  --el-menu-item-height: 48px;

  border: none;

  ::v-deep(.el-sub-menu.is-active:not(.is-opened)) {
    .el-sub-menu__title {
      color: var(--el-color-primary);
      background: var(--el-color-primary-light-7);
    }
  }

  ::v-deep(.el-menu-item),
  ::v-deep(.el-sub-menu__name),
  ::v-deep(.el-sub-menu__title) {
    margin: 5px 0;
    border-radius: var(--el-border-radius-base);

    &.is-active {
      background: var(--el-color-primary-light-7);
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

  ::v-deep(.el-sub-menu__hide-arrow) {
    .el-sub-menu__title {
      padding: 0 30px;
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

    ::v-deep(.el-sub-menu.is-active:not(.is-opened)) {
      .el-sub-menu__title {
        color: var(--el-color-primary);
        background: var(--el-color-primary-light-7);
      }
    }
  }
}
</style>
