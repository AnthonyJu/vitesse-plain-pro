import type { Feature, LineString, Point, Polygon } from 'geojson'
import * as turf from '@turf/turf'

// SurveyParams 描述生成航线所需的全部参数。
export interface PlanParams {
  // 任务区多边形，WGS84，经纬度坐标。
  polygon: [number, number][][]
  // 飞行高度，单位 米 (m)。
  altitude: number
  // 航向 重叠百分比，0-1 之间。
  frontOverlap: number
  // 侧向 重叠百分比，0-1 之间。
  sideOverlap: number
  // 无人机飞行速度，m/s，用于飞行时间、拍照间隔等估算
  flightSpeed: number
  // 航线主方向，度，默认朝北 0（即正北朝上）。
  flightDirectionDeg: number
  // 外延的距离 (m)
  extensionCord: number
  // 航线模式，S形（默认）或网格（井字）
  flightPattern: 's-shape' | 'grid-shape'
  // 相机参数组，用于计算相机地面覆盖和地面分辨率。
  camera: {
    // 焦距，单位 毫米 (mm)。
    focalLengthMm: number
    // 传感器宽度，单位 毫米 (mm)。
    sensorWidthMm: number
    // 传感器高度，单位 毫米 (mm)。
    sensorHeightMm: number
    // 图像宽度像素，用于 GSD 计算。
    imageWidthPx: number
    // 图像高度像素，用于 GSD 计算。
    imageHeightPx: number
    // 拍照触发方式
    triggerType: string
  }
}

// SurveyMissionResult 包含生成的航线、统计和元数据。
export interface MissionResult {
  // 飞行高度
  altitude: number
  // 任务区面积（平方米）
  areaSqMeters: string
  // 飞行距离（千米）
  flightDistance: string
  // 航线数
  numOfStrips: number
  // 航线间距（米）
  distBetweenLines: string
  // 预计飞行时间
  flightTime: string

  // 地面分辨率GSD cm/px
  groundResolution: string
  // 相机地面覆盖：每张照片覆盖的地面范围 宽与高（米）
  footprint: {
    width: string
    height: string
  }
  // 图像拍摄间距（米）
  distBetweenImages: string
  // 相机触发时间间隔（秒）
  photoIntervalSec: string
  // 预计拍照张数
  pictures: number
  // 拍照触发方式
  triggerType: string

  // 拍照点
  photoPoints: [number, number][]
  // 全部航点（不含拍照点）
  waypoints: Array<{
    // 坐标 [lng, lat]。
    coordinates: [number, number]
    // 点类型，waypoint（区域外延航点）、enter（进入任务区）、exit（离开任务区）。
    type: 'waypoint' | 'enter' | 'exit'
    properties?: any // 额外属性占位。
  }>
}

// 将相机参数与高度换算为地面覆盖和地面分辨率（宽度、高度、gsd）。
function computeCameraGroundCoverage(altitudeM: number, camera: PlanParams['camera']) {
  // 否则使用传感器尺寸与焦距来估算： footprint = (sensor_dimension / focal_length) * altitude
  // 焦距 (mm)
  const focal = camera.focalLengthMm
  // 传感器宽度 (mm)
  const sw = camera.sensorWidthMm
  // 传感器高度 (mm)
  const sh = camera.sensorHeightMm

  // 简单保护：避免除以 0。
  if (!focal || focal <= 0 || !sw || !sh) { // 校验相机参数有效性。
    throw new Error('Invalid camera parameters for ground coverage calculation.')
  }

  // 图像在地面的宽度与高度（m）。
  // 注意单位转换：sensor 与 focal 单位为 mm，altitude 为 m => 需要把 mm 转为 m。
  const width = (sw / 1000) / (focal / 1000) * altitudeM // 地面宽度（m）。
  const height = (sh / 1000) / (focal / 1000) * altitudeM // 地面高度（m）。

  // 若提供像素尺寸，也可以估算 gsd
  let gsd = 0

  // 如果提供了像素尺寸但没有 gsd，则计算
  if (camera.imageWidthPx && camera.imageWidthPx > 0) {
    gsd = width / camera.imageWidthPx // m/px
  }
  else if (camera.imageHeightPx && camera.imageHeightPx > 0) {
    gsd = height / camera.imageHeightPx // m/px
  }

  return { width, height, gsd }
}

