<template>
  <div
    v-show="isReady"
    class="flex-col-center gap-5px"
    position="absolute bottom-10px right-10px z-10"
  >
    <!-- 复原 -->
    <div class="cesium-tool-btn" title="复原" @click="resetMap">
      <div class="i-carbon-home text-18px text-#fff" />
    </div>

    <!-- 缩放 -->
    <div class="flex-col-center overflow-hidden rounded-5px">
      <div class="cesium-tool-btn rounded-0!" title="放大" @click="zoomIn">
        <div class="i-carbon-add text-20px text-#fff" />
      </div>
      <div class="cesium-tool-btn rounded-0!" title="缩小" @click="zoomOut">
        <div class="i-carbon-subtract text-20px text-#fff" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Cartesian3,
  Math as CesiumMath,
  Ellipsoid,
  IntersectionTests,
  Ray,
  SceneMode,
} from 'cesium'
import { useCesium } from '@/composables/use-cesium'

const { center } = defineProps<{
  center?: {
    destination: Cartesian3
    orientation: {
      heading: number
      pitch: number
      roll: number
    }
  }
}>()

const { viewer, isReady } = useCesium()

// 复原地图视角
function resetMap() {
  if (!viewer.value) return

  viewer.value.camera.flyTo({
    ...(center || {
      destination: Cartesian3.fromDegrees(103.84, 31.15, 15000000),
      orientation: {
        heading: CesiumMath.toRadians(360),
        pitch: CesiumMath.toRadians(-90),
        roll: CesiumMath.toRadians(0),
      },
    }),
    duration: 1,
  })
}

// 放大
function zoomIn() {
  if (!viewer.value) return

  const scene = viewer.value.scene
  const camera = scene.camera

  // 如果是3D场景，使用相机焦点作为缩放中心
  if (scene.mode === SceneMode.SCENE3D) {
    const focus = getCameraFocus(scene)
    const cameraPosition = getCameraPosition(camera, focus, 1 / 2)
    camera.flyTo({
      destination: cameraPosition,
      orientation: {
        heading: camera.heading,
        pitch: camera.pitch,
        roll: camera.roll,
      },
      duration: 0.5,
      convert: false,
    })
  }
  else {
    camera.zoomIn(camera.positionCartographic.height * 0.5)
  }
}

// 缩小
function zoomOut() {
  if (!viewer.value) return

  const scene = viewer.value.scene
  const camera = scene.camera

  // 如果是3D场景，使用相机焦点作为缩放中心
  if (scene.mode === SceneMode.SCENE3D) {
    const focus = getCameraFocus(scene)
    const cameraPosition = getCameraPosition(camera, focus, -1)
    camera.flyTo({
      destination: cameraPosition,
      orientation: {
        heading: camera.heading,
        pitch: camera.pitch,
        roll: camera.roll,
      },
      duration: 0.5,
      convert: false,
    })
  }
  else {
    camera.zoomOut(camera.positionCartographic.height)
  }
}

// 获取相机焦点
function getCameraFocus(scene: import('cesium').Scene) {
  const ray = new Ray(scene.camera.positionWC, scene.camera.directionWC)
  const intersections = IntersectionTests.rayEllipsoid(ray, Ellipsoid.WGS84)
  if (intersections) {
    return Ray.getPoint(ray, intersections.start)
  }
  // 相机方向不指向地球仪，因此使用椭球地平线点作为焦点。
  return IntersectionTests.grazingAltitudeLocation(ray, Ellipsoid.WGS84)
}

// 获取相机位置
function getCameraPosition(camera: import('cesium').Camera, focus: Cartesian3, scalar: number) {
  const cartesian3Scratch = new Cartesian3()
  const direction = Cartesian3.subtract(
    focus,
    camera.position,
    cartesian3Scratch,
  )
  const movementVector = Cartesian3.multiplyByScalar(
    direction,
    scalar,
    cartesian3Scratch,
  )

  // 计算新的相机位置
  return Cartesian3.add(camera.position, movementVector, cartesian3Scratch)
}
</script>
