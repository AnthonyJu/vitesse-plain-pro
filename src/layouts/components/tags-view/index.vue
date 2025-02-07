<template>
  <div class="tags-view mb-18px flex-items">
    <el-scrollbar
      ref="scrollbarRef"
      class="flex-1"
      view-class="h-full"
      @wheel.prevent="onHandleScroll"
    >
      <div ref="dragEl" class="h-full flex-items gap-10px pb-12px">
        <el-tag
          v-for="tag in allTags"
          :key="tag.meta.isKeepAlive ? tag.name : tag.fullPath /** 目的是为了替换时不闪烁 */"
          :closable="!tag.meta.isAffix"
          size="large"
          :effect="tag.fullPath === route.fullPath ? 'dark' : 'plain'"
          class="view-tag cursor-pointer rounded-8px"
          :class="{ draggable: !tag.meta.isAffix }"
          @click="$router.push(tag.fullPath!)"
          @close="tagsViewStore.closeTag(tag.fullPath!)"
          @contextmenu.prevent="handleContextMenu(tag, $event)"
        >
          <span class="px-5px !text-#fff">{{ tag.meta.title }}</span>
        </el-tag>
      </div>
    </el-scrollbar>
    <el-button
      class="mb-12px ml-22px rounded-8px"
      type="primary"
      size="default"
      :icon="Refresh"
      @click="tagsViewStore.refreshTag"
    >
      刷新
    </el-button>
    <Contextmenu ref="contextmenuRef" :dropdown="dropdown" @contextmenu-click="onContextmenuClick" />
  </div>
</template>

<script setup lang='ts'>
import type { ScrollbarInstance } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { useDraggable } from 'vue-draggable-plus'
import Contextmenu from './components/context-menu.vue'

interface WheelEventType extends WheelEvent {
  wheelDelta: number
}

const tagsViewStore = useTagsViewStore()
const { allTags, activeTag } = storeToRefs(tagsViewStore)

// 鼠标滚轮事件，横向滚动
const scrollbarRef = ref<ScrollbarInstance>()
function onHandleScroll(e: WheelEventType) {
  scrollbarRef.value!.wrapRef!.scrollLeft += e.wheelDelta / 4
}

// 设置 tagsView 可以进行拖拽
const dragEl = useTemplateRef<HTMLElement>('dragEl')
useDraggable(dragEl, allTags, { draggable: '.draggable', animation: 150 })

// 右键菜单功能
const dropdown = ref({ x: 0, y: 0 })
const contextmenuRef = useTemplateRef<typeof Contextmenu>('contextmenuRef')
function handleContextMenu(tag: RouteItem, e: MouseEvent) {
  const { clientX, clientY } = e
  dropdown.value.x = clientX
  dropdown.value.y = clientY
  contextmenuRef.value!.openContextmenu(tag.fullPath!)
}
function onContextmenuClick(id: number, fullPath: string) {
  switch (id) {
    // 关闭右侧
    case 1:
      tagsViewStore.closeRightTags(fullPath)
      break
    // 关闭其它
    case 2:
      tagsViewStore.closeOtherTags(fullPath)
      break
    // 关闭所有
    case 3:
      tagsViewStore.closeAllTags()
      break
  }
}

// 监听路由变化，添加标签
const route = useRoute()
watch(
  route,
  () => {
    tagsViewStore.addTag(route)
  },
  {
    deep: true,
    immediate: true,
  },
)

// 监听当前激活的标签，滚动到当前标签
watch(
  activeTag,
  async (val) => {
    if (val?.activeType === 'route') {
      await nextTick()
      // 等待标签完成动画
      await new Promise(resolve => setTimeout(resolve, 500))
      scrollbarRef.value?.update()
    }

    // 找到当前标签的索引
    const index = allTags.value.findIndex(tag => tag.fullPath === activeTag.value?.fullPath)
    scrollbarRef.value?.scrollTo({
      left: dragEl.value!.children[index].offsetLeft,
      behavior: 'smooth',
    })
  },
  {
    deep: true,
    immediate: true,
  },
)

// 监听标签变化，更新滚动条
watch(
  allTags,
  () => {
    nextTick(() => {
      // 等待标签完成动画
      setTimeout(() => {
        scrollbarRef.value?.update()
      }, 500)
    })
  },
  {
    deep: true,
  },
)
</script>
