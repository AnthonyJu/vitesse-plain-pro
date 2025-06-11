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

  <VcEntity
    v-for="(poly, index) in polygonPoints"
    :key="index"
  >
    <VcGraphicsPolygon
      :hierarchy="poly"
      :material="[255, 0, 0, 125]"
      :per-position-height="true"
      outline
      outline-color="[255, 0, 0]"
    />
  </VcEntity>
</template>

<script setup lang="ts">
// @ts-expect-error no exported
import { useVueCesium, VcEntity, VcGraphicsPolygon, VcGraphicsPolyline } from 'vue-cesium'

type Positions = [Position, Position]

const { positions } = defineProps<{
  positions: Positions
}>()

const safeHeight = 20
const vc = useVueCesium(DEFAULT_CESIUM_ID)

const underground = ref<[Cesium.Cartesian3, Cesium.Cartesian3]>()
const dashMaterial = new Cesium.PolylineDashMaterialProperty({ color: Cesium.Color.RED })
const polygonPoints = ref<Cesium.Cartesian3[][]>([])

watch(
  () => positions,
  async (newVal) => {
    // 创建两条射线，分别从起点发向终点和终点发向起点
    // 判断射线与地形的交点，将两个交点组合成新的线段进行展示
    // 二分法递进
    // • 在 C→A 方向上设置一个 start = 0, end = AC 距离；
    // • 在 [start, end] 区间用二分法查找最后一个点，使得从该点垂直向下高度差 ≤ 20m；

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
    const startIntersection = vc.viewer.scene.globe.pick(startRay, vc.viewer.scene)
    const endIntersection = vc.viewer.scene.globe.pick(endRay, vc.viewer.scene)

    // 判断交点是否在起点和终点之间
    const isBetween = (point: Cesium.Cartesian3, a: Cesium.Cartesian3, b: Cesium.Cartesian3) => {
      const ab = Cesium.Cartesian3.subtract(b, a, new Cesium.Cartesian3())
      const ap = Cesium.Cartesian3.subtract(point, a, new Cesium.Cartesian3())
      const dot = Cesium.Cartesian3.dot(ap, ab)
      return dot > 0 && dot < Cesium.Cartesian3.magnitudeSquared(ab)
    }

    const isValidIntersection
      = startIntersection && endIntersection
        && isBetween(startIntersection, start, end)
        && isBetween(endIntersection, end, start)

    if (startIntersection && endIntersection && isValidIntersection) {
      const samplePoints = (origin: Cesium.Cartesian3, intersection: Cesium.Cartesian3) => {
        // 计算从交点指向起点的单位向量
        const direction = Cesium.Cartesian3.subtract(origin, intersection, new Cesium.Cartesian3())
        Cesium.Cartesian3.normalize(direction, direction)

        const totalDistance = Cesium.Cartesian3.distance(origin, intersection)
        let low = 0
        let high = totalDistance
        let result = intersection
        let lastValidGround: Cesium.Cartesian3 | undefined

        // 使用二分查找在 origin 到 intersection 的路径上定位
        // 最后一个高度差 <= safeHeight 的采样点
        while (high - low > 1) {
          const mid = (low + high) / 2

          // 计算采样点位置
          const offset = Cesium.Cartesian3.multiplyByScalar(direction, mid, new Cesium.Cartesian3())
          const samplePoint = Cesium.Cartesian3.add(intersection, offset, new Cesium.Cartesian3())

          // 计算该点的法线方向并向下构建射线
          const normal = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(samplePoint, new Cesium.Cartesian3())
          const downDir = Cesium.Cartesian3.negate(normal, new Cesium.Cartesian3())
          const downRay = new Cesium.Ray(samplePoint, downDir)

          // 获取该射线与地形的交点
          const hit = vc.viewer.scene.globe.pick(downRay, vc.viewer.scene)

          // 如果未命中地形，则认为该点不可靠，调整 low 继续搜索
          if (!hit) {
            low = mid
            continue
          }

          // 计算该点与地形交点之间的距离
          const heightDelta = Cesium.Cartesian3.distance(samplePoint, hit)

          // 如果高度差小于等于阈值，更新结果并向更远方向查找
          if (heightDelta <= safeHeight) {
            result = samplePoint
            lastValidGround = hit
            low = mid
          }
          else {
            // 否则向近处缩小查找范围
            high = mid
          }
        }

        return { final: result, ground: lastValidGround }
      }

      const result1 = samplePoints(start, startIntersection)
      const result2 = samplePoints(end, endIntersection)

      underground.value = [result1.final, result2.final]

      // TODO 有问题
      // polygonPoints.value = [
      //   [result1.final, result1.ground, startIntersection],
      //   [result2.final, result2.ground, endIntersection],
      // ]
    }
  },
  {
    immediate: true,
    deep: true,
    flush: 'post',
  },
)
</script>
