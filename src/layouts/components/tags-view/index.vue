<template>
  <div :style="{ height: `${tagsview.height}px` }" flex-items px-15px shadow-b>
    <el-scrollbar
      ref="scrollbarRef"
      class="flex-1"
      view-class="h-full"
      @wheel.prevent="onHandleScroll"
    >
      <div class="h-full flex-items gap-10px">
        <el-tag
          v-for="tag in allTags"
          :key="tag.meta.isKeepAlive ? tag.name : tag.fullPath"
          :closable="!tag.meta.isAffix"
          :effect="tag.fullPath === route.fullPath ? 'dark' : 'plain'"
          class="cursor-pointer hover:opacity-90"
          @click="$router.push(tag.fullPath!)"
        >
          <div flex-items gap-5px>
            <Iconify v-if="tag.meta.icon" :icon="tag.meta.icon" />
            {{ tag.meta.title }}
          </div>
        </el-tag>
      </div>
    </el-scrollbar>
    <el-button ml-15px type="primary" size="small">
      刷新
    </el-button>
  </div>
</template>

<script setup lang='ts'>
import type { ScrollbarInstance } from 'element-plus'

interface WheelEventType extends WheelEvent {
  wheelDelta: number
}

const themeStore = useThemeStore()
const { tagsview } = storeToRefs(themeStore)
const tagsViewStore = useTagsViewStore()
const { allTags } = storeToRefs(tagsViewStore)

// 鼠标滚轮事件，横向滚动
const scrollbarRef = useTemplateRef<ScrollbarInstance>('scrollbarRef')
function onHandleScroll(e: WheelEventType) {
  scrollbarRef.value!.wrapRef!.scrollLeft += e.wheelDelta / 4
}

const route = useRoute()
watchEffect(() => {
  tagsViewStore.addTag(route)
})
</script>
