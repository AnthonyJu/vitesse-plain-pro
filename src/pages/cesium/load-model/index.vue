<template>
  <CesiumMap />
</template>

<script setup lang="ts">
import { Cartesian3, Entity, HeadingPitchRoll, Transforms } from 'cesium'

const { viewer, onViewerReady } = useCesium('cesiumId')

// 加载模型
onViewerReady(() => {
  // 模型位置
  const position = Cartesian3.fromDegrees(120.0744619, 36.0503706, 300)
  // 模型朝向
  const hpr = new HeadingPitchRoll(0, 0, 0)
  // 模型朝向四元数
  const orientation = Transforms.headingPitchRollQuaternion(position, hpr)

  const entity = new Entity({
    name: 'CesiumDrone',
    position,
    orientation,
    model: {
      uri: '/static/models/glb/CesiumDrone.glb',
      minimumPixelSize: 128, // 模型最小像素大小
      maximumScale: 20000, // 模型最大缩放比例
    },
  })

  // 添加模型
  viewer.value!.entities.add(entity)
  // 查看位置
  viewer.value!.camera.lookAt(position, new Cartesian3(0, 0, 1000))
})
</script>
