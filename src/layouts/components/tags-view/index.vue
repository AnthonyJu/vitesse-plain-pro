<template>
  <div :style="{ height: `${tagsview.height}px` }" flex-items px-15px shadow-b>
    <el-scrollbar
      ref="scrollbarRef"
      class="flex-1"
      view-class="h-full"
      @wheel.prevent="onHandleScroll"
    >
      <div ref="dragEl" class="h-full flex-items gap-10px">
        <el-tag
          v-for="tag in allTags"
          :key="tag.meta.isKeepAlive ? tag.name : tag.fullPath /** 目的是为了替换时不闪烁 */"
          :closable="!tag.meta.isAffix"
          :effect="tag.fullPath === route.fullPath ? 'dark' : 'plain'"
          class="cursor-pointer hover:opacity-90"
          :class="{ draggable: !tag.meta.isAffix }"
          @click="$router.push(tag.fullPath!)"
          @close="tagsViewStore.closeTag(tag.fullPath!)"
          @contextmenu.prevent="handleContextMenu(tag, $event)"
        >
          <div flex-items gap-5px>
            <Iconify v-if="tag.meta.icon" :icon="tag.meta.icon" />
            {{ tag.meta.title }}
          </div>
        </el-tag>
      </div>
    </el-scrollbar>
    <el-button
      ml-15px
      type="primary"
      size="small"
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

const themeStore = useThemeStore()
const { tagsview, fullScreen } = storeToRefs(themeStore)
const tagsViewStore = useTagsViewStore()
const { allTags } = storeToRefs(tagsViewStore)

// 鼠标滚轮事件，横向滚动
const scrollbarRef = useTemplateRef<ScrollbarInstance>('scrollbarRef')
function onHandleScroll(e: WheelEventType) {
  scrollbarRef.value!.wrapRef!.scrollLeft += e.wheelDelta / 4
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

// 设置 tagsView 可以进行拖拽
const dragEl = useTemplateRef<HTMLElement>('dragEl')
useDraggable(dragEl, allTags, { draggable: '.draggable', animation: 150 })

// 右键菜单功能
const dropdown = ref({ x: 0, y: 0 })
const contextmenuRef = useTemplateRef('contextmenuRef')
function handleContextMenu(tag: RouteItem, e: MouseEvent) {
  const { clientX, clientY } = e
  dropdown.value.x = clientX
  dropdown.value.y = clientY
  contextmenuRef.value!.openContextmenu(tag.fullPath!)
}
function onContextmenuClick(id: number, fullPath: string) {
  switch (id) {
    // 网页全屏
    case 0:
      fullScreen.value = true
      break
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
</script>