// 将线段按照间隔采样点，返回坐标点数组（单位：米）
function sampleLineBySpacing(line: Feature<LineString>, length: number, spacingMeters: number) {
  // 生成分割点数, 向下取整
  const count = Math.floor(length / spacingMeters)

  // 准备拍照点数组
  const points: Feature<Point>[] = []

  // 循环从 1 到 count
  for (let i = 1; i <= count; i++) {
    // 计算当前距离（米），避免越界
    const dist = i * spacingMeters
    // 注意单位转换，turf.along 需要千米
    const point = turf.along(line, dist / 1000, { units: 'kilometers' })
    // 将拍照点加入数组
    points.push(point)
  }

  // 返回坐标点数组
  return points.map(p => p.geometry.coordinates as [number, number])
}

// 生成航线
function generateLines(
  polyFeature: Feature<Polygon>,
  pivot: Feature<Point>,
  flightDirectionDeg: number,
  forwardSpacing: number,
  sideSpacing: number,
  flightPattern: PlanParams['flightPattern'],
) {
  // 旋转任务区，便于生成水平平行线
  const rotated = turf.transformRotate(
    polyFeature,
    -flightDirectionDeg, // 逆时针旋转负角度
    { pivot },
  )
  const [minX, minY, maxX, maxY] = turf.bbox(rotated)

  // 取中心点作为样本点
  const sampleCoord = turf.centerOfMass(rotated).geometry.coordinates
  // 计算向北移动 sideSpacing 米后的点
  const northPoint = turf.destination(
    turf.point(sampleCoord),
    sideSpacing / 1000, // 转为千米
    90, // 右侧 正东向 90 度
    { units: 'kilometers' },
  )
  // 计算 经度 差值
  const lngDiff = northPoint.geometry.coordinates[0] - sampleCoord[0]

  // 总纬度跨度，计算需要多少行
  const totalLngSpan = maxX - minX
  // 估算行数，向上取整
  const approxCols = Math.ceil(Math.abs(totalLngSpan / lngDiff))

  // 生成航线
  const unRotatedLines: Feature<LineString>[] = []
  // 按行生成航线，并与旋转后的多边形求交
  for (let i = 1; i <= approxCols; i++) {
    // 这里生成的是垂直线，按经度变化
    const x = maxX - i * lngDiff

    // 构造一条垂直线，稍微超出边界以确保交点
    const ln = turf.lineString([[x, minY - 1], [x, maxY + 1]])

    // 计算与旋转后多边形的交点
    const intersects = turf.lineIntersect(ln, rotated)

    // 如果交点少于 2 个，说明没有有效交线，跳过
    if (!intersects.features || intersects.features.length < 2) continue

    // 提取交点坐标并按纬度排序
    const pts = intersects.features.map(f => f.geometry.coordinates as [number, number])

    // 按纬度排序
    pts.sort((a, b) => a[1] - b[1])

    // 取第一个和最后一个点，构成航线
    const first = pts[0]
    const last = pts[pts.length - 1]
    unRotatedLines.push(turf.lineString([first, last]))
  }

  // 旋转航线回原始方向
  const routeLines = unRotatedLines.map((line) => {
    return {
      type: flightPattern,
      length: turf.length(line, { units: 'kilometers' }) * 1000, // 米
      line: turf.transformRotate(
        line,
        flightDirectionDeg,
        { pivot }, // 中心点
      ),
    }
  }).filter(ln => ln.length >= forwardSpacing) // 过滤掉长度小于拍照间距的航线

  return routeLines
}

