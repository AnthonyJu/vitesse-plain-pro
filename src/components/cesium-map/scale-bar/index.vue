<template>
  <div
    v-show="isReady"
    class="flex-bc gap-8px rounded-2px bg-#0006 text-12px text-white"
    position="absolute bottom-10px left-10px z-10"
    p="x-5px y-1px"
  >
    <!-- 经纬度 -->
    <div v-if="lnglat" class="w-195px">{{ lnglat }}</div>

    <!-- 比例尺 -->
    <div v-if="lineWidth" class="flex-col-center">
      <div>{{ scaleText }}</div>
      <div class="scale-bar__line" :style="{ width: `${lineWidth}px` }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Cartesian2,
  Math as CesiumMath,
  defined,
  EllipsoidGeodesic,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
} from 'cesium'
import { useCesium } from '@/composables/use-cesium'

const lnglat = ref('')
const scaleText = ref('')
const lineWidth = ref(0)

const { viewer, isReady, onViewerReady } = useCesium()

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

// viewer 就绪后初始化
onViewerReady((v) => {
  initMouseMove(v)
  v.scene.postRender.addEventListener(cesiumScale)
})

function initMouseMove(v: import('cesium').Viewer) {
  const handler = new ScreenSpaceEventHandler(v.scene.canvas)

  handler.setInputAction((e: any) => {
    const scene = v.scene
    const cartesian = scene.pickPosition(e.endPosition)
    if (cartesian) {
      const cartographic = scene.globe.ellipsoid.cartesianToCartographic(cartesian)
      if (cartographic) {
        const lng = CesiumMath.toDegrees(cartographic.longitude)
        const lat = CesiumMath.toDegrees(cartographic.latitude)
        lnglat.value = `${lng.toFixed(8)}°E ${lat.toFixed(8)}°N`
      }
    }
  }, ScreenSpaceEventType.MOUSE_MOVE)
}

function cesiumScale() {
  if (!viewer.value) return

  const scene = viewer.value.scene
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

  const leftCartographic = globe.ellipsoid.cartesianToCartographic(leftPosition!)
  const rightCartographic = globe.ellipsoid.cartesianToCartographic(rightPosition!)
  const geodesic = new EllipsoidGeodesic()
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
    scaleText.value = distance! >= 1000 ? `${distance! / 1000} km` : `${distance!} m`
    lineWidth.value = (distance! / pixelDistance) | 0
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
