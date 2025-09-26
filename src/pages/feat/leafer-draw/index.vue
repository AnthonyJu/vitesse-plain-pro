<template>
  <div class="full flex layout-default">
    <div class="flex-col flex-1">
      <div>todo</div>
      <div id="leafer-box" class="flex-1" />
    </div>
    <div class="w-250px">todo</div>
  </div>
</template>

<script setup lang="ts">
// #限制元素拖动范围 [在 Frame 内拖动]
import { App, Box, DragEvent, ImageEvent, Image as LeaferImage, PointerEvent, Rect } from 'leafer-ui'
import myImg from '@/assets/leafer.jpg'

import '@leafer-in/editor' // 导入图形编辑器插件
import '@leafer-in/viewport' // 导入视口插件
// import '@leafer-in/view' // 导入视口控制插件
// import '@leafer-in/state' // 图形交互状态插件
// import '@leafer-in/bright' // 图形突出高亮插件

onMounted(() => {
  const app = new App({
    view: 'leafer-box',
    fill: '#333',
    mode: 'design', // 设计模式
    pixelSnap: true, // 像素对齐

    wheel: {
      zoomMode: 'mouse', // 是否开启鼠标滚动直接缩放视图
    },

    move: {
      dragEmpty: false, // 空白处拖拽是否平移视图
      holdSpaceKey: true, // 是否按住空格键拖拽视图
    },

    zoom: {
      min: 1,
      max: 10,
    },

    editor: {
      hideOnMove: true, // 是否在移动元素时隐藏编辑框
      hideOnSmall: true, // 是否在元素过小时隐藏编辑框
      hideResizeLines: false, // 是否隐藏四周的控制线
      hideRotatePoints: true, // 是否隐藏四周的旋转控制点

      // circle: {}, // 显示旋转控制
      circleDirection: 'top', // 旋转控制位置 top
      // middlePoint: {}, // 显示中点控制（hideRotatePoints无法取消中间点的旋转）

      bright: true, // 编辑时突出显示、置顶渲染选中元素
      // dimOthers: true, // 编辑时淡化其他元素

      buttonsFixed: true, // 按钮位置固定

      multipleSelect: false, // 是否允许多选
      boxSelect: false, // 是否允许框选

      flipable: false, // 是否允许翻转
      rotatable: false, // 是否允许旋转
      skewable: false, // 是否允许倾斜

      beforeScale({ target, scaleX, scaleY }) {
        if (target.width * scaleX < 20 || target.height * scaleY < 20) {
          const scale_x = Math.max(20 / target.width, scaleX)
          const scale_y = Math.max(20 / target.height, scaleY)
          return { scaleX: scale_x, scaleY: scale_y }
        }
        return true
      },
    },
  })

  // 添加移除按钮
  const button = Box.one({
    around: 'center',
    fill: '#FEB027',
    cornerRadius: 20,
    cursor: 'pointer',
    children: [{ tag: 'Text', fill: 'white', text: '移除', padding: [7, 10] }],
  })
  app.editor.buttons.add(button)
  // 点击删除元素，并取消选择
  button.on(PointerEvent.TAP, () => {
    if (app.editor.target) app.editor.target.remove()
    app.editor.target = null
  })

  const image = new LeaferImage({
    id: 'image',
    url: myImg,
    lazy: true,
    draggable: false,
    hitSelf: false,
  })

  image.load()

  image.once(ImageEvent.LOADED, (e: ImageEvent) => {
    // 根据图片和 app 大小，计算合适的缩放比例
    const scale = Math.min(app.width / e.image.width, app.height / e.image.height, 1)

    const width = image.width * scale
    const height = image.height * scale

    image.set({ width, height })

    const box = Box.one({
      width,
      height,
      fill: app.fill, // 必须要有填充色，才能判定拖拽
    }, app.width / 2 - width / 2, app.height / 2 - height / 2)

    box.add(image)

    app.tree.add(box)

    let rect: Rect | null = null
    box.on(DragEvent.START, (e: DragEvent) => {
      // 有 id 说明是拖动已有元素
      if (e.target.id) return
      rect = new Rect({ id: 'drag', editable: true, dragBounds: 'parent', fill: '#32cd79' })
      box.add(rect)
    })
    box.on(DragEvent.DRAG, (e: DragEvent) => {
      if (rect) {
        const { x, y, width, height } = e.getPageBounds()
        rect.set({ x: x - box.x, y: y - box.y, width, height })
      }
    })
    box.on(DragEvent.END, () => {
      if (rect) rect = null
    })
  })
})
</script>
