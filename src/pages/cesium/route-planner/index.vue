<template>
  <div class="full flex-col bg-default">
    <div class="min-h-0 flex flex-1">
      <!-- 地图区域（含浮层） -->
      <div class="relative flex-1">
        <CesiumMap class="h-full overflow-hidden" />

        <!-- 浮在地图上的模式切换 Tab -->
        <div class="absolute left-12px top-12px z-10">
          <el-tabs v-model="planningMode" type="card" class="mode-tabs" @tab-change="onModeChange">
            <el-tab-pane label="单次规划" name="single" />
            <el-tab-pane label="大范围规划" name="large-area" />
          </el-tabs>
        </div>

        <!-- 大范围规划快速切换（地图浮层） -->
        <div v-if="planningMode === 'large-area'" class="absolute right-12px top-52px z-10 w-200px">
          <div class="border border-gray-200 rounded-6px bg-white px-10px py-8px shadow-sm">
            <div class="mb-6px text-12px color-gray-600 font-600">快速切换区域</div>
            <el-select v-model="selectedDistrict" size="small" placeholder="选择青岛区市" @change="onDistrictChange">
              <el-option
                v-for="opt in districtOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </div>
        </div>

        <!-- 浮在地图上的操作按钮 -->
        <div class="absolute right-12px top-12px z-10 flex gap-8px">
          <el-button
            :type="isDrawing ? 'warning' : 'primary'"
            size="small"
            :disabled="isPlanning"
            @click="startDrawArea"
          >
            {{ isDrawing ? '绘制中...' : '绘制区域' }}
          </el-button>
          <el-button
            :type="showPhotoPoints ? 'primary' : 'default'"
            size="small"
            @click="onTogglePhotoPoints"
          >
            {{ showPhotoPoints ? '隐藏' : '显示' }}拍照点
          </el-button>
        </div>
      </div>

      <!-- 右侧参数面板 -->
      <div class="w-360px overflow-auto border-l-1px border-gray-200 bg-white">
        <RouteForm
          v-model:form="form"
          v-model:base-settings="baseSettings"
          :camera-list="cameraList"
        />
      </div>
    </div>

    <!-- 底部结果展示区 -->
    <div class="h-200px flex-center overflow-auto p-10px">
      <!-- 单次规划数据 -->
      <RouteInfo v-if="planningMode === 'single' && singleResult" :result="singleResult" />

      <!-- 大范围规划数据 -->
      <LargeAreaResult
        v-if="planningMode === 'large-area' && largeAreaResult"
        :result="largeAreaResult"
        :altitude="form.altitude"
        @highlight="handleSubRegionHighlight"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Viewer } from 'cesium'
import type { BaseSettings, MissionResult, PlanParams } from './generate-mission-route'
import type { LargeAreaResult as LargeAreaResultType, SubRegionResult } from './large-area-planner'
import { Cartesian3, Cartographic, Math as CesiumMath } from 'cesium'
import { DrawTool } from '@/components/cesium-map/draw-tool/use-draw'
import LargeAreaResult from './components/LargeAreaResult.vue'
import RouteForm from './components/RouteForm.vue'
import RouteInfo from './components/RouteInfo.vue'
import { QINGDAO_DISTRICTS } from './data/qingdao-districts'
import { CAMERA_LIST, DEFAULT_POLYGON, LARGE_AREA_POLYGON } from './data/route-constants'
import { generateMissionRoute } from './generate-mission-route'
import { planLargeArea } from './large-area-planner'
import { RouteRenderer } from './route-renderer'

const { onViewerReady } = useCesium('cesiumId')

// 规划模式
const planningMode = ref<'single' | 'large-area'>('single')

// 基础设置
const baseSettings = ref<BaseSettings>({
  maxFlightDistance: 100,
  maxFlightRadius: 8,
})

// 飞行参数表单
const form = ref<PlanParams>({
  polygon: DEFAULT_POLYGON,
  altitude: 200,
  frontOverlap: 80, // UI 显示 0-100，计算时转为 0-1
  sideOverlap: 85,
  flightDirectionDeg: 0,
  flightSpeed: 20,
  extensionCord: 200,
  flightPattern: 's-shape',
  camera: { ...CAMERA_LIST[0].value },
})

const cameraList = CAMERA_LIST

// 选中的区划（空字符串 = 自定义）
const selectedDistrict = ref('')

// 区划列表（含"自定义"选项）
const districtOptions = [
  { label: '自定义', value: '' },
  ...QINGDAO_DISTRICTS.map(d => ({ label: d.name, value: d.name })),
]

// 更新规划区域（从 DrawTool 绘制结果获取）
function updatePolygon(polygon: [number, number][]) {
  form.value.polygon = [polygon]
  selectedDistrict.value = ''
}

// 选择区划
function selectDistrict(name: string) {
  selectedDistrict.value = name
  if (!name) return
  const district = QINGDAO_DISTRICTS.find(d => d.name === name)
  if (district) {
    form.value.polygon = district.polygon
  }
}

// 渲染器
const renderer = new RouteRenderer()

// 显示控制
const showPhotoPoints = ref(false)

// 规划结果
const singleResult = ref<MissionResult>()
const largeAreaResult = ref<LargeAreaResultType>()

// 绘制状态
const isDrawing = ref(false)
// 规划中状态
const isPlanning = ref(false)

let viewer: Viewer
let drawTool: DrawTool | null = null

/** 计算多边形的中心点和大致范围 */
function getPolygonCenter(polygon: [number, number][][]): { lng: number, lat: number } {
  const ring = polygon[0]
  const sumLng = ring.reduce((s, p) => s + p[0], 0)
  const sumLat = ring.reduce((s, p) => s + p[1], 0)
  return { lng: sumLng / ring.length, lat: sumLat / ring.length }
}

