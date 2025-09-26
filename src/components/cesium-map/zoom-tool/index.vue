<template>
  <div
    v-if="show"
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
// @ts-expect-error no exported
import { useVueCesium } from 'vue-cesium'

const { center } = defineProps<{
  center?: {
    destination: Cesium.Cartesian3
    orientation: {
      heading: number
      pitch: number
      roll: number
    }
  }
}>()

const cesiumId = inject('cesiumId') as string

const show = ref(false)
const vc = useVueCesium(cesiumId)
vc.creatingPromise.then(() => {
  show.value = true
})

// 复原地图视角
function resetMap() {
  vc.viewer.camera.flyTo({
    ...(center || {
      destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 15000000),
      orientation: {
        heading: Cesium.Math.toRadians(360),
        pitch: Cesium.Math.toRadians(-90),
        roll: Cesium.Math.toRadians(0),
      },
    }),
    duration: 1,
  })
}

// TODO 缩放时以设定的最大和最小高度为基准，进行动态缩放，不能超过最大和最小高度

// 放大
function zoomIn() {
  const scene = vc.viewer.scene
  const camera = scene.camera

  // 如果是3D场景，使用相机焦点作为缩放中心
  if (scene.mode === Cesium.SceneMode.SCENE3D) {
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
  const scene = vc.viewer.scene
  const camera = scene.camera

  // 如果是3D场景，使用相机焦点作为缩放中心
  if (scene.mode === Cesium.SceneMode.SCENE3D) {
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
function getCameraFocus(scene: Cesium.Scene) {
  const ray = new Cesium.Ray(scene.camera.positionWC, scene.camera.directionWC)
  const intersections = Cesium.IntersectionTests.rayEllipsoid(ray, Cesium.Ellipsoid.WGS84)
  if (intersections) {
    return Cesium.Ray.getPoint(ray, intersections.start)
  }
  // 相机方向不指向地球仪，因此使用椭球地平线点作为焦点。
  return Cesium.IntersectionTests.grazingAltitudeLocation(ray, Cesium.Ellipsoid.WGS84)
}

// 获取相机位置
function getCameraPosition(camera: Cesium.Camera, focus: Cesium.Cartesian3, scalar: number) {
  const cartesian3Scratch = new Cesium.Cartesian3()
  const direction = Cesium.Cartesian3.subtract(
    focus,
    camera.position,
    cartesian3Scratch,
  )
  const movementVector = Cesium.Cartesian3.multiplyByScalar(
    direction,
    scalar,
    cartesian3Scratch,
  )

  // 计算新的相机位置
  return Cesium.Cartesian3.add(camera.position, movementVector, cartesian3Scratch)
}
</script>
