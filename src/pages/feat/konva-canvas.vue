<template>
  <el-button type="primary" @click="type = 'point'">point</el-button>
  <el-button type="primary" @click="type = 'rect'">rect</el-button>
  <el-button type="primary" @click="type = 'polygon'">polygon</el-button>
  <el-button type="danger" @click="type = undefined">cancel</el-button>
  <div id="container" class="mt-20px w-500px" style="border: 1px solid #000;" />
</template>

<route lang='yaml'>
meta:
  name: Konva 画布
</route>

<script setup lang='ts'>
import Konva from 'konva'
import Maker from '@/assets/maker.png'

interface KonvaMouseEvent extends MouseEvent {
  layerX: number
  layerY: number
}

interface KonvaPointerEvent extends PointerEvent {
  layerX: number
  layerY: number
}

const type = ref<'point' | 'rect' | 'polygon'>()

let stage: Konva.Stage
const layer = new Konva.Layer()

let rect: Konva.Rect | undefined
let polygon: Konva.Line | undefined

function initKonva() {
  stage = new Konva.Stage({
    container: 'container',
    width: 500,
    height: 500,
  })

  stage.add(layer)

  stage.on('click', (e) => {
    const xy = {
      x: (e.evt as KonvaMouseEvent).layerX,
      y: (e.evt as KonvaMouseEvent).layerY,
    }
    if (type.value === 'point') {
      Konva.Image.fromURL(Maker, (darthNode) => {
        darthNode.setAttrs({
          ...xy,
          width: 20,
          height: 20,
          offset: {
            x: 10,
            y: 10,
          },
        })
        layer.add(darthNode)
      })
    }
    else if (type.value === 'polygon') {
      if (polygon) {
        polygon.setAttr('points', [
          ...polygon.getAttr('points'),
          xy.x,
          xy.y,
        ])
      }
      else {
        polygon = new Konva.Line({
          points: [xy.x, xy.y, xy.x, xy.y],
          closed: true,
          dash: [6, 6],
          fill: '#00D2FF55',
          stroke: '#00D2FF',
          strokeWidth: 2,
        })
        layer.add(polygon)
      }
    }
  })

  stage.on('mousedown', (e) => {
    if (type.value === 'rect' && !rect) {
      rect = new Konva.Rect({
        x: (e.evt as KonvaMouseEvent).layerX,
        y: (e.evt as KonvaMouseEvent).layerY,
        width: 0,
        height: 0,
        dash: [6, 6],
        fill: '#00D2FF55',
        stroke: '#00D2FF',
        strokeWidth: 2,
      })
      layer.add(rect)
    }
  })

  stage.on('mouseup', () => {
    if (type.value === 'rect' && rect) {
      rect = undefined
    }
  })

  stage.on('pointermove', (e) => {
    const xy = {
      x: (e.evt as KonvaPointerEvent).layerX,
      y: (e.evt as KonvaPointerEvent).layerY,
    }
    if (type.value === 'rect') {
      if (rect) {
        const x = rect.getAttr('x')
        const y = rect.getAttr('y')
        rect.setAttrs({
          width: xy.x - x,
          height: xy.y - y,
        })
      }
    }
    else if (type.value === 'polygon') {
      if (polygon) {
        const points = polygon.getAttr('points')
        points[points.length - 2] = xy.x
        points[points.length - 1] = xy.y
        polygon.setAttr('points', [
          ...points,
        ])
      }
    }
  })

  stage.on('dblclick', () => {
    if (polygon) {
      const points = polygon.getAttr('points').slice(0, -2)
      const x1 = points[points.length - 2]
      const y1 = points[points.length - 1]
      const x2 = points[points.length - 4]
      const y2 = points[points.length - 3]
      if (x1 === x2 && y1 === y2) {
        polygon.setAttr('points', points.slice(0, -2))
        polygon = undefined
      }
    }
  })
}

onMounted(() => {
  initKonva()
})
</script>
