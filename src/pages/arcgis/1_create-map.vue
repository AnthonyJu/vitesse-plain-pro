<template>
  <div id="map" full bg="light dark:dark" />
</template>

<route lang='yaml'>
meta:
  name: 创建地图
  fullContent: true
</route>

<script setup lang='ts'>
import Point from '@arcgis/core/geometry/Point'
import Graphic from '@arcgis/core/Graphic'
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol'

const arcgis = useArcgis('map')

onMounted(() => {
  const point = new Point({
    x: 120.38,
    y: 36.06,
    spatialReference: { wkid: 4326 },
  })
  arcgis.view?.graphics.add(new Graphic({
    geometry: point,
    symbol: new SimpleMarkerSymbol({
      color: [226, 119, 40],
      outline: {
        color: [255, 255, 255],
        width: 2,
      },
    }),
  }))

  arcgis.view!.on('click', (e) => {
    arcgis.view?.hitTest(e).then((res) => {
      // eslint-disable-next-line no-console
      console.log(res)
    })
  })
})
</script>

<style lang='scss' scoped>
::v-deep(.el-scrollbar__view) {
  width: 100%;
  height: 100%;
}
</style>
