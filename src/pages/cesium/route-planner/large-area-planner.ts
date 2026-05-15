import type { Feature, Polygon } from 'geojson'
import type { BaseSettings, MissionResult, PlanParams } from './generate-mission-route'
import * as turf from '@turf/turf'
import { generateMissionRoute } from './generate-mission-route'

/** 大范围规划子区域结果 */
export interface SubRegionResult {
  /** 子区域编号 */
  id: number
  /** 子区域边界坐标 */
  polygon: [number, number][][]
  /** 该子区域的单次规划结果 */
  missionResult: MissionResult
  /** 子区域颜色（地图展示用） */
  color: string
}

/** 大范围规划汇总结果 */
export interface LargeAreaResult {
  /** 总面积(m²) */
  totalArea: string
  /** 各子区域结果 */
  subRegions: SubRegionResult[]
  /** 总飞行距离(km) */
  totalFlightDistance: string
  /** 总飞行时间 */
  totalFlightTime: string
  /** 总照片数 */
  totalPictures: number
  /** 切割网格边长(km) */
  gridCellSize: number
}

// ==================== 区域切割 ====================

/** 区域切割选项 */
interface SplitAreaOptions {
  polygon: [number, number][][]
  cellSizeKm: number
  flightDirectionDeg?: number
}

/** 切割后的子区域 */
export interface SubRegion {
  id: number
  row: number
  col: number
  polygon: Feature<Polygon>
  polygonCoords: [number, number][][]
}

/**
 * 自定义网格生成：严格覆盖 bbox，不留缝隙
 */
function generateGridCells(
  bbox: [number, number, number, number],
  cellSizeKm: number,
): { cells: Feature<Polygon>[], cols: number } {
  const [minLng, minLat, maxLng, maxLat] = bbox
  const centerLat = (minLat + maxLat) / 2
  const lngPerKm = 1 / (111.32 * Math.cos(centerLat * Math.PI / 180))
  const latPerKm = 1 / 111.32

  const widthKm = (maxLng - minLng) / lngPerKm
  const heightKm = (maxLat - minLat) / latPerKm

  const cols = Math.max(1, Math.ceil(widthKm / cellSizeKm))
  const rows = Math.max(1, Math.ceil(heightKm / cellSizeKm))

  const cellLngSpan = (maxLng - minLng) / cols
  const cellLatSpan = (maxLat - minLat) / rows

  const cells: Feature<Polygon>[] = []

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cMinLng = col === 0 ? minLng : minLng + col * cellLngSpan
      const cMaxLng = col === cols - 1 ? maxLng : minLng + (col + 1) * cellLngSpan
      const cMinLat = row === 0 ? minLat : minLat + row * cellLatSpan
      const cMaxLat = row === rows - 1 ? maxLat : minLat + (row + 1) * cellLatSpan

      const cellCoords: [number, number][][] = [[
        [cMinLng, cMaxLat],
        [cMaxLng, cMaxLat],
        [cMaxLng, cMinLat],
        [cMinLng, cMinLat],
        [cMinLng, cMaxLat],
      ]]

      cells.push(turf.polygon(cellCoords))
    }
  }

  return { cells, cols }
}

/**
 * 区域切割：将大多边形切割为接近正方形的子区域
 */
export function splitArea(options: SplitAreaOptions): SubRegion[] {
  const { polygon, cellSizeKm } = options

  const polyFeature = turf.polygon(polygon)
  const bbox = turf.bbox(polyFeature) as [number, number, number, number]

  const { cells: grid, cols } = generateGridCells(bbox, cellSizeKm)

  const subRegions: SubRegion[] = []

  grid.forEach((cell, index) => {
    let overlaps = false
    try {
      overlaps = turf.booleanIntersects(polyFeature, cell)
    }
    catch { return }

    if (!overlaps) return

    let cellFullyInside = false
    try {
      cellFullyInside = turf.booleanContains(polyFeature, cell)
    }
    catch { /* 保守处理 */ }

    let clipped: Feature<Polygon> | null = null

    if (cellFullyInside) {
      clipped = cell as Feature<Polygon>
    }
    else {
      try {
        clipped = turf.bboxClip(polyFeature, turf.bbox(cell)) as Feature<Polygon>
        if (!clipped || !clipped.geometry.coordinates[0] || clipped.geometry.coordinates[0].length < 4) {
          clipped = null
        }
      }
      catch { /* fallback */ }

      if (!clipped) {
        try {
          const result = turf.intersect(
            turf.featureCollection([polyFeature, cell as Feature<Polygon>]),
          )
          if (result) clipped = result as Feature<Polygon>
        }
        catch { /* fallback */ }
      }

      if (!clipped) {
        clipped = cell as Feature<Polygon>
      }
    }

    const coords = clipped.geometry.coordinates as [number, number][][]

    if (!coords[0] || coords[0].length < 4) return

    subRegions.push({
      id: index,
      row: Math.floor(index / cols),
      col: index % cols,
      polygon: clipped,
      polygonCoords: coords,
    })
  })

  subRegions.forEach((region, i) => {
    region.id = i
  })

  return subRegions
}

