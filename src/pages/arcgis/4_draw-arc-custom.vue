<template>
  <div id="map" full bg="light dark:dark" />
</template>

<route lang='yaml'>
meta:
  name: 自定义方法 绘制圆弧
</route>

<script setup lang="ts">
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import Graphic from '@arcgis/core/Graphic'
import Polygon from '@arcgis/core/geometry/Polygon'
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol'
import * as webMercatorUtils from '@arcgis/core/geometry/support/webMercatorUtils'
import '@arcgis/core/assets/esri/themes/light/main.css'

/**
 *  生成圆弧的 rings
 * @param startAngle 开始角度
 * @param endAngle 结束角度
 * @param radius 半径，千米
 * @param center 圆心
 */
function generateArc(
  startAngle: number,
  endAngle: number,
  radius: number,
  center: [number, number],
): [number, number][][] {
  const pointNum: number = 100
  const points: [number, number][] = []
  let sin: number, cos: number, x: number, y: number, angle: number
  for (let i: number = 0; i <= pointNum; i++) {
    angle = startAngle + ((endAngle - startAngle) * i) / pointNum
    sin = Math.sin((angle * Math.PI) / 180)
    cos = Math.cos((angle * Math.PI) / 180)
    x = center[0] + radius / 100 * sin
    y = center[1] + radius / 100 * cos
    points.push([x, y])
  }
  points.push(center)
  return [points]
}

onMounted(() => {
  // 创建 Map 实例
  const map = new Map({ basemap: 'streets-navigation-vector' })

  // 创建 MapView 实例
  const view = new MapView({
    container: 'map',
    map,
    center: [120.38, 36.06],
    zoom: 13,

  })

  // 获取圆弧的 rings
  const arcRings = generateArc(70, 110, 2, [120.38, 36.06])
  // 创建一个 graphic
  const graphic = new Graphic({
    geometry: webMercatorUtils.geographicToWebMercator(
      new Polygon({
        rings: arcRings,
        spatialReference: {
          wkid: 4326,
        },
      }),
    ),
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
