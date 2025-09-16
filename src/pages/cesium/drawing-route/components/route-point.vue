<template>
  <VcEntity
    v-if="position"
    :position="position"
    @mouseout="image = FlyDot"
    @mouseover="image = FlyDotActive"
  >
    <VcGraphicsBillboard
      :image="image"
      :height-reference="0"
      :pixel-offset="{ x: 0, y: -19 }"
      :disable-depth-test-distance="Number.POSITIVE_INFINITY"
    />
  </VcEntity>

  <!-- 相对高度 -->
  <template v-if="positions">
    <DistanceLabel :positions="positions" />
    <VcEntity>
      <VcGraphicsPolyline
        :width="3"
        :positions="positions"
        :material="dashMaterial"
      />
    </VcEntity>
  </template>
</template>

<script setup lang="ts">
// @ts-expect-error no exported
import { useVueCesium, VcEntity, VcGraphicsBillboard, VcGraphicsPolyline } from 'vue-cesium'
import FlyDotActive from '@/assets/cesium/fly-dot-active.svg'
import FlyDot from '@/assets/cesium/fly-dot.svg'
import DistanceLabel from './distance-label.vue'

const { position } = defineProps<{
  position: Cesium.Cartesian3
}>()

const image = ref(FlyDot)
const cesiumId = inject('cesiumId')
const vc = useVueCesium(cesiumId)
const dashMaterial = new Cesium.PolylineDashMaterialProperty({ color: Cesium.Color.WHITE })

const positions = ref<[Cesium.Cartesian3, Cesium.Cartesian3]>()

onMounted(() => {
  // 获取地表法向量（单位向量，朝天）
  const normal = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(position)

  // 反向得到朝地面的方向
  const downDirection = Cesium.Cartesian3.negate(normal, new Cesium.Cartesian3())

  // 构建射线
  const ray = new Cesium.Ray(position, downDirection)

  // 获取射线与地表的交点
  const intersection = vc.viewer.scene.globe.pick(ray, vc.viewer.scene) as Cesium.Cartesian3

  positions.value = [position, intersection]
})
</script>
