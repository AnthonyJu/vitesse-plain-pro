<template>
  <div
    v-if="viewer"
    class="flex-bc rounded-2px bg-#0006 text-12px text-white"
  >
    <!-- 经纬度 -->
    <div v-if="lnglat" class="my-2px ml-6px w-190px">{{ lnglat }}</div>
    <!-- 比例尺 -->
    <div v-if="lineWidth" class="mx-6px my-2px flex-col-center">
      <div>{{ scaleText }}</div>
      <div class="scale-bar__line" :style="{ width: `${lineWidth}px` }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Viewer } from 'cesium'
import type { ShallowRef } from 'vue'
import { Cartesian2, defined, EllipsoidGeodesic, Math, ScreenSpaceEventHandler, ScreenSpaceEventType } from 'cesium'

const viewer = inject('viewer') as ShallowRef<Viewer | null>

watchOnce(viewer, () => {
  onMouseMove()
  viewer.value!.scene.postRender.addEventListener(cesiumScale)
})

const lnglat = ref('')

function onMouseMove() {
  const handler = new ScreenSpaceEventHandler(viewer.value!.scene.canvas)

  handler.setInputAction((e: any) => {
    const scene = viewer.value!.scene
    const cartesian = scene.pickPosition(e.endPosition)
    if (cartesian) {
      const cartographic = scene.globe.ellipsoid.cartesianToCartographic(cartesian)
      if (cartographic) {
        const lng = Math.toDegrees(cartographic.longitude)
        const lat = Math.toDegrees(cartographic.latitude)
        lnglat.value = `${lng.toFixed(8)}°E ${lat.toFixed(8)}°N`
      }
    }
  }, ScreenSpaceEventType.MOUSE_MOVE)
}

const scaleText = ref('')
const lineWidth = ref(0)

const geodesic = new EllipsoidGeodesic()
const distances = [
  1,
  2,
  3,
  5,
  10,
  20,
  30,
  50,
  100,
  200,
  300,
  500,
  1000,
  2000,
  3000,
  5000,
  10000,
  20000,
  30000,
  50000,
  100000,
  200000,
  300000,
  500000,
  1000000,
  2000000,
  3000000,
  5000000,
  10000000,
  20000000,
  30000000,
  50000000,
]

function cesiumScale() {
  const scene = viewer.value!.scene
  const width = scene.canvas.clientWidth
  const height = scene.canvas.clientHeight

  const left = scene.camera.getPickRay(new Cartesian2((width / 2) | 0, height - 1))
  const right = scene.camera.getPickRay(new Cartesian2((1 + width / 2) | 0, height - 1))

  if (!left || !right) {
    lineWidth.value = 0
    scaleText.value = ''
    return
  }

  const globe = scene.globe
  const leftPosition = globe.pick(left, scene)
  const rightPosition = globe.pick(right, scene)

  if (!defined(leftPosition) || !defined(rightPosition)) {
    lineWidth.value = 0
    scaleText.value = ''
    return
  }

  const leftCartographic = globe.ellipsoid.cartesianToCartographic(leftPosition)
  const rightCartographic = globe.ellipsoid.cartesianToCartographic(rightPosition)
  geodesic.setEndPoints(leftCartographic, rightCartographic)
  const pixelDistance = geodesic.surfaceDistance

  const maxBarWidth = 100
  let distance
  for (let i = distances.length - 1; !defined(distance) && i >= 0; --i) {
    if (distances[i] / pixelDistance < maxBarWidth) {
      distance = distances[i]
    }
  }

  if (defined(distance)) {
    scaleText.value = distance >= 1000 ? `${distance / 1000} km` : `${distance} m`
    lineWidth.value = (distance / pixelDistance) | 0
  }
  else {
    lineWidth.value = 0
    scaleText.value = ''
  }
}
</script>

<style lang="scss" scoped>
.scale-bar__line {
  position: relative;
  padding-top: 4px;

  &::after {
    position: absolute;
    bottom: 1px;
    left: 0;
    width: 100%;
    height: 6px;
    content: "";
    border: 1px solid #fff;
    border-top: none;
  }
}
</style>
