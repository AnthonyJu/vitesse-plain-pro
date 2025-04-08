<template>
  <div
    v-if="show"
    class="flex-bc gap-6px rounded-2px bg-#0006 text-12px text-white"
    position="absolute bottom-10px left-10px z-10"
    p="x-6xp y-2xp"
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
import { DEFAULT_CESIUM_ID } from '@/constants'
import { Cartesian2, defined, EllipsoidGeodesic, Math, ScreenSpaceEventHandler, ScreenSpaceEventType } from 'cesium'
// @ts-expect-error no exported
import { useVueCesium } from 'vue-cesium'

const { cesiumId = DEFAULT_CESIUM_ID } = defineProps<{
  cesiumId?: string
}>()

const show = ref(false)

const vc = useVueCesium(cesiumId)
vc.creatingPromise.then(() => {
  show.value = true
  onMouseMove()
  vc.viewer.scene.postRender.addEventListener(cesiumScale)
})

const lnglat = ref('')

function onMouseMove() {
  const handler = new ScreenSpaceEventHandler(vc.viewer.scene.canvas)

  handler.setInputAction((e: any) => {
    const scene = vc.viewer.scene
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
  const scene = vc.viewer.scene
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
