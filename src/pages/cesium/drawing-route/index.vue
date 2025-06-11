<template>
  <CesiumMap :class="{ 'take-off-cursor': !takeOffPoint }">
    <TakeOffPoint :position="takeOffPoint" />

    <RoutePoint
      v-for="item in points.slice(2)"
      :key="`point-${JSON.stringify(item)}`"
      :position="item"
    />

    <RouteLine
      v-for="(item, index) in routeLines"
      :key="`line-${index}`"
      :positions="item"
    />
  </CesiumMap>
</template>

<script setup lang="ts">
// @ts-expect-error useVueCesium
import { useVueCesium } from 'vue-cesium'
import RouteLine from './components/route-line.vue'
import RoutePoint from './components/route-point.vue'
import TakeOffPoint from './components/take-off-point.vue'

let viewer: Cesium.Viewer

onMounted(() => {
  const vc = useVueCesium(DEFAULT_CESIUM_ID)
  vc.creatingPromise.then(() => {
    viewer = vc.viewer
    onMapClick()
  })
})

const safeHeight = 120
const points = ref<Position[]>([])
const routeLines = ref<[Position, Position][]>([])
const takeOffPoint = computed(() => points.value[0])

// 监听地图点击事件
function onMapClick() {
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction((e: any) => {
    const picked = viewer.scene.pickPosition(e.position)
    if (Cesium.defined(picked)) {
      // 转换成经纬度
      const cartographic = Cesium.Cartographic.fromCartesian(picked)
      const lng = Cesium.Math.toDegrees(cartographic.longitude)
      const lat = Cesium.Math.toDegrees(cartographic.latitude)
      const height = cartographic.height

      if (points.value.length === 0) points.value.push({ lng, lat, height })
      points.value.push({ lng, lat, height: height + safeHeight })

      const len = points.value.length
      routeLines.value.push([points.value[len - 2], points.value[len - 1]])
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}
</script>

<style lang="scss" scoped>
.take-off-cursor {
  cursor: url("@/assets/cesium/take-off.svg") 24 24, auto;
}
</style>
