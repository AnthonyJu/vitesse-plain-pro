<template>
  <div id="konva-annotation" class="flex-1" />
</template>

<script setup lang="ts">
import Konva from 'konva'

const {
  width,
  height,
} = defineProps({
  width: { type: Number, default: 500 },
  height: { type: Number, default: 500 },
  bgColor: { type: String, default: '#fff' },
})

const konva = ref<Konva.Stage>()
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
  layer = new Konva.Layer()
  konva.value.add(layer)
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

function clear() {
  layer.destroyChildren()
  layer.draw()
  polygonPoints = []
}

// 暴露给父组件调用
defineExpose({
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
