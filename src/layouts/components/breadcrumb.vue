<template>
  <div class="flex-items">
    <el-icon class="cursor-pointer" size="16px" mr-10px @click="menu.collapse = !menu.collapse">
      <Expand v-if="menu.collapse" />
      <Fold v-else />
    </el-icon>
    <el-breadcrumb flex-items>
      <el-breadcrumb-item
        v-for="item in breadcrumbList"
        :key="item.path"
        :to="item.path"
      >
        <div class="flex-items">
          {{ item.meta.title }}
          <span v-if="item.name === route.name">{{ showName }}</span>
        </div>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang='ts'>
import { Expand, Fold } from '@element-plus/icons-vue'

const route = useRoute()
const themeStore = useThemeStore()
const { menu } = storeToRefs(themeStore)

const breadcrumbList = computed(() => route.matched.filter(item => item.meta.title))
const showName = computed(() => {
  const qName = route.query['show-name']
  return qName ? ` - ${qName}` : ''
})
</script>
