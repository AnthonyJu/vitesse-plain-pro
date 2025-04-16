import { useRenderLoop } from '@tresjs/core'
import * as THREE from 'three'

export function useDragView(camera: Ref<InstanceType<typeof THREE.PerspectiveCamera> | undefined>) {
  // 是否正在交互
  let isInteracting = false

  let moveX = 0
  let moveY = 0
  let lastMoveX = 0
  let lastMoveY = 0
  let pointerDownMouseX = 0
  let pointerDownMouseY = 0

  // 按下鼠标时的操作
  function onPointerDown(event: PointerEvent) {
    isInteracting = true
    // 记录按下时的坐标
    lastMoveX = moveY
    lastMoveY = moveX
    // 记录按下时的鼠标坐标
    pointerDownMouseX = event.clientX
    pointerDownMouseY = event.clientY
  }

  // 鼠标移动操作
  function onPointerMove(event: PointerEvent) {
    if (!isInteracting) return
    // 计算移动的距离
    moveY = (pointerDownMouseX - event.clientX) * 0.1 + lastMoveX
    moveX = (event.clientY - pointerDownMouseY) * 0.1 + lastMoveY
  }

  // 鼠标抬起
  function onPointerUp() {
    isInteracting = false
  }

  // 鼠标滚轮操作
  function onDocumentMouseWheel(event: WheelEvent) {
    // 修改fov
    const fov = camera.value!.fov + event.deltaY * 0.05
    // 限制fov的范围
    camera.value!.fov = THREE.MathUtils.clamp(fov, 10, 75)
  }

  // 每一帧的操作
  const { onLoop } = useRenderLoop()
  onLoop(() => {
    // 如果没有交互, 则自动旋转
    if (!isInteracting) moveY += 0.1

    // 限制x的范围
    moveX = Math.max(-85, Math.min(85, moveX))

    // 计算弧度
    const alpha = THREE.MathUtils.degToRad(90 - moveX)
    const theta = THREE.MathUtils.degToRad(moveY)

    // 计算相机的朝向
    const x = 500 * Math.sin(alpha) * Math.cos(theta)
    const y = 500 * Math.cos(alpha)
    const z = 500 * Math.sin(alpha) * Math.sin(theta)
    camera.value!.lookAt(x, y, z)
  })

  return {
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onDocumentMouseWheel,
  }
}
