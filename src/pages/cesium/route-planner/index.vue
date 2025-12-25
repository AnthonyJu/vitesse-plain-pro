<template>
  <div class="full flex bg-default">
    <div class="h-full flex-col flex-1">
      <CesiumMap class="flex-1 overflow-hidden" />

      <div class="p-15px">
        <div class="text-18px font-900">航信信息</div>
        <div class="mt-15px max-h-135px gap-15px overflow-auto grid-fill-260px">
          <div>区域面积：{{ result?.areaSqMeters }} m²</div>
          <div>航线数量：{{ result?.numOfStrips }} 条</div>
          <div>航线间距：{{ result?.distBetweenLines }} m</div>
          <div>飞行距离：{{ result?.flightDistance }} km</div>
          <div>飞行时间：{{ result?.flightTime }}</div>
          <div>地面分辨率：{{ result?.groundResolution }} cm/px</div>
          <div>照片地面覆盖：{{ result?.footprint.width }} x {{ result?.footprint.height }} m</div>
          <div>照片数量：{{ result?.pictures }} 张</div>
          <div>拍照频率：{{ result?.photoIntervalSec }} s</div>
          <div>照片间隔：{{ result?.distBetweenImages }} m</div>
        </div>
      </div>
    </div>

    <div class="h-full flex-col">
      <el-form :model="form" label-width="120px" class="m-10px">
        <el-tabs model-value="first" type="card">
          <el-tab-pane label="基础设置" name="first">
            <el-form-item label="航线规划类型">
              <el-select v-model="form.flightPattern">
                <el-option label="S 形" value="s-shape" />
                <el-option label="井字形" value="grid-shape" />
              </el-select>
            </el-form-item>
            <el-form-item label="飞行高度(m)">
              <el-input-number v-model.number="form.altitude" :step="10" />
            </el-form-item>
            <el-form-item label="前向重叠率(%)">
              <el-input-number v-model.number="form.frontOverlap" :step="5" />
            </el-form-item>
            <el-form-item label="侧向重叠率(%)">
              <el-input-number v-model.number="form.sideOverlap" :step="5" />
            </el-form-item>
            <el-form-item label="航线方向(度)">
              <el-input-number v-model.number="form.flightDirectionDeg" :step="5" />
            </el-form-item>
            <el-form-item label="飞行速度(m/s)">
              <el-input-number v-model.number="form.flightSpeed" :step="5" />
            </el-form-item>
            <el-form-item label="延长线长度(m)">
              <el-input-number v-model.number="form.extensionCord" :step="10" />
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="相机参数" name="second">
            <el-form-item label="相机型号">
              <el-select v-model="form.camera" value-key="id" placeholder="请选择相机型号">
                <el-option
                  v-for="item in cameraList"
                  :key="item.value.toString()"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="焦距(mm)">
              <el-input-number v-model.number="form.camera.focalLengthMm" />
            </el-form-item>
            <el-form-item label="传感器宽度(mm)">
              <el-input-number v-model.number="form.camera.sensorWidthMm" />
            </el-form-item>
            <el-form-item label="传感器高度(mm)">
              <el-input-number v-model.number="form.camera.sensorHeightMm" />
            </el-form-item>
            <el-form-item label="图像宽度(px)">
              <el-input-number v-model.number="form.camera.imageWidthPx" />
            </el-form-item>
            <el-form-item label="图像高度(px)">
              <el-input-number v-model.number="form.camera.imageHeightPx" />
            </el-form-item>
            <el-form-item label="照片拍摄方式">
              <el-select v-model="form.camera.triggerType">
                <el-option label="按飞行距离" value="CAM_TRIGG_DIST" />
              </el-select>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>

      <!-- <el-button class="mx-10px w-auto" type="success" @click="generate">应用</el-button> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Viewer } from 'cesium'
import type { MissionResult, PlanParams } from './generate-mission-route'
import { Cartesian3, Math as CesiumMath, Color, HeightReference, VerticalOrigin } from 'cesium'
import EndPng from '@/assets/cesium/end.png'
import PhotoPng from '@/assets/cesium/photo.png'
import PointPng from '@/assets/cesium/point.png'
import StartPng from '@/assets/cesium/start.png'
import { generateMissionRoute } from './generate-mission-route'

const { onViewerReady } = useCesium('cesiumId')

let viewer: Viewer

// 加载模型
onViewerReady((_viewer) => {
  viewer = _viewer

  viewer.camera.setView({
    destination: Cartesian3.fromDegrees(120.358644, 36.715060, 2000),
    orientation: {
      heading: CesiumMath.toRadians(0),
      pitch: CesiumMath.toRadians(-90),
      roll: 0,
    },
  })

  // // 点击获取坐标
  // const handler = new ScreenSpaceEventHandler(viewer.scene.canvas)
  // handler.setInputAction((movement) => {
  //   const cartesian = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid)
  //   if (cartesian) {
  //     const cartographic = Cartographic.fromCartesian(cartesian)
  //     const lon = CesiumMath.toDegrees(cartographic.longitude)
  //     const lat = CesiumMath.toDegrees(cartographic.latitude)
  //     console.log(`${lon}, ${lat}`)
  //   }
  // }, ScreenSpaceEventType.LEFT_CLICK)

  generateRoute()
})

