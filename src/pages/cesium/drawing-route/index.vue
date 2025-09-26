<template>
  <CesiumMap :class="{ 'take-off-cursor': !takeOffPoint }" @ready="handleReady">
    <TakeOffPoint :position="takeOffPoint" />

    <RouteLine
      v-for="(item, index) in routeLines"
      :key="`line-${index}`"
      :positions="item"
    />

    <RoutePoint
      v-for="item in points.slice(2)"
      :key="`point-${JSON.stringify(item)}`"
      :position="item"
    />
  </CesiumMap>
</template>

<script setup lang="ts">
import type { VcReadyObject } from 'vue-cesium/es/utils/types'
import RouteLine from './components/route-line.vue'
import RoutePoint from './components/route-point.vue'

import TakeOffPoint from './components/take-off-point.vue'

provide('cesiumId', 'cesiumId')

let viewer: Cesium.Viewer
function handleReady(vc: VcReadyObject) {
  viewer = vc.viewer
  onMapClick()
}

const safeHeight = 200
const points = ref<Cesium.Cartesian3[]>([])
const routeLines = ref<[Cesium.Cartesian3, Cesium.Cartesian3][]>([])
const takeOffPoint = computed(() => points.value[0])

// 监听地图点击事件
function onMapClick() {
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction((e: any) => {
    const picked = viewer.scene.pickPosition(e.position)
    if (Cesium.defined(picked)) {
      if (points.value.length === 0) points.value.push(picked)

      // 获取地表法向量（单位向量，垂直地面朝外）
      const normal = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(picked)
      // 将单位向量乘以高度，得到方向向量
      const offset = Cesium.Cartesian3.multiplyByScalar(normal, safeHeight, new Cesium.Cartesian3())
      // 将偏移向量加到原点上
      const result = Cesium.Cartesian3.add(picked, offset, new Cesium.Cartesian3())
      points.value.push(result)

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
