<template>
  <div id="viewing-frustum-map" class="relative full" bg="light dark:dark">
    <CameraView :base-info="cameraBaseInfo" @update-frustum="updateFrustum" />
  </div>
</template>

<script setup lang='ts'>
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import CameraView from './components/CameraView.vue'

const { map } = useArcgis3D('viewing-frustum-map')

// 物理相机基本信息
const cameraBaseInfo = ref({
  position: {
    x: 120.3800165,
    y: 36.06118548,
    z: 100,
  },
  heading: 330, // 水平旋转角度，0为正北
  tilt: 65, // 垂直旋转角度，0为水平视角，90为垂直向下
  zoom: 2, // 相机缩放级别
  // 相机焦距范围，单位为毫米
  focalLength: [6, 240],
  // 传感器尺寸，单位为毫米
  sensorWidth: 15.6,
  sensorHeight: 8.8,
})

const viewLineLayer = new GraphicsLayer({
  title: '视线图层',
})

const viewGonLayer = new GraphicsLayer({
  title: '视域图层',
  elevationInfo: {
    mode: 'on-the-ground',
  },
})

map.addMany([viewLineLayer, viewGonLayer])

function updateFrustum(frustumInfo: any) {
  const isEveryExist = frustumInfo.boundingBox.every(Boolean)
  if (isEveryExist) {
    // 绘制视锥体边框
    viewLineLayer.graphics.removeAll()
    // 视线：摄像机点与每个角点连线
    frustumInfo.boundingBox.forEach((point: any) => {
      viewLineLayer.graphics.add({
        geometry: {
          type: 'polyline',
          paths: [
            [
              [
                cameraBaseInfo.value.position.x,
                cameraBaseInfo.value.position.y,
                cameraBaseInfo.value.position.z,
              ],
              [...point],
            ],
          ],
        },
        symbol: {
          type: 'simple-line',
          color: 'yellow',
          style: 'dash',
          width: 1,
        },
      })
    })

    viewGonLayer.removeAll()
    // boundingBox 边框
    viewGonLayer.graphics.add({
      geometry: {
        type: 'polygon',
        rings: [[...frustumInfo.boundingBox]],
      },
      symbol: {
        type: 'simple-fill',
        color: 'rgba(255,255,0,0.2)',
        outline: {
          color: 'yellow',
          width: 1,
        },
      },
    })
  }
}
</script>