// ==================== 规划编排 ====================

// 子区域颜色列表（地图展示用）
const SUB_REGION_COLORS = [
  '#FF6B6B', // 红
  '#4ECDC4', // 青
  '#45B7D1', // 蓝
  '#96CEB4', // 绿
  '#FFEAA7', // 黄
  '#DDA0DD', // 紫
  '#98D8C8', // 薄荷
  '#F7DC6F', // 金
  '#BB8FCE', // 淡紫
  '#85C1E9', // 浅蓝
  '#F0B27A', // 橙
  '#82E0AA', // 浅绿
]

/**
 * 估算给定边长 L(km) 的正方形区域内的飞行距离(km)
 */
function estimateFlightDistance(
  cellSizeKm: number,
  sideSpacingKm: number,
  extensionCordM: number,
  flightPattern: PlanParams['flightPattern'],
): number {
  const L = cellSizeKm
  const s = sideSpacingKm
  const extKm = extensionCordM / 1000

  // 航线数
  const numStrips = Math.max(1, Math.ceil(L / s))

  // 航线内飞行距离
  const stripDist = numStrips * L

  // 延长线距离
  const extDist = numStrips * 2 * extKm

  // 航线间转弯距离（约等于总侧向跨度）
  const turnDist = L

  // S 形总距离
  let total = stripDist + extDist + turnDist

  // 井字形需要额外约 1 倍（垂直方向）
  if (flightPattern === 'grid-shape') {
    const numStripsV = Math.max(1, Math.ceil(L / s))
    const stripDistV = numStripsV * L
    const extDistV = numStripsV * 2 * extKm
    const turnDistV = L
    total += stripDistV + extDistV + turnDistV
  }

  return total
}

/**
 * 二分搜索计算最大网格边长
 */
export function computeMaxCellSize(
  params: Omit<PlanParams, 'polygon'>,
  maxFlightDistanceKm: number,
): number {
  // 先计算相机参数得到侧向间距
  const altitude = params.altitude
  const camera = params.camera
  const focal = camera.focalLengthMm
  const sw = camera.sensorWidthMm

  if (!focal || focal <= 0 || !sw) {
    return 5 // 安全默认值
  }

  // 地面覆盖宽度(m)
  const footprintWidth = (sw / 1000) / (focal / 1000) * altitude
  // 侧向间距(m → km)
  const sideSpacingKm = footprintWidth * (1 - params.sideOverlap) / 1000

  // 二分搜索
  let lo = 0.1 // 最小边长 0.1km
  let hi = 50 // 最大边长 50km
  const precision = 0.01 // 精度 0.01km

  while (hi - lo > precision) {
    const mid = (lo + hi) / 2
    const estimated = estimateFlightDistance(
      mid,
      sideSpacingKm,
      params.extensionCord,
      params.flightPattern,
    )

    if (estimated <= maxFlightDistanceKm) {
      lo = mid // 还能更大
    }
    else {
      hi = mid // 太大了
    }
  }

  return lo
}

// ==================== 合并逻辑 ====================

/** 子区域 + 航线结果的临时结构，用于合并计算 */
interface SubRegionWithResult {
  id: number
  row: number
  col: number
  polygon: Feature<Polygon>
  polygonCoords: [number, number][][]
  flightDistanceKm: number
}

/**
 * 基于飞行距离合并过小的子区域
 */
