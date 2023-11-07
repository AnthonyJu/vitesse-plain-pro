<template>
  <template v-for="menu in children" :key="menu.path">
    <el-sub-menu v-if="menu.children?.length" :index="menu.path">
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
</template>

<script setup lang="ts">
import type { RouteRecordRaw } from 'vue-router'

defineProps<{ children: RouteRecordRaw[] }>()
</script>