/** 飞到指定多边形区域 */
function flyToPolygon(polygon: [number, number][][], altitude?: number) {
  if (!viewer) return
  const center = getPolygonCenter(polygon)
  // 计算多边形对角线距离来决定视角高度
  const ring = polygon[0]
  const lngSpan = Math.max(...ring.map(p => p[0])) - Math.min(...ring.map(p => p[0]))
  const latSpan = Math.max(...ring.map(p => p[1])) - Math.min(...ring.map(p => p[1]))
  const viewAlt = altitude ?? Math.max(lngSpan * 111000 * Math.cos(center.lat * Math.PI / 180), latSpan * 111000) * 2.5

  viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(center.lng, center.lat, viewAlt),
    orientation: {
      heading: CesiumMath.toRadians(0),
      pitch: CesiumMath.toRadians(-90),
      roll: 0,
    },
    duration: 1.5,
  })
}

// 加载
onViewerReady((_viewer) => {
  viewer = _viewer
  renderer.init(viewer)

  // 初始化 DrawTool
  drawTool = new DrawTool(viewer)

  generateRoute()

  // 初始飞到规划区域
  flyToPolygon(form.value.polygon)
})

// 防抖触发规划
const debounceFn = useDebounceFn(() => generateRoute(), 500)
watch(form, debounceFn, { deep: true })
watch(baseSettings, debounceFn, { deep: true })

/** 模式切换 */
function onModeChange() {
  if (planningMode.value === 'large-area') {
    // 如果已选中区划，优先用区划数据
    if (selectedDistrict.value) {
      selectDistrict(selectedDistrict.value)
    }
    else {
      form.value.polygon = LARGE_AREA_POLYGON
    }
  }
  else {
    form.value.polygon = DEFAULT_POLYGON
    selectedDistrict.value = ''
  }
  flyToPolygon(form.value.polygon)
  generateRoute()
}

/** 区划切换 */
function onDistrictChange(name: string) {
  selectDistrict(name)
  if (name) {
    // 选中具体区划，飞到对应区域（generateRoute 由 form watcher 自动触发）
    flyToPolygon(form.value.polygon)
  }
}

/** 生成航线 */
async function generateRoute() {
  if (!viewer || isPlanning.value)
    return

  isPlanning.value = true

  try {
    if (planningMode.value === 'single') {
      generateSingleRoute()
    }
    else {
      await generateLargeAreaRoute()
    }
  }
  catch (e) {
    console.error('规划失败:', e)
    ElMessage.error('规划执行失败，请检查参数')
  }
  finally {
    isPlanning.value = false
  }
}

/** 单次规划 */
function generateSingleRoute() {
  const res = generateMissionRoute({
    ...form.value,
    frontOverlap: form.value.frontOverlap / 100,
    sideOverlap: form.value.sideOverlap / 100,
  })
  singleResult.value = res
  largeAreaResult.value = undefined

  renderer.renderSingleResult(form.value.polygon, res, form.value.altitude)
}

/** 大范围规划 */
async function generateLargeAreaRoute() {
  // 让 UI 先渲染 loading 状态
  await new Promise(r => setTimeout(r, 50))

  const res = planLargeArea(
    {
      ...form.value,
      frontOverlap: form.value.frontOverlap / 100,
      sideOverlap: form.value.sideOverlap / 100,
      baseSettings: { ...baseSettings.value },
    },
    { ...baseSettings.value },
  )

  if (!res.subRegions.length) {
    ElMessage.warning('区域太小，无法拆分，请尝试扩大绘制范围')
    return
  }

  largeAreaResult.value = res
  singleResult.value = undefined

  renderer.renderLargeAreaResult(form.value.polygon, res, form.value.altitude)
}

/** 开始绘制区域 */
function startDrawArea() {
  if (!drawTool || !viewer)
    return

  isDrawing.value = true

  // 清除旧绘制结果
  drawTool.clearAll()

  // 设置完成回调
  drawTool.onComplete((result) => {
    if (result.type !== 'polygon' || result.positions.length < 3)
      return

    const coords: [number, number][] = result.positions.map((pos) => {
      const cartographic = Cartographic.fromCartesian(pos)
      const lng = CesiumMath.toDegrees(cartographic.longitude)
      const lat = CesiumMath.toDegrees(cartographic.latitude)
      return [lng, lat]
    })

    // 闭合多边形
    if (coords[0][0] !== coords[coords.length - 1][0]
      || coords[0][1] !== coords[coords.length - 1][1]) {
      coords.push([...coords[0]])
    }

    updatePolygon(coords)
    isDrawing.value = false

    // 飞到绘制区域
    flyToPolygon([coords])

    // 直接触发规划
    generateRoute()
  })

  drawTool.startDrawPolygon()
}

/** 子区域高亮 */
function handleSubRegionHighlight(subRegion: SubRegionResult | null) {
  if (!largeAreaResult.value)
    return
  renderer.highlightSubRegion(subRegion, form.value.altitude, largeAreaResult.value.subRegions, form.value.polygon)
}

/** 切换拍照点显示 */
function onTogglePhotoPoints() {
  const next = !showPhotoPoints.value
  showPhotoPoints.value = next
  renderer.setShowPhotoPoints(next)
}
</script>

<style scoped>
.mode-tabs :deep(.el-tabs__content) {
  display: none;
}

.mode-tabs :deep(.el-tabs__header) {
  margin-bottom: 0;
}

.mode-tabs {
  background: rgb(255 255 255 / 92%);
  border-radius: 6px;
  box-shadow: 0 1px 4px rgb(0 0 0 / 12%);
  backdrop-filter: blur(4px);
}
</style>
