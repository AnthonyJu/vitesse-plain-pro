<template>
  <CesiumMap>
    <ScaleBar />
    <ZoomController :center="center" />
  </CesiumMap>
</template>

<script setup>
import { DEFAULT_CESIUM_ID } from '@/constants'
import { Cartesian3, Math as CMath, Color, GeoJsonDataSource } from 'cesium'
import { useVueCesium } from 'vue-cesium'

const center = {
  destination: Cartesian3.fromDegrees(103.84, 31.15, 15000000),
  orientation: {
    heading: CMath.toRadians(360),
    pitch: CMath.toRadians(-90),
    roll: CMath.toRadians(0),
  },
}

onMounted(() => {
  const vc = useVueCesium(DEFAULT_CESIUM_ID)

  vc.creatingPromise.then(({ viewer }) => {
    // 设置地图视角
    viewer.camera.setView(center)

    // 加载GeoJson数据
    const noFlyZone = GeoJsonDataSource.load('/geojson/defaultNoFlyZone.json', {
      stroke: Color.RED,
      fill: Color.RED.withAlpha(0.5),
      strokeWidth: 3,
    })
    viewer.dataSources.add(noFlyZone)
  })
})
</script>
