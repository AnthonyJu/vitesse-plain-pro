<template>
  <div id="konva-annotation" class="flex-1" />
</template>

<script setup lang="ts">
import Konva from 'konva'

const {
  width,
  height,
  enableZoom,
  zoomStep,
} = defineProps({
  width: { type: Number, default: 500 },
  height: { type: Number, default: 500 },
  bgColor: { type: String, default: '#fff' },
  enableZoom: { type: Boolean, default: true },
  zoomStep: { type: Number, default: 1.1 },
})

const konva = ref<Konva.Stage>()
// 背景图层
let layer_of_bg: Konva.Layer
let layer: Konva.Layer
let tempShape: Konva.Shape | null = null
let startPos: { x: number, y: number } | null = null
let polygonPoints: number[] = []

function initKonva() {
  konva.value = new Konva.Stage({
    container: 'konva-annotation',
    width,
    height,
  })
  // 背景图层
  layer_of_bg = new Konva.Layer()
  konva.value.add(layer_of_bg)

  layer = new Konva.Layer()
  konva.value.add(layer)

  // 缩放逻辑（可配置）
  if (enableZoom) {
    // 每次滚动放大/缩小的倍数
    const scaleBy = zoomStep

    konva.value.on('wheel', (e) => {
      e.evt.preventDefault()

      const stage = konva.value!
      const oldScale = stage.scaleX()

      // 鼠标相对于 stage 的位置
      const pointer = stage.getPointerPosition()
      if (!pointer) return

      // 新的缩放比例
      const direction = e.evt.deltaY > 0 ? -1 : 1
      const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy

      // 保持缩放中心在鼠标位置
      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      }

      stage.scale({ x: newScale, y: newScale })

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      }

      stage.position(newPos)
      stage.batchDraw()
    })
  }
}

// 给 konva 添加背景
function addBg(imageUrl: string) {
  // 先清空背景图层
  layer_of_bg.destroyChildren()
  layer_of_bg.draw()
  const imageObj = new Image()
  imageObj.onload = function () {
    const bg = new Konva.Image({
      x: 0,
      y: 0,
      image: imageObj,
      width,
      height,
      listening: false,
    })

    layer_of_bg.add(bg)
    bg.moveToBottom()
    layer_of_bg.draw()
  }
  imageObj.src = imageUrl
}

// ----------------- 绘制方法封装 -----------------
// 绘制点
function enableDrawPoint() {
  konva.value?.off('mousedown') // 先解绑旧事件
  konva.value?.on('mousedown', () => {
    const pos = konva.value!.getPointerPosition()
    if (!pos) return
    const circle = new Konva.Circle({
      x: pos.x,
      y: pos.y,
      radius: 5,
      fill: 'blue',
    })
    layer.add(circle)
    layer.draw()
  })
}

// 绘制线
function enableDrawLine() {
  konva.value?.off('mousedown mousemove mouseup')
  konva.value?.on('mousedown', () => {
    startPos = konva.value!.getPointerPosition()
  })
  konva.value?.on('mousemove', () => {
    if (!startPos) return
    const pos = konva.value!.getPointerPosition()
    if (!pos) return
    if (tempShape) tempShape.destroy()

    tempShape = new Konva.Line({
      points: [startPos.x, startPos.y, pos.x, pos.y],
      stroke: 'green',
      strokeWidth: 2,
    })
    layer.add(tempShape)
    layer.draw()
  })
  konva.value?.on('mouseup', () => {
    startPos = null
    tempShape = null
  })
}
// 绘制矩形
function enableDrawRect() {
  konva.value?.off('mousedown mousemove mouseup')
  konva.value?.on('mousedown', () => {
    startPos = konva.value!.getPointerPosition()
  })
  konva.value?.on('mousemove', () => {
    if (!startPos) return
    const pos = konva.value!.getPointerPosition()
    if (!pos) return
    if (tempShape) tempShape.destroy()

    tempShape = new Konva.Rect({
      x: startPos.x,
      y: startPos.y,
      width: pos.x - startPos.x,
      height: pos.y - startPos.y,
      stroke: 'orange',
      strokeWidth: 2,
    })
    layer.add(tempShape)
    layer.draw()
  })
  konva.value?.on('mouseup', () => {
    startPos = null
    tempShape = null
  })
}

// 绘制圆
function enableDrawCircle() {
  konva.value?.off('mousedown mousemove mouseup')
  konva.value?.on('mousedown', () => {
    startPos = konva.value!.getPointerPosition()
  })
  konva.value?.on('mousemove', () => {
    if (!startPos) return
    const pos = konva.value!.getPointerPosition()
    if (!pos) return
    if (tempShape) tempShape.destroy()

    const radius = Math.sqrt(
      (pos.x - startPos.x) ** 2 + (pos.y - startPos.y) ** 2,
    )
    tempShape = new Konva.Circle({
      x: startPos.x,
      y: startPos.y,
      radius,
      stroke: 'purple',
      strokeWidth: 2,
    })
    layer.add(tempShape)
    layer.draw()
  })
  konva.value?.on('mouseup', () => {
    startPos = null
    tempShape = null
  })
}

// 绘制多边形
function enableDrawPolygon() {
  konva.value?.off('mousedown')
  polygonPoints = []
  konva.value?.on('mousedown', () => {
    const pos = konva.value!.getPointerPosition()
    if (!pos) return
    polygonPoints.push(pos.x, pos.y)
    if (polygonPoints.length >= 4) {
      if (tempShape) tempShape.destroy()
      tempShape = new Konva.Line({
        points: polygonPoints,
        stroke: 'blue',
        strokeWidth: 2,
        closed: false,
      })
      layer.add(tempShape)
      layer.draw()
    }
  })
}

// 清空画布
function clear() {
  layer.destroyChildren()
  layer.draw()
  polygonPoints = []
}

// 暴露给父组件调用
defineExpose({
  konva,
  addBg,
  enableDrawPoint,
  enableDrawLine,
  enableDrawRect,
  enableDrawCircle,
  enableDrawPolygon,
  clear,
})

onMounted(() => {
  initKonva()
})
</script>