const cameraList = [
  {
    label: '索尼 ILCE-7R',
    value: {
      id: 'sony_ilce7r',
      focalLengthMm: 35,
      sensorWidthMm: 35.8,
      sensorHeightMm: 23.9,
      imageWidthPx: 7360,
      imageHeightPx: 4912,
      triggerType: 'CAM_TRIGG_DIST',
    },
  },
  {
    label: '大疆御2 专业版',
    value: {
      id: 'dji_mavic_2',
      focalLengthMm: 28,
      sensorWidthMm: 12.7,
      sensorHeightMm: 9.6,
      imageWidthPx: 5472,
      imageHeightPx: 3648,
      triggerType: 'CAM_TRIGG_DIST',
    },
  },
  // {
  //   label: '大疆御3',
  //   value: {
  //     focalLengthMm: 28,
  //     sensorWidthMm: 32.2,
  //     sensorHeightMm: 8.8,
  //     imageWidthPx: 5472,
  //     imageHeightPx: 3648,
  //     triggerType: 'CAM_TRIGG_DIST',
  //   },
  // },
]

const form = ref<PlanParams>({
  polygon: [
    [
      [120.35864421632866, 36.71737770084022],
      [120.35547511688443, 36.71563167335798],
      [120.35902783498854, 36.71253186518270],
      [120.36188565210843, 36.71462766632465],
      [120.36039941397206, 36.71723496870541],
      [120.35864421632866, 36.71737770084022],
    ],
  ],
  altitude: 200,
  frontOverlap: 80,
  sideOverlap: 85,
  flightDirectionDeg: 0,
  flightSpeed: 20,
  extensionCord: 200,
  flightPattern: 's-shape',
  camera: {
    id: 'sony_ilce7r',
    focalLengthMm: 35,
    sensorWidthMm: 35.8,
    sensorHeightMm: 23.9,
    imageWidthPx: 7360,
    imageHeightPx: 4912,
    triggerType: 'CAM_TRIGG_DIST',
  },
})

const debounceFn = useDebounceFn(() => generateRoute(), 500)
watch(form, debounceFn, { deep: true })

const result = ref<MissionResult>()

function generateRoute() {
  const res = generateMissionRoute({
    ...form.value,
    frontOverlap: form.value.frontOverlap / 100,
    sideOverlap: form.value.sideOverlap / 100,
  })
  result.value = res
  onComplete(res)
}

function onComplete(result: MissionResult) {
  viewer.entities.removeAll()

  // 添加区域
  viewer.entities.add({
    polyline: {
      positions: form.value.polygon[0].map(p => Cartesian3.fromDegrees(p[0], p[1], 0)),
      width: 4,
      material: Color.RED,
      clampToGround: true,
    },
  })

  const height = form.value.altitude

  // 添加航线
  const points = result.waypoints.map(p =>
    Cartesian3.fromDegrees(p.coordinates[0], p.coordinates[1], height),
  )
  viewer.entities.add({
    polyline: {
      positions: points,
      width: 3,
      material: Color.YELLOW,
      clampToGround: true,
    },
  })

  // 添加航点点位
  result.waypoints.forEach((p, i) => {
    const image = i === 0 ? StartPng : (i === result.waypoints.length - 1 ? EndPng : PointPng)
    viewer.entities.add({
      position: Cartesian3.fromDegrees(p.coordinates[0], p.coordinates[1], height),
      billboard: {
        image,
        scale: 0.8, // 缩放比例（0.5～1.0 常用）
        verticalOrigin: VerticalOrigin.BOTTOM, // 图标对齐位置
        heightReference: HeightReference.CLAMP_TO_GROUND, // 贴地展示
        disableDepthTestDistance: Number.POSITIVE_INFINITY, // 防止被地形遮挡
      },
    })
  })

  // 添加拍照点位
  result.photoPoints.forEach((p) => {
    viewer.entities.add({
      position: Cartesian3.fromDegrees(p[0], p[1], height),
      billboard: {
        image: PhotoPng,
        scale: 0.6, // 缩放比例（0.5～1.0 常用）
        verticalOrigin: VerticalOrigin.CENTER, // 图标对齐位置
        heightReference: HeightReference.CLAMP_TO_GROUND, // 贴地展示
        disableDepthTestDistance: Number.POSITIVE_INFINITY, // 防止被地形遮挡
      },
    })
  })
}
</script>
