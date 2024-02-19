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
const layer = reactive(new Konva.Layer()) as Konva.Layer
const toolsLayer = reactive(new Konva.Layer()) as Konva.Layer
const tagLayer = reactive(new Konva.Layer()) as Konva.Layer

// 选中工具
const tr = new Konva.Transformer()

const tagNumber = ref<number>(0)

let rect: Konva.Rect | undefined
let polygon: Konva.Line | undefined

function initKonva() {
  stage = new Konva.Stage({
    container: 'container',
    width: 500,
    height: 500,
  })

  layer.add(tr)

  stage.add(layer)
  stage.add(toolsLayer)
  stage.add(tagLayer)

  stage.on('click', (e) => {
    // select a shape with click
    if (!type.value) {
      // 不是画布并且不是图标和工具栏
      if (!e.target.attrs.container && !e.target.attrs.type) {
        tr.nodes([e.target as Konva.Node])
        toolsLayer.removeChildren()
        removeFn(e.target as Konva.Node)
        e.target.draggable(!type.value)
      }
      else {
        tr.nodes([])
        toolsLayer.removeChildren()
      }
    }
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
          draggable: !type.value,
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
          draggable: !type.value,
          name: tagNumber.value.toString(),
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
        draggable: !type.value,
        name: tagNumber.value.toString(),
      })
      layer.add(rect)
    }
  })

  stage.on('mouseup', (e) => {
    if (type.value === 'rect' && rect) {
      const end = {
        x: (e.evt as KonvaMouseEvent).layerX,
        y: (e.evt as KonvaMouseEvent).layerY,
      }
      const start = {
        x: rect.x(),
        y: rect.y(),
      }

      if (!isRectFn(start, end)) {
        rect.remove()
        rect = undefined
        return
      }
      tagFn(rect)
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

  stage.on('dblclick', (e) => {
    if (polygon) {
      const points = polygon.getAttr('points').slice(0, -2)
      const x1 = points[points.length - 2]
      const y1 = points[points.length - 1]
      const x2 = points[points.length - 4]
      const y2 = points[points.length - 3]
      if (x1 === x2 && y1 === y2) {
        polygon.setAttr('points', points.slice(0, -2))
        tagFn(polygon)
        polygon = undefined
      }
    }
    console.log('🚀 ~ e:', e)
    // TODO 添加多边形的顶点 用来更改多边形的形状
    if (e.target.attrs.points) {

    }
  })
}

watch(() => tagLayer.children.length, (newVal) => {
  tagLayer.removeChildren()
  layer.children.forEach((item: any, index: number) => {
    // 不是画布 不是Transformer
    if (item.attrs.width && item.attrs.height || item.attrs.points) {
      item.attrs.name = (index).toString()
      tagFn(item)
    }
  })
  tagNumber.value = newVal + 1
})

// 绘制标识
function tagFn(target: Konva.Node) {
  // 如果是多边形
  if (target.attrs.points) {
    const { x, y } = getPolygonCenter(target.attrs.points)
    const tag = new Konva.Text({
      x: x + target.x(),
      y: y + target.y(),
      text: target.attrs.name,
      fontSize: 20,
      fill: 'blue',
      type: 'tag',
    })
    target.on('dragmove', () => {
      const { x, y } = getPolygonCenter(target.attrs.points)
      tag.setAttrs({
        x: x + target.x(),
        y: y + target.y(),
      })
    })
    tagLayer.add(tag)
  }
  else {
    const { x, y } = getRectCenter(target as Konva.Rect)
    const tag = new Konva.Text({
      x,
      y,
      text: target.attrs.name,
      fontSize: 20,
      fill: 'blue',
      type: 'tag',
    })
    target.on('dragmove', () => {
      const { x, y } = getRectCenter(target as Konva.Rect)
      tag.setAttrs({
        x,
        y,
      })
    })
    tagLayer.add(tag)
  }
}

// 删除图标
function removeFn(target: Konva.Node) {
  if (toolsLayer.children.find((item: any) => item.attrs.name === target.attrs.name)) {
    return
  }
  // 绘制一个删除图标
  // 判断是否是多边形
  let x: number
  let y: number
  if (target.attrs.points) {
    const center = getPolygonRightTop(target.attrs.points)
    x = center.x + target.x()
    y = center.y + target.y()
  }
  else {
    x = target.x() + target.width() * Number(target.scaleX().toFixed(2)) - 30
    y = target.y() + 10
  }
  const removeIcon = new Konva.Text({
    x,
    y,
    text: '❌',
    fontSize: 20,
    fill: 'red',
    type: 'tools',
    name: target.attrs.name,
  })
  removeIcon.on('mouseenter', () => {
    document.body.style.cursor = 'pointer'
  })
  removeIcon.on('mouseleave', () => {
    document.body.style.cursor = 'default'
  })
  target.on('transform', () => {
    // eslint-disable-next-line max-len
    const tag = tagLayer.children.find((item: any) => item.attrs.text === target.attrs.name) as Konva.Text
    tr.nodes([target, removeIcon, tag])
  })
  removeIcon.on('click', () => {
    target.remove()
    removeIcon.remove()
    tr.nodes([])
    document.body.style.cursor = 'default'
    // 删除标识
    tagLayer.children.forEach((item: any) => {
      if (item.attrs.text === target.attrs.name) {
        item.remove()
      }
    })
  })
  // 监听拖动事件 更新删除图标位置
  target.on('dragmove', () => {
    if (target.attrs.points) {
      const center = getPolygonRightTop(target.attrs.points)
      x = center.x + target.x()
      y = center.y + target.y()
    }
    else {
      x = target.x() + target.width() * Number(target.scaleX().toFixed(2)) - 30
      y = target.y() + 10
    }
    removeIcon.setAttrs({
      x,
      y,
    })
    // eslint-disable-next-line max-len
    const tag = tagLayer.children.find((item: any) => item.attrs.text === target.attrs.name) as Konva.Text
    tr.nodes([target, removeIcon, tag])
  })
  toolsLayer.add(removeIcon)
}

// 判断绘制的是否是合规的矩形
function isRectFn(start: Konva.Vector2d, end: Konva.Vector2d) {
  // 如果矩形起点终点相同则不绘制
  if (start.x === end.x && start.y === end.y) {
    return false
  }
  else if (Math.abs(start.x - end.x) < 10 || Math.abs(start.y - end.y) < 10) {
    // 如果长度或者宽度小于10则不绘制
    return false
  }
  else {
    return true
  }
}

// 获取多边形中心点
function getPolygonCenter(points: number[]) {
  const x = points.reduce((prev: any, next: any, index: any) => {
    if (index % 2 === 0) {
      return prev + next
    }
    return prev
  }, 0) / (points.length / 2)
  const y = points.reduce((prev: any, next: any, index: any) => {
    if (index % 2 !== 0) {
      return prev + next
    }
    return prev
  }, 0) / (points.length / 2)
  return { x, y }
}

// 获取多边形的右上方顶点
function getPolygonRightTop(points: number[]) {
  const x = Math.max(...points.filter((item, index) => index % 2 === 0)) - 30
  const y = Math.min(...points.filter((item, index) => index % 2 !== 0)) + 10
  return { x, y }
}

// 获取矩形中心点
function getRectCenter(rect: Konva.Rect) {
  const x = rect.x() + rect.width() / 2 - 5
  const y = rect.y() + rect.height() / 2 - 5
  return { x, y }
}

onMounted(() => {
  initKonva()
})
</script>
