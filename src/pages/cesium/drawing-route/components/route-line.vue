<template>
  <VcEntity>
    <VcGraphicsPolyline
      :width="3"
      :positions="positions"
      material="#0ff"
    />
  </VcEntity>

  <VcEntity v-if="underground">
    <VcGraphicsPolyline
      :width="3"
      :positions="underground"
      :material="dashMaterial"
      :depth-fail-material="dashMaterial"
      clamp-to-ground
    />
  </VcEntity>
</template>

<script setup lang="ts">
// @ts-expect-error no exported
import { useVueCesium, VcEntity, VcGraphicsPolyline } from 'vue-cesium'

const { positions } = defineProps<{
  positions: [Position, Position]
}>()

const underground = ref<[Cesium.Cartesian3, Cesium.Cartesian3]>()
const dashMaterial = new Cesium.PolylineDashMaterialProperty({ color: Cesium.Color.RED })

const vc = useVueCesium(DEFAULT_CESIUM_ID)

watch(
  () => positions,
  async (newVal) => {
    if (!newVal || newVal.length < 2) {
      underground.value = undefined
      return
    }

    // 创建两条射线，分别从起点发向终点和终点发向起点
    // 判断射线与地形的交点，将两个交点组合成新的线段进行展示

    // 转换为笛卡尔坐标系
    const start = Cesium.Cartesian3.fromDegrees(
      newVal[0].lng,
      newVal[0].lat,
      newVal[0].height,
    )
    const end = Cesium.Cartesian3.fromDegrees(
      newVal[1].lng,
      newVal[1].lat,
      newVal[1].height,
    )
    // 定义起点和终点射线朝向向量
    const startToEnd = new Cesium.Cartesian3()
    const endToStart = new Cesium.Cartesian3()
    Cesium.Cartesian3.subtract(end, start, startToEnd)
    Cesium.Cartesian3.subtract(start, end, endToStart)
    // 创建射线
    const startRay = new Cesium.Ray(start, startToEnd)
    const endRay = new Cesium.Ray(end, endToStart)
    // 计算射线与地形的交点
    // Cesium.Scene.globe.pick() 方法用于计算射线与地形的交点，第一个参数是射线对象，第二个参数是场景对象，返回返回一个相交笛卡尔坐标系的点对象
    // Cesium.Cartographic.fromCartesian() 方法用于将笛卡尔坐标系的点对象转换为经纬度坐标系的点对象
    const startIntersection = vc.viewer.scene.globe.pick(startRay, vc.viewer.scene)
    const endIntersection = vc.viewer.scene.globe.pick(endRay, vc.viewer.scene)
    if (startIntersection && endIntersection) {
      underground.value = [startIntersection, endIntersection]
    }
  },
  {
    immediate: true,
    deep: true,
    flush: 'post',
  },
)
</script>