function mergeSmallByFlightDistance(
  regions: SubRegion[],
  params: PlanParams,
  baseSettings: BaseSettings,
  cellSizeKm: number,
): SubRegionWithResult[] {
  // 为每个子区域计算航线
  const current: SubRegionWithResult[] = regions.map((r) => {
    try {
      const subParams: PlanParams = {
        ...params,
        polygon: r.polygonCoords,
        baseSettings,
      }
      const result = generateMissionRoute(subParams)
      return {
        id: r.id,
        row: r.row,
        col: r.col,
        polygon: r.polygon,
        polygonCoords: r.polygonCoords,
        flightDistanceKm: Number.parseFloat(result.flightDistance),
      }
    }
    catch (e) {
      console.warn(`子区域 ${r.id} 航线计算失败:`, e)
      // 降级：用 estimateFlightDistance 估算
      const dist = estimateFlightDistance(
        cellSizeKm,
        0.03, // 默认 sideSpacing
        params.extensionCord,
        params.flightPattern,
      )
      return {
        id: r.id,
        row: r.row,
        col: r.col,
        polygon: r.polygon,
        polygonCoords: r.polygonCoords,
        flightDistanceKm: dist,
      }
    }
  })

  let changed = true
  const maxIterations = current.length
  let iterations = 0

  while (changed && iterations < maxIterations) {
    changed = false
    iterations++

    if (current.length <= 1) break

    // 计算中位数飞行距离
    const distances = current.map(r => r.flightDistanceKm).sort((a, b) => a - b)
    const median = distances[Math.floor(distances.length / 2)]
    const minDistThreshold = median * 0.6

    // 找飞行距离最小的过小子区域
    let smallestIdx = -1
    let smallestDist = Infinity
    for (let i = 0; i < current.length; i++) {
      if (current[i].flightDistanceKm < minDistThreshold && current[i].flightDistanceKm < smallestDist) {
        smallestDist = current[i].flightDistanceKm
        smallestIdx = i
      }
    }

    if (smallestIdx < 0) break

    // 找最佳合并目标，尝试多个候选直到找到一个安全的
    const mergedResult = tryMergeSmallest(current, smallestIdx, cellSizeKm, baseSettings, params)

    if (!mergedResult) break

    // 应用合并结果
    current[mergedResult.targetIdx] = mergedResult.updatedTarget
    current.splice(smallestIdx, 1)
    changed = true
  }

  // 重新编号
  current.forEach((r, i) => {
    r.id = i
  })

  return current
}

/**
 * 尝试为过小子区域找到安全的合并目标
 */
function tryMergeSmallest(
  regions: SubRegionWithResult[],
  sourceIdx: number,
  cellSizeKm: number,
  baseSettings: BaseSettings,
  params: PlanParams,
): { targetIdx: number, updatedTarget: SubRegionWithResult } | null {
  const source = regions[sourceIdx]
  const sourceCentroid = turf.centroid(source.polygon)
  const maxMergedDist = baseSettings.maxFlightDistance * 0.98

  // 收集相邻候选
  const adjacentCandidates: { idx: number, dist: number, targetFlightDist: number }[] = []
  const nonAdjacentCandidates: { idx: number, dist: number }[] = []

  for (let j = 0; j < regions.length; j++) {
    if (j === sourceIdx) continue

    const target = regions[j]
    const targetCentroid = turf.centroid(target.polygon)
    const centroidDist = turf.distance(sourceCentroid, targetCentroid, { units: 'kilometers' })

    // 检查是否相邻
    if (centroidDist < cellSizeKm * 2) {
      let isAdjacent = false
      try {
        isAdjacent = turf.booleanIntersects(source.polygon, target.polygon)
          || turf.booleanContains(source.polygon, target.polygon)
          || turf.booleanContains(target.polygon, source.polygon)
      }
      catch {
        isAdjacent = true
      }
      if (isAdjacent) {
        adjacentCandidates.push({ idx: j, dist: centroidDist, targetFlightDist: target.flightDistanceKm })
      }
      else {
        nonAdjacentCandidates.push({ idx: j, dist: centroidDist })
      }
    }
    else {
      nonAdjacentCandidates.push({ idx: j, dist: centroidDist })
    }
  }

  // 按飞行距离从小到大排序候选
  adjacentCandidates.sort((a, b) => a.targetFlightDist - b.targetFlightDist)
  nonAdjacentCandidates.sort((a, b) => a.dist - b.dist)

  // 尝试每个相邻候选
  for (const candidate of adjacentCandidates) {
    const result = attemptMerge(regions, sourceIdx, candidate.idx, maxMergedDist, params)
    if (result) return result
  }

  // 没有安全的相邻候选，尝试最近的非相邻候选
  for (const candidate of nonAdjacentCandidates) {
    const result = attemptMerge(regions, sourceIdx, candidate.idx, maxMergedDist, params)
    if (result) return result
  }

  return null
}

/**
 * 尝试合并两个子区域，返回安全合并后的结果
 */
