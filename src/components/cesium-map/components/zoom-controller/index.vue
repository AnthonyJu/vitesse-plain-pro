<template>
  <div id="zoom-control" class="flex-col-center gap-5px">
    <div class="tool-btn" title="复原" @click="resetMap">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 32 32">
        <path
          fill="currentColor"
          d="M16.612
          2.214a1.01
          1.01
          0
          0
          0-1.242
          0L1
          13.419l1.243
          1.572L4
          13.621V26a2.004
          2.004
          0
          0
          0
          2
          2h20a2.004
          2.004
          0
          0
          0
          2-2V13.63L29.757
          15L31
          13.428ZM18
          26h-4v-8h4Zm2
          0v-8a2.002
          2.002
          0
          0
          0-2-2h-4a2.002
          2.002
          0
          0
          0-2
          2v8H6V12.062l10-7.79l10
          7.8V26Z"
        />
      </svg>
    </div>

    <div class="flex-col-center overflow-hidden rounded-5px">
      <div class="tool-btn rounded-0!" title="放大" @click="zoomIn">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 32 32">
          <path fill="currentColor" d="M17 15V8h-2v7H8v2h7v7h2v-7h7v-2z" />
        </svg>
      </div>
      <div class="tool-btn rounded-0!" title="缩小" @click="zoomOut">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 32 32">
          <path fill="currentColor" d="M8 15h16v2H8z" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Camera, Scene, Viewer } from 'cesium'
import type { ShallowRef } from 'vue'
import { Cartesian3, Ellipsoid, IntersectionTests, Ray, SceneMode } from 'cesium'

const { center } = defineProps<{
  center: {
    destination: Cartesian3
    orientation: {
      heading: number
      pitch: number
      roll: number
    }
  }
}>()

const viewer = inject('viewer') as ShallowRef<Viewer | null>

function resetMap() {
  viewer.value?.camera.flyTo({
    ...center,
    duration: 1,
  })
}

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
function getCameraFocus(scene: Scene) {
  const ray = new Ray(scene.camera.positionWC, scene.camera.directionWC)
  const intersections = IntersectionTests.rayEllipsoid(ray, Ellipsoid.WGS84)
  if (intersections) {
    return Ray.getPoint(ray, intersections.start)
  }
  // 相机方向不指向地球仪，因此使用椭球地平线点作为焦点。
  return IntersectionTests.grazingAltitudeLocation(ray, Ellipsoid.WGS84)
}

// 获取相机位置
function getCameraPosition(camera: Camera, focus: Cartesian3, scalar: number) {
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
