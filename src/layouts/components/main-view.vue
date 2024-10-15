<template>
  <div class="w-full flex-col p-15px pb-0">
    <router-view v-slot="{ Component, route }">
      <transition mode="out-in" name="opacity" @before-enter="$emit('beforeEnter')">
        <keep-alive :include="keepAliveNames" :exclude="excludeKeepAliveNames">
          <component :is="formatComponent(Component, route)" :key="componentKey" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang='ts'>
import type { RouteLocationNormalizedLoadedTyped } from 'vue-router'

defineEmits(['beforeEnter'])

const tagsViewStore = useTagsViewStore()
const { allTags, keepAliveNames, componentKey, excludeKeepAliveNames } = storeToRefs(tagsViewStore)

// 用于缓存组件
const componentMap = new Map()
// 格式化组件，确保多开的动态路不会出现数据混乱
function formatComponent(compent: Component, route: RouteLocationNormalizedLoadedTyped<any, any>) {
  if (route.params.id && route.meta.isDynamic && route.meta.isKeepAlive) {
    // Tips 获取缓存组件名称，但是由于存在transition组件，该函数会执行两次，keepAliveName不一定存在，可能被过滤掉了在tagsViewStore中
    const componentName = allTags.value.find(tag => tag.fullPath === route.fullPath)?.keepAliveName
    // 如果有缓存组件，直接返回
    if (componentName) {
      if (!componentMap.has(componentName)) {
        componentMap.set(
          componentName,
          {
            name: componentName,
            render: () => h(compent),
          },
        )
      }
      return componentMap.get(componentName)
    }
  }
  return compent
}
</script>

<style lang='scss' scoped>
.opacity-enter-active,
.opacity-leave-active {
  transition: all 0.3s ease;
  will-change: transform;
}

.opacity-enter-from,
.opacity-leave-to {
  opacity: 0;
}
</style>