// 主函数：只实现蛇形覆盖
export function generateMissionRoute(params: PlanParams): MissionResult {
  const {
    polygon,
    altitude,
    frontOverlap,
    sideOverlap,
    camera,
    flightDirectionDeg,
    flightSpeed,
    extensionCord,
    flightPattern,
  } = params

  // 任务区多边形
  const polyFeature = turf.polygon(polygon)
  // 多边形中心点
  const pivot = turf.centroid(polyFeature)

  // 计算相机地面覆盖
  const camCoverage = computeCameraGroundCoverage(altitude, camera)
  // 航向间距（米），即拍照间距
  const forwardSpacing = camCoverage.height * (1 - frontOverlap)
  // 侧向间距（米），即航线间距
  const sideSpacing = camCoverage.width * (1 - sideOverlap)

  // 生成基础S航线
  let routeLines = generateLines(
    polyFeature,
    pivot,
    flightDirectionDeg,
    forwardSpacing,
    sideSpacing,
    's-shape',
  )

  // 网格航线时，记录上次航线的起点索引，用于连接航线
  const gridStartIndex = routeLines.length

  // 网格航线，增加垂直方向航线
  if (flightPattern === 'grid-shape') {
    // 生成垂直方向航线
    const gridLines = generateLines(
      polyFeature,
      pivot,
      flightDirectionDeg + 90, // 垂直方向
      forwardSpacing,
      sideSpacing,
      'grid-shape',
    )

    // 判断 routeLines 奇偶数
    const isOdd = routeLines.length % 2 === 1

    // 如果 s航线 是偶数，直接拼接
    if (!isOdd) {
      routeLines = routeLines.concat(gridLines)
    }
    // 如果 s航线 是奇数，则反转网格航线顺序再拼接
    else {
      routeLines = routeLines.concat(gridLines.reverse())
    }
  }

  // 航线总长度（米）
  let flightDistance = (routeLines.length - 1) * (sideSpacing) // 先加上航线间移动的距离
  // 总航点列表
  const waypoints: MissionResult['waypoints'] = []
  // 拍照点列表
  const photoPoints: [number, number][] = []

  // 遍历每条航线，采样航点
  for (let index = 0; index < routeLines.length; index++) {
    // 当前航线长度（米）
    const lnLength = routeLines[index].length
    // 累计总长度
    flightDistance += lnLength
    // 每条航线的延长线
    flightDistance += extensionCord * 2

    // 当前遍历航线
    const line = routeLines[index].line

    // 按照前向间距采样航点（包含首尾点）
    photoPoints.push(...sampleLineBySpacing(line, lnLength, forwardSpacing))

    // 航线端点坐标
    let linePoints = line.geometry.coordinates as [number, number][]
    // 蛇形航线，奇数行反转点顺序
    if (routeLines[index].type === 's-shape') {
      if (index % 2 === 1) linePoints = linePoints.reverse()
    }
    // 网格航线，基于起始索引判断奇偶行反转点顺序
    else if (routeLines[index].type === 'grid-shape') {
      if ((index - gridStartIndex) % 2 === 1) linePoints = linePoints.reverse()
    }

    // 处理延长线
    if (extensionCord > 0) {
      // 计算延长线方向向量
      const start = turf.point(linePoints[0])
      const end = turf.point(linePoints[1])

      // 起点到终点的方位角
      const bearing = turf.bearing(start, end)

      // 计算延长后的新端点
      const extendedStart = turf.destination(
        start,
        extensionCord / 1000, // 千米
        bearing + 180, // 反向延长
        { units: 'kilometers' },
      )

      // 替换端点为延长后的点
      waypoints.push({ coordinates: extendedStart.geometry.coordinates as [number, number], type: 'waypoint' })

      // 进入与离开任务区点
      waypoints.push({ coordinates: linePoints[0], type: 'enter' })
      waypoints.push({ coordinates: linePoints[1], type: 'exit' })

      // 终点延长
      const extendedEnd = turf.destination(
        end,
        extensionCord / 1000,
        bearing,
        { units: 'kilometers' },
      )

      // 将延长线端点加入航点列表
      waypoints.push({ coordinates: extendedEnd.geometry.coordinates as [number, number], type: 'waypoint' })
    }
    // 不延长则直接加入原始端点
    else {
      waypoints.push({ coordinates: linePoints[0], type: 'enter' })
      waypoints.push({ coordinates: linePoints[1], type: 'exit' })
    }
  }

  return {
    areaSqMeters: turf.area(polyFeature).toFixed(2), // 面积平方米
    numOfStrips: routeLines.length, // 航线数
    distBetweenLines: sideSpacing.toFixed(2), // 航线间距米
    flightDistance: (flightDistance / 1000).toFixed(2), // 飞行距离千米
    flightTime: `${Math.floor(flightDistance / flightSpeed / 60)}分${Math.round(flightDistance / flightSpeed % 60)}秒`, // 预计飞行时间

    groundResolution: (camCoverage.gsd * 100).toFixed(2), // 地面分辨率 cm/px
    footprint: { // 相机地面覆盖米
      width: camCoverage.width.toFixed(2),
      height: camCoverage.height.toFixed(2),
    },
    distBetweenImages: forwardSpacing.toFixed(2), // 图像拍摄间距米
    photoIntervalSec: (forwardSpacing / flightSpeed).toFixed(2), // 相机触发时间间隔秒
    pictures: photoPoints.length,

    triggerType: camera.triggerType,

    altitude,
    waypoints,
    photoPoints,
  }
}
