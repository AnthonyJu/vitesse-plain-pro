// @ts-expect-error no exported
import { useVueCesium } from 'vue-cesium'

export function usePointDrag() {
  let scene: Cesium.Scene

  let isAltPressed = false
  let handler: Cesium.ScreenSpaceEventHandler | null = null
  const point = ref<Cesium.Cartesian3>()

  function onMouseMove(cur: Cesium.Cartesian3) {
    handler!.setInputAction((movement: Cesium.ScreenSpaceEventHandler.MotionEvent) => {
      const cartesian = scene.pickPosition(movement.endPosition)
      if (!cartesian) return

      const currentCartographic = Cesium.Cartographic.fromCartesian(cur)
      const newCartographic = Cesium.Cartographic.fromCartesian(cartesian)

      if (isAltPressed) {
        // 只更新高度
        currentCartographic.height = newCartographic.height
      }
      else {
        // 只更新平面位置，保持原来的高度
        newCartographic.height = currentCartographic.height
        currentCartographic.longitude = newCartographic.longitude
        currentCartographic.latitude = newCartographic.latitude
      }

      point.value = Cesium.Cartesian3.fromRadians(
        currentCartographic.longitude,
        currentCartographic.latitude,
        currentCartographic.height,
      )
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    // 鼠标抬起事件
    handler!.setInputAction(onMouseUp, Cesium.ScreenSpaceEventType.LEFT_UP)
  }

  function onMouseUp() {
    handler!.setInputAction(() => {
      const controller = scene.screenSpaceCameraController
      controller.enableRotate = true
      controller.enableTranslate = true
      controller.enableZoom = true
      controller.enableTilt = true
      controller.enableLook = true

      if (handler) {
        handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
        handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP)

        handler.destroy()
        handler = null
      }

      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      isAltPressed = false
    }, Cesium.ScreenSpaceEventType.LEFT_UP)
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.altKey) {
      isAltPressed = true
    }
  }

  function handleKeyUp(e: KeyboardEvent) {
    if (!e.altKey) {
      isAltPressed = false
    }
  }

  onMounted(() => {
    const vc = useVueCesium(DEFAULT_CESIUM_ID)
    scene = vc.viewer.scene

    // 鼠标左键按下事件
    handler = new Cesium.ScreenSpaceEventHandler(scene.canvas)
    handler.setInputAction((event: any) => {
      const pickedObject = scene.pick(event.position)
      if (Cesium.defined(pickedObject) && pickedObject.name === 'route-point') {
        // 禁用 Cesium 默认相机交互
        const controller = scene.screenSpaceCameraController
        controller.enableRotate = false
        controller.enableTranslate = false
        controller.enableZoom = false
        controller.enableTilt = false
        controller.enableLook = false

        // 获取当前点击的Entity坐标
        const cartesian = scene.pickPosition(event.position)
        onMouseMove(cartesian)

        onMouseUp()
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
  })

  return {
    point,
  }
}
