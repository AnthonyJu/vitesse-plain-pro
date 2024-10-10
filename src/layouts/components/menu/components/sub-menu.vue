<template>
  <template v-for="menu in children" :key="menu.path">
    <el-sub-menu v-if="menu.children && !menu.meta.isLeaf" :index="menu.path">
      <template #title>
        <MenuTitle :title="menu.meta?.title" :icon="menu.meta?.icon" />
      </template>
      <SubMenu :children="menu.children" />
    </el-sub-menu>

    <el-menu-item v-else-if="!menu.meta.isHide" :index="menu.path">
      <MenuTitle :title="menu.meta?.title" :icon="menu.meta?.icon" />
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import MenuTitle from './menu-title.vue'

defineProps<{ children: RouteItem[] }>()
</script>
