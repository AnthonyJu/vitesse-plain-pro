<template>
  <div
    v-if="images.length === 2"
    ref="containerRef"
    class="compare-wrapper"
    :style="{ aspectRatio, width: `${width}px` }"
  >
    <div class="image-before" :style="{ clipPath: `inset(0 ${100 - dragPercent}% 0 0)` }">
      <img
        :src="images[0]"
        alt="Before"
        draggable="false"
        :style="{
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
          left: `${imageOffset.x}px`,
          top: `${imageOffset.y}px`,
        }"
      >
    </div>
    <div class="image-after">
      <img
        :src="images[1]"
        alt="After"
        draggable="false"
        :style="{
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
          left: `${imageOffset.x}px`,
          top: `${imageOffset.y}px`,
        }"
      >
    </div>

    <!-- 用于缩放、拖拽事件判断 -->
    <div
      class="absolute left-0 top-0 z-1 full"
      @wheel="onWheelZoom"
      @mousedown="onMouseDown"
    />

    <div ref="draggableRef" class="drag-line" :style="{ left: `${dragPercent}%` }">
      <div ref="handleRef" class="handle flex-center">
        <Iconify icon="carbon:drag-horizontal" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { images, width, aspectRatio, maxScale = 5 } = defineProps<{
  images: [string, string]
  width: number
  aspectRatio: string
  maxScale?: number
}>()

const containerRef = ref<HTMLElement | null>(null)
const draggableRef = ref<HTMLElement | null>(null)
const handleRef = ref<HTMLElement | null>(null)

// 默认拖动位置为容器宽度的一半
const dragX = ref(width / 2)

// 拖动事件
useDraggable(draggableRef, {
  containerElement: containerRef,
  axis: 'x',
  handle: handleRef,
  onMove: pos => dragX.value = pos.x,
})

// 拖动百分比
const dragPercent = computed(() => {
  if (!containerRef.value) return 50
  return Math.max(0, Math.min(100, (dragX.value / containerRef.value.offsetWidth) * 100))
})

// 图片缩放比例
const scale = ref(1)
const imageOffset = ref({ x: 0, y: 0 })
let isDraggingImage = false
let lastMousePos = { x: 0, y: 0 }

// 鼠标滚轮缩放事件
function onWheelZoom(e: WheelEvent) {
  e.preventDefault()
  const rect = containerRef.value?.getBoundingClientRect()
  if (!rect) return

  const oldScale = scale.value
  const newScale = Math.min(maxScale, Math.max(1, scale.value - e.deltaY * 0.001))
  const ratio = newScale / oldScale

  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top

  imageOffset.value.x -= (mouseX - imageOffset.value.x) * (ratio - 1)
  imageOffset.value.y -= (mouseY - imageOffset.value.y) * (ratio - 1)
  scale.value = newScale

  limitOffset()
}

// 鼠标按下事件
function onMouseDown(e: MouseEvent) {
  isDraggingImage = true
  lastMousePos = { x: e.clientX, y: e.clientY }

  window.addEventListener('mousemove', onImageDrag)
  window.addEventListener('mouseup', () => {
    isDraggingImage = false
    window.removeEventListener('mousemove', onImageDrag)
  }, { once: true })
}

// 拖拽
function onImageDrag(e: MouseEvent) {
  if (!isDraggingImage) return
  const dx = e.clientX - lastMousePos.x
  const dy = e.clientY - lastMousePos.y
  lastMousePos = { x: e.clientX, y: e.clientY }

  imageOffset.value.x += dx
  imageOffset.value.y += dy

  limitOffset()
}

// 限制偏移量
function limitOffset() {
  if (!containerRef.value) return
  const containerWidth = containerRef.value.offsetWidth
  const containerHeight = containerRef.value.offsetHeight

  const scaledWidth = containerWidth * scale.value
  const scaledHeight = containerHeight * scale.value

  const minX = containerWidth - scaledWidth
  const minY = containerHeight - scaledHeight

  imageOffset.value.x = Math.min(0, Math.max(minX, imageOffset.value.x))
  imageOffset.value.y = Math.min(0, Math.max(minY, imageOffset.value.y))
}
</script>

<style scoped lang="scss">
.compare-wrapper {
  position: relative;
  overflow: hidden;
  user-select: none;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    will-change: transform;
  }

  .image-before {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .image-after {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .drag-line {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 2;
    width: 4px;
    background-color: var(--el-color-primary);
    transform: translateX(-50%);

    .handle {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      font-size: 18px;
      color: var(--el-color-primary);
      cursor: ew-resize;
      background: #fff;
      border-radius: 50%;
      box-shadow: 0 0 5px rgb(0 0 0 / 50%);
      transform: translate(-50%, -50%);

      &:hover {
        color: #fff;
        background: var(--el-color-primary);
      }
    }
  }
}
</style>
