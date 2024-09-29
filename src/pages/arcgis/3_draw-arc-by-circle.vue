<template>
  <div id="map" full bg="light dark:dark" />
</template>

<script setup lang='ts'>
import Circle from '@arcgis/core/geometry/Circle'
import Point from '@arcgis/core/geometry/Point'
import Polygon from '@arcgis/core/geometry/Polygon'
import Graphic from '@arcgis/core/Graphic'
import Map from '@arcgis/core/Map'
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol'
import MapView from '@arcgis/core/views/MapView'
import '@arcgis/core/assets/esri/themes/light/main.css'

onMounted(() => {
  // 创建 Map 实例
  const map = new Map({ basemap: 'streets-navigation-vector' })

  // 创建 MapView 实例
  const view = new MapView({
    container: 'map',
    map,
    center: [120.38, 36.06],
    zoom: 13,
    ui: {
      components: [],
    },
  })

  // 创建一个circle，并规定生成圆的点数
  const circle = new Circle({
    center: new Point({
      longitude: 120.38,
      latitude: 36.06,
    }),
    geodesic: true,
    radius: 2000,
    numberOfPoints: 360,
  })

  // 获取rings
  const rings = circle.rings[0]

  // 模拟圆弧其角度
  const startAngle = 20
  const endAngle = 80

  // 生成圆弧的rings
  const arcRings = [[...rings.slice(startAngle, endAngle + 1), [120.38, 36.06]]]

  // 创建一个graphic
  const graphic = new Graphic({
    geometry: new Polygon({
      rings: arcRings,
    }),
    symbol: new SimpleFillSymbol({
      color: [255, 0, 0, 0.5],
      outline: {
        color: [255, 0, 0, 0.5],
        width: 2,
      },
    }),
  })

  // 添加扇形到地图
  view.graphics.add(graphic)
})
</script>
