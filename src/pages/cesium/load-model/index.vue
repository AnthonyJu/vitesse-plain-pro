<template>
  <CesiumMap />
</template>

<script setup lang="ts">
// @ts-expect-error useVueCesium
import { useVueCesium } from 'vue-cesium'

let viewer: Cesium.Viewer

// 加载模型
function loadModel() {
  // 模型位置
  const position = Cesium.Cartesian3.fromDegrees(120.0744619, 36.0503706, 300)
  // 模型朝向
  const hpr = new Cesium.HeadingPitchRoll(0, 0, 0)
  // 模型朝向四元数
  const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr)

  const entity = new Cesium.Entity({
    name: 'CesiumDrone',
    position,
    orientation,
    model: {
      uri: '/models/glb/CesiumDrone.glb',
      minimumPixelSize: 128, // 模型最小像素大小
      maximumScale: 20000, // 模型最大缩放比例
    },
  })

  // 添加模型
  viewer.entities.add(entity)
  // 查看位置
  viewer.camera.lookAt(position, new Cesium.Cartesian3(0, 0, 1000))
}

onMounted(() => {
  const vc = useVueCesium(DEFAULT_CESIUM_ID)
  vc.creatingPromise.then(() => {
    viewer = vc.viewer
    loadModel()
  })
})
</script>
