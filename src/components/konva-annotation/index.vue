<template>
  <div id="konva-annotation" class="flex-1 bg-#eee" />
</template>

<script setup lang='ts'>
import Konva from 'konva'

const {
  width,
  height,
} = defineProps({
  width: {
    type: Number,
    default: 500,
  },
  height: {
    type: Number,
    default: 500,
  },
  bgColor: {
    type: String,
    default: '#fff',
  },
})

const konva = ref()

// 初始化
function initKonva() {
  konva.value = new Konva.Stage({
    container: 'konva-annotation',
    width,
    height,
  })

  // TODO 画布内容 以及 事件监听
}

onMounted(() => {
  initKonva()
})
</script>