function attemptMerge(
  regions: SubRegionWithResult[],
  sourceIdx: number,
  targetIdx: number,
  maxMergedDist: number,
  params: PlanParams,
): { targetIdx: number, updatedTarget: SubRegionWithResult } | null {
  let merged
  try {
    merged = turf.union(
      turf.featureCollection([regions[sourceIdx].polygon, regions[targetIdx].polygon]),
    )
  }
  catch (e) {
    console.warn('turf.union 失败:', e)
    return null
  }

  if (!merged) return null

  const mergedPoly = merged as Feature<Polygon>
  const mergedCoords = mergedPoly.geometry.coordinates as [number, number][][]

  // 安全检查：合并后的多边形必须有效
  if (!mergedCoords[0] || mergedCoords[0].length < 4) return null

  // 计算合并后的航线
  const subParams: PlanParams = {
    ...params,
    polygon: mergedCoords,
    baseSettings: params.baseSettings,
  }
  const newResult = generateMissionRoute(subParams)
  const newDist = Number.parseFloat(newResult.flightDistance)

  // 安全检查：合并后飞行距离不得超过上限
  if (newDist > maxMergedDist) return null

  return {
    targetIdx,
    updatedTarget: {
      id: regions[targetIdx].id,
      row: regions[targetIdx].row,
      col: regions[targetIdx].col,
      polygon: mergedPoly,
      polygonCoords: mergedCoords,
      flightDistanceKm: newDist,
    },
  }
}

// ==================== 大范围规划主函数 ====================

export function planLargeArea(
  params: PlanParams,
  baseSettings: BaseSettings,
): LargeAreaResult {
  // 1. 计算最大网格边长
  const cellSizeKm = computeMaxCellSize(params, baseSettings.maxFlightDistance)

  // 2. 切割区域
  const subRegions = splitArea({
    polygon: params.polygon,
    cellSizeKm,
    flightDirectionDeg: params.flightDirectionDeg,
  })

  // 边界：无子区域
  if (!subRegions.length) {
    return {
      totalArea: '0',
      subRegions: [],
      totalFlightDistance: '0',
      totalFlightTime: '0分0秒',
      totalPictures: 0,
      gridCellSize: cellSizeKm,
    }
  }

  // 3. 基于飞行距离合并过小子区域
  let mergedRegions: SubRegionWithResult[]
  try {
    mergedRegions = mergeSmallByFlightDistance(subRegions, params, baseSettings, cellSizeKm)
  }
  catch (e) {
    console.warn('合并步骤出错，使用原始切割结果:', e)
    // 降级：不做合并
    mergedRegions = subRegions.map((r) => {
      const subParams: PlanParams = {
        ...params,
        polygon: r.polygonCoords,
        baseSettings,
      }
      const result = generateMissionRoute(subParams)
      return {
        id: r.id,
        row: r.row,
        col: r.col,
        polygon: r.polygon,
        polygonCoords: r.polygonCoords,
        flightDistanceKm: Number.parseFloat(result.flightDistance),
      }
    })
  }

  // 4. 对每个合并后的子区域生成最终航线
  const subRegionResults: SubRegionResult[] = []
  let totalFlightDistance = 0
  let totalPictures = 0

  mergedRegions.forEach((region, i) => {
    // 安全检查：跳过退化多边形
    if (!region.polygonCoords[0] || region.polygonCoords[0].length < 4) {
      console.warn(`子区域 ${i} 为退化多边形，跳过`)
      return
    }

    const subParams: PlanParams = {
      ...params,
      polygon: region.polygonCoords,
      baseSettings,
    }

    let missionResult
    try {
      missionResult = generateMissionRoute(subParams)
    }
    catch (e) {
      console.warn(`子区域 ${i} 最终航线计算失败:`, e)
      return
    }

    subRegionResults.push({
      id: i,
      polygon: region.polygonCoords,
      missionResult,
      color: SUB_REGION_COLORS[(region.row + region.col * 5) % SUB_REGION_COLORS.length],
    })

    totalFlightDistance += Number.parseFloat(missionResult.flightDistance)
    totalPictures += missionResult.pictures
  })

  // 5. 汇总
  const polyFeature = turf.polygon(params.polygon)
  const totalArea = turf.area(polyFeature)

  // 计算总飞行时间
  const totalDistM = totalFlightDistance * 1000
  const flightSpeed = params.flightSpeed || 20
  const totalSec = totalDistM / flightSpeed
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = Math.floor(totalSec % 60)
  const totalFlightTime = h > 0 ? `${h}小时${m}分${s}秒` : `${m}分${s}秒`

  return {
    totalArea: totalArea.toFixed(2),
    subRegions: subRegionResults,
    totalFlightDistance: totalFlightDistance.toFixed(2),
    totalFlightTime,
    totalPictures,
    gridCellSize: cellSizeKm,
  }
}
