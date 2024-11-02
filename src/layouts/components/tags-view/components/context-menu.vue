<template>
  <teleport to="body">
    <transition name="el-zoom-in-center">
      <div
        v-show="show"
        :key="Math.random()"
        class="el-dropdown__popper el-popper is-light is-pure custom-contextmenu"
        data-popper-placement="bottom"
        :style="`top: ${xy.y + 5}px;left: ${xy.x}px;`"
      >
        <ul class="el-dropdown-menu">
          <template v-for="(item, index) in dropdownList">
            <li
              v-if="!item.hidden"
              :key="index"
              class="el-dropdown-menu__item"
              @click="onCurrentContextmenuClick(index)"
            >
              <Iconify :icon="item.icon" size="12px" mr-8px />
              <span text-12px>{{ item.txt }}</span>
            </li>
          </template>
        </ul>
        <div class="el-popper__arrow" :style="{ left: `${arrowLeft}px` }" />
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
interface Props {
  dropdown: { x: number, y: number }
}
interface DropdownItem {
  txt: string
  icon: string
  hidden?: boolean
}

const { dropdown = { x: 0, y: 0 } } = defineProps<Props>()

const emit = defineEmits<{
  (e: 'contextmenuClick', id: number, fullPath: string): void
}>()

// 展示右键菜单
const show = ref(false)
// 箭头位置
const arrowLeft = ref(10)
// 当前路由地址
const fullPath = ref('')

// 下拉菜单列表
const dropdownList: DropdownItem[] = [
  { txt: '全屏', icon: 'ep-full-screen' },
  { txt: '关闭右侧', icon: 'ep-close' },
  { txt: '关闭其它', icon: 'ep-circle-close' },
  { txt: '关闭所有', icon: 'ep-folder-delete' },
]

// 监听下拉菜单位置
watch(
  () => dropdown,
  ({ x }) => {
    const w = document.documentElement.clientWidth
    if (x + 117 > w) arrowLeft.value = 117 - (w - x)
    else arrowLeft.value = 10
  },
  {
    deep: true,
  },
)

// 计算下拉菜单位置
const xy = computed(() => {
  // 117 为 `Dropdown 下拉菜单` 的宽度
  if (dropdown.x + 117 > document.documentElement.clientWidth) {
    return {
      x: document.documentElement.clientWidth - 117,
      y: dropdown.y,
    }
  }
  else {
    return dropdown
  }
})

const route = useRoute()

// 打开右键菜单
function openContextmenu(path: string) {
  // 非当前页面不能全屏
  dropdownList[0].hidden = route.fullPath !== path

  fullPath.value = path
  show.value = true
}

// 当前项菜单点击
function onCurrentContextmenuClick(id: number) {
  emit('contextmenuClick', id, fullPath.value)
}

// 关闭右键菜单
function closeContextmenu() {
  show.value = false
}

// 监听页面监听进行右键菜单的关闭
onMounted(() => {
  document.body.addEventListener('click', closeContextmenu)
})

// 页面卸载时，移除右键菜单监听事件
onUnmounted(() => {
  document.body.removeEventListener('click', closeContextmenu)
})

// 暴露变量
defineExpose({
  openContextmenu,
})
</script>

<style scoped lang="scss">
.custom-contextmenu {
  position: fixed;
  z-index: 100;
  transform-origin: center top;
}
</style>
