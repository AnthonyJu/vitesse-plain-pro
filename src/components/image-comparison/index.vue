<template>
  <div
    v-if="images.length === 2"
    ref="containerRef"
    class="compare-wrapper"
    :style="{ aspectRatio, width: `${width}px` }"
  >
    <div class="image-before" :style="{ clipPath: `inset(0 ${100 - dragPercent}% 0 0)` }">
      <img :src="images[0]" alt="Before">
    </div>
    <div class="image-after">
      <img :src="images[1]" alt="After">
    </div>

    <div ref="draggableRef" class="drag-line" :style="{ left: `${dragPercent}%` }">
      <div ref="handleRef" class="handle flex-center">
        <Iconify icon="carbon:drag-horizontal" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { images, width, aspectRatio } = defineProps<{
  images: [string, string]
  width: number
  aspectRatio: string
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
