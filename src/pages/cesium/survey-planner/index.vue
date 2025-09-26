<template>
  <CesiumMap @ready="handleReady" />
</template>

<script setup lang="ts">
import type { VcReadyObject } from 'vue-cesium/es/utils/types'

import * as turf from '@turf/turf'

provide('cesiumId', 'cesiumId')

let viewer: Cesium.Viewer
function handleReady(vc: VcReadyObject) {
  viewer = vc.viewer

  const polygon = [
    [116.3906, 39.9230],
    [116.3960, 39.9230],
    [116.3960, 39.9280],
    [116.3906, 39.9280],
    [116.3906, 39.9230],
  ]

  // 添加区域多边形
  viewer.entities.add({
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray(polygon.flat()),
      material: Cesium.Color.YELLOW.withAlpha(0.3),
      outline: true,
      outlineColor: Cesium.Color.YELLOW,
    },
  })

  // 飞行到区域
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(116.3933, 39.9255, 500),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0,
    },
    duration: 2,
  })

  const waypoints = generateSurveyWaypoints(polygon, {
    height: 100,
    overlap: 0.8,
    sidelap: 0.85,
    camera: {
      focalLength: 24,
      sensorWidth: 36,
      sensorHeight: 24,
    },
    heading: 0,
    extension: 0,
    pattern: 'serpentine',
  })

  // 添加航线Polyline
  viewer.entities.add({
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArray(waypoints.flat()),
      width: 2,
      material: Cesium.Color.RED,
      clampToGround: true,
    },
  })
}

function generateSurveyWaypoints(polygon, params) {
  const {
    height,
    overlap,
    sidelap,
    camera,
    heading = 0,
    extension = 0,
    pattern = 'serpentine',
  } = params

  // 1. footprint 计算 (米)
  const footprintW = (height * (camera.sensorWidth / 1000)) / (camera.focalLength / 1000)
  const footprintH = (height * (camera.sensorHeight / 1000)) / (camera.focalLength / 1000)

  const dLine = footprintW * (1 - sidelap)
  const dPhoto = footprintH * (1 - overlap)

  // 2. 直接用经纬度坐标
  const polyGeo = turf.polygon([polygon])
  const centroid = turf.centroid(polyGeo).geometry.coordinates

  function generatePattern(angle) {
    const rotatedPoly = turf.transformRotate(polyGeo, -angle, { pivot: centroid })
    const [minX, minY, maxX, maxY] = turf.bbox(rotatedPoly)

    const lines = []
    for (let x = minX - extension; x <= maxX + extension; x += dLine / 111320) {
      // 注意：1 度经度 ≈ 111.32 km，所以要把米转换成度
      const baseLine = turf.lineString([[x, minY - 1], [x, maxY + 1]])
      const intersects = turf.lineIntersect(baseLine, rotatedPoly)

      if (intersects.features.length >= 2) {
        const sorted = intersects.features
          .map(f => f.geometry.coordinates)
          .sort((a, b) => a[1] - b[1])
        const seg = turf.lineString([sorted[0], sorted[sorted.length - 1]])
        lines.push(seg)
      }
    }

    let waypoints = []
    lines.forEach((line, i) => {
      const len = turf.length(line, { units: 'meters' })
      const step = Math.max(1, dPhoto)

      const pts = []
      for (let d = 0; d <= len; d += step) {
        const pt = turf.along(line, d, { units: 'meters' })
        pts.push(pt.geometry.coordinates)
      }
      if (pattern === 'serpentine' && i % 2 === 1) pts.reverse()
      waypoints = waypoints.concat(pts)
    })

    const rotatedWaypoints = turf.featureCollection(waypoints.map(c => turf.point(c)))
    const finalPts = turf.transformRotate(rotatedWaypoints, angle, { pivot: centroid })
    return finalPts.features.map(f => f.geometry.coordinates)
  }

  return (pattern === 'serpentine')
    ? generatePattern(heading)
    : [...generatePattern(heading), ...generatePattern(heading + 90)]
}
</script>
