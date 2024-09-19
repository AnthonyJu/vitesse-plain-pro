<template>
  <template v-for="menu in children" :key="menu.path">
    <el-sub-menu v-if="menu.children?.length" :index="menu.path">
      <template #title>
        <MenuTitle :title="menu.meta?.title" :icon="menu.meta?.icon" />
      </template>
      <SubMenu :children="menu.children" />
    </el-sub-menu>

    <el-menu-item v-else :key="menu.path!" :index="menu.path">
      <MenuTitle :title="menu.meta?.title" :icon="menu.meta?.icon" />
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import type { RouteItem } from '@/router/routes'
import MenuTitle from './MenuTitle.vue'

defineProps<{ children: RouteItem[] }>()
</script>
