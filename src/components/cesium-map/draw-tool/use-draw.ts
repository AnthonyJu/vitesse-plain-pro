import * as Cesium from 'cesium'

// ==================== 绘制样式配置 ====================

// 标记点颜色
const COLOR_PIN = Cesium.Color.CYAN
// 线段颜色（最终）
const COLOR_POLYLINE = Cesium.Color.CYAN
// 线段颜色（绘制中动态预览）
const COLOR_POLYLINE_DYNAMIC = Cesium.Color.CYAN.withAlpha(0.75)
// 多边形填充颜色
const COLOR_POLYGON_FILL = Cesium.Color.CYAN.withAlpha(0.3)
// 多边形轮廓颜色
const COLOR_POLYGON_OUTLINE = Cesium.Color.CYAN
// 圆形填充颜色
const COLOR_CIRCLE_FILL = Cesium.Color.CYAN.withAlpha(0.3)
// 圆形轮廓颜色
const COLOR_CIRCLE_OUTLINE = Cesium.Color.CYAN
// 节点颜色
const COLOR_POINT = Cesium.Color.BLUE

// 节点大小（像素）
const SIZE_POINT = 8
// 线宽（像素）
const WIDTH_LINE = 3
// 点边框宽度（像素）
const WIDTH_OUTLINE = 2

export type DrawMode = 'pin' | 'polyline' | 'polygon' | 'circle' | ''

export interface DrawResult {
  type: DrawMode
  positions: Cesium.Cartesian3[]
  entity: Cesium.Entity | Cesium.Entity[]
}

export class DrawTool {
  viewer: Cesium.Viewer
  handler: Cesium.ScreenSpaceEventHandler | null = null
  mode: DrawMode = ''
  fixedPositions: Cesium.Cartesian3[] = []
  tempPosition: Cesium.Cartesian3 | null = null
  dynamicEntity: Cesium.Entity | null = null
  dynamicOutline: Cesium.Entity | null = null
  pointEntities: Cesium.Entity[] = []
  resultEntities: Cesium.Entity[] = []
  allDrawResults: DrawResult[] = []

  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer
    this._bindEsc()
  }

  // 开始绘制点
  startDrawPin() {
    this._start('pin')
  }

  // 开始绘制线段
  startDrawPolyline() {
    this._start('polyline')
  }

  // 开始绘制多边形
  startDrawPolygon() {
    this._start('polygon')
  }

  // 开始绘制圆形
  startDrawCircle() {
    this._start('circle')
  }

  // 停止当前绘制
  stop() {
    this._destroyHandler()
    this._clearTempEntities()
    this.mode = ''
  }

  // 清除所有绘制结果
  clearAll() {
    this.stop()
    this.allDrawResults.forEach((result) => {
      if (Array.isArray(result.entity)) {
        result.entity.forEach(e => this._safeRemoveEntity(e))
      }
      else {
        this._safeRemoveEntity(result.entity)
      }
    })
    this.allDrawResults = []
  }

  private _start(mode: DrawMode) {
    this._destroyHandler()
    this._clearTempEntities()
    this.mode = mode
    this.fixedPositions = []
    this.tempPosition = null

    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas)

    switch (mode) {
      case 'pin':
        this._bindPinEvents()
        break
      case 'polyline':
        this._bindPolylineEvents()
        break
      case 'polygon':
        this._bindPolygonEvents()
        break
      case 'circle':
        this._bindCircleEvents()
        break
    }
  }

  // ========== 点绘制 ==========
  private _bindPinEvents() {
    this.handler!.setInputAction((event: any) => {
      const cart = this._getCartesian(event.position)
      if (!cart) return

      const pin = this._addBillboard(cart)
      this.allDrawResults.push({
        type: 'pin',
        positions: [cart],
        entity: pin,
      })
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }

  // ========== 线段绘制 ==========
  private _bindPolylineEvents() {
    let lastClickTime = 0

    this.handler!.setInputAction((event: any) => {
      const now = Date.now()
      if (now - lastClickTime <= 300) return
      lastClickTime = now

      const cart = this._getCartesian(event.position)
      if (!cart) return

      this.fixedPositions.push(cart)
      const pt = this._addPoint(cart, COLOR_POINT)
      this.pointEntities.push(pt)

      if (!this.dynamicEntity) {
        this.dynamicEntity = this._addDynamicPolyline(
          () => this._getPositionsWithTemp(),
          COLOR_POLYLINE_DYNAMIC,
        )
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    this.handler!.setInputAction((event: any) => {
      if (this.fixedPositions.length === 0) return
      const pos = this._getCartesian(event.endPosition)
      if (pos) this.tempPosition = pos
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    this.handler!.setInputAction(() => {
      if (this.fixedPositions.length < 2) return
      this._finishPolyline()
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

    this.handler!.setInputAction(() => {
      this._undoLastPoint()
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }

  private _finishPolyline() {
    this._clearTempEntities()
    const line = this._addPolyline(this.fixedPositions.slice(), COLOR_POLYLINE)
    const points = this.fixedPositions.map(p => this._addPoint(p, COLOR_POINT))

    this.allDrawResults.push({
      type: 'polyline',
      positions: this.fixedPositions.slice(),
      entity: [line, ...points],
    })

    this.fixedPositions = []
    this.tempPosition = null
  }

  // ========== 多边形绘制 ==========
  private _bindPolygonEvents() {
    let lastClickTime = 0

    this.handler!.setInputAction((event: any) => {
      const now = Date.now()
      if (now - lastClickTime <= 300) return
      lastClickTime = now

      const cart = this._getCartesian(event.position)
      if (!cart) return

      this.fixedPositions.push(cart)
      const pt = this._addPoint(cart, COLOR_POINT)
      this.pointEntities.push(pt)

      if (!this.dynamicEntity) {
        this.dynamicEntity = this._addDynamicPolygon(
          () => this._getPositionsWithTemp(),
          COLOR_POLYGON_FILL,
          COLOR_POLYGON_OUTLINE,
        )
        this.dynamicOutline = this._addDynamicPolyline(
          () => {
            const pts = this._getPositionsWithTemp()
            return pts.length > 1 ? [...pts, pts[0]] : pts
          },
          COLOR_POLYGON_OUTLINE,
        )
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    this.handler!.setInputAction((event: any) => {
      if (this.fixedPositions.length === 0) return
      const pos = this._getCartesian(event.endPosition)
      if (pos) this.tempPosition = pos
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    this.handler!.setInputAction(() => {
      if (this.fixedPositions.length < 3) return
      this._finishPolygon()
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

    this.handler!.setInputAction(() => {
      this._undoLastPoint()
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }

  private _finishPolygon() {
    this._clearTempEntities()
    const polygon = this._addPolygon(this.fixedPositions.slice(), COLOR_POLYGON_FILL, COLOR_POLYGON_OUTLINE)
    const outline = this._addPolyline([...this.fixedPositions, this.fixedPositions[0]], COLOR_POLYGON_OUTLINE)
    const points = this.fixedPositions.map(p => this._addPoint(p, COLOR_POINT))

    this.allDrawResults.push({
      type: 'polygon',
      positions: this.fixedPositions.slice(),
      entity: [polygon, outline, ...points],
    })

    this.fixedPositions = []
    this.tempPosition = null
  }

  // ========== 圆形绘制 ==========
  private _bindCircleEvents() {
    this.handler!.setInputAction((event: any) => {
      const cart = this._getCartesian(event.position)
      if (!cart) return

      if (this.fixedPositions.length === 0) {
        // 第一次点击：设置圆心
        this.fixedPositions.push(cart)
        const pt = this._addPoint(cart, COLOR_POINT)
        this.pointEntities.push(pt)

        this.dynamicEntity = this._addDynamicCircle(
          cart,
          () => this._computeRadius(),
          COLOR_CIRCLE_FILL,
          COLOR_CIRCLE_OUTLINE,
        )
        // 动态圆形边框
        this.dynamicOutline = this._addDynamicPolyline(
          () => this._generateCirclePositions(cart, this._computeRadius()),
          COLOR_CIRCLE_OUTLINE,
        )
      }
      else {
        // 第二次点击：完成圆形
        this._finishCircle()
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    this.handler!.setInputAction((event: any) => {
      if (this.fixedPositions.length === 0) return
      const pos = this._getCartesian(event.endPosition)
      if (pos) this.tempPosition = pos
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    this.handler!.setInputAction(() => {
      if (this.fixedPositions.length > 0) {
        this._clearTempEntities()
        this.fixedPositions = []
        this.tempPosition = null
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }

  private _finishCircle() {
    const center = this.fixedPositions[0]
    const radius = this._computeRadius()

    this._clearTempEntities()

    const circle = this._addCircle(center, radius, COLOR_CIRCLE_FILL, COLOR_CIRCLE_OUTLINE)
    const circleOutline = this._addCircleOutline(center, radius, COLOR_CIRCLE_OUTLINE)
    const centerPoint = this._addPoint(center, COLOR_POINT)

    this.allDrawResults.push({
      type: 'circle',
      positions: [center],
      entity: [circle, circleOutline, centerPoint],
    })

    this.fixedPositions = []
    this.tempPosition = null
  }

  // 生成圆形边框点位（用于 polyline 绘制）
  private _generateCirclePositions(
    center: Cesium.Cartesian3,
    radius: number,
    segments: number = 64,
  ): Cesium.Cartesian3[] {
    const positions: Cesium.Cartesian3[] = []
    const cartographic = Cesium.Cartographic.fromCartesian(center)
    const centerLon = Cesium.Math.toDegrees(cartographic.longitude)
    const centerLat = Cesium.Math.toDegrees(cartographic.latitude)

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      // 使用球面计算，考虑地球曲率
      const earthRadius = 6378137 // 地球半径（米）
      const latOffset = (radius / earthRadius) * (180 / Math.PI) * Math.cos(angle)
      const lonOffset = (radius / earthRadius) * (180 / Math.PI) * Math.sin(angle)
        / Math.cos(centerLat * Math.PI / 180)
      positions.push(Cesium.Cartesian3.fromDegrees(centerLon + lonOffset, centerLat + latOffset))
    }

    return positions
  }

  // 添加圆形边框（使用 polyline）
  private _addCircleOutline(center: Cesium.Cartesian3, radius: number, color: Cesium.Color): Cesium.Entity {
    const positions = this._generateCirclePositions(center, radius)
    return this._addPolyline(positions, color)
  }

  private _computeRadius(): number {
    if (this.fixedPositions.length === 0 || !this.tempPosition) return 0
    return Cesium.Cartesian3.distance(this.fixedPositions[0], this.tempPosition)
  }

  // ========== 实体创建辅助方法 ==========
  private _addBillboard(position: Cesium.Cartesian3): Cesium.Entity {
    return this.viewer.entities.add({
      position,
      billboard: {
        image: this._createPinCanvas(),
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    })
  }

  private _createPinCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 48
    const ctx = canvas.getContext('2d')!

    // 绘制水滴形状
    ctx.beginPath()
    ctx.moveTo(16, 48)
    ctx.bezierCurveTo(16, 48, 0, 28, 0, 16)
    ctx.arc(16, 16, 16, Math.PI, 0, false)
    ctx.bezierCurveTo(32, 28, 16, 48, 16, 48)
    ctx.fillStyle = COLOR_PIN.toCssColorString()
    ctx.fill()

    // 绘制内圆
    ctx.beginPath()
    ctx.arc(16, 16, 6, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()

    return canvas
  }

  private _addPoint(position: Cesium.Cartesian3, color: Cesium.Color): Cesium.Entity {
    return this.viewer.entities.add({
      position,
      point: {
        pixelSize: SIZE_POINT,
        color,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: WIDTH_OUTLINE,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    })
  }

  private _addPolyline(positions: Cesium.Cartesian3[], color: Cesium.Color): Cesium.Entity {
    return this.viewer.entities.add({
      polyline: {
        positions,
        width: WIDTH_LINE,
        material: color,
        clampToGround: true,
      },
    })
  }

  private _addDynamicPolyline(
    positionsCallback: () => Cesium.Cartesian3[],
    color: Cesium.Color,
  ): Cesium.Entity {
    return this.viewer.entities.add({
      polyline: {
        positions: new Cesium.CallbackProperty(() => positionsCallback(), false),
        width: WIDTH_LINE,
        material: color,
        clampToGround: true,
      },
    })
  }

  private _addPolygon(
    positions: Cesium.Cartesian3[],
    fillColor: Cesium.Color,
    outlineColor: Cesium.Color,
  ): Cesium.Entity {
    return this.viewer.entities.add({
      polygon: {
        hierarchy: new Cesium.PolygonHierarchy(positions),
        material: fillColor,
        outline: true,
        outlineColor,
        classificationType: Cesium.ClassificationType.TERRAIN,
      },
    })
  }

  private _addDynamicPolygon(
    hierarchyCallback: () => Cesium.Cartesian3[],
    fillColor: Cesium.Color,
    outlineColor: Cesium.Color,
  ): Cesium.Entity {
    return this.viewer.entities.add({
      polygon: {
        hierarchy: new Cesium.CallbackProperty(
          () => new Cesium.PolygonHierarchy(hierarchyCallback()),
          false,
        ),
        material: fillColor,
        outline: true,
        outlineColor,
        classificationType: Cesium.ClassificationType.TERRAIN,
      },
    })
  }

  private _addCircle(
    center: Cesium.Cartesian3,
    radius: number,
    fillColor: Cesium.Color,
    outlineColor: Cesium.Color,
  ): Cesium.Entity {
    return this.viewer.entities.add({
      position: center,
      ellipse: {
        semiMajorAxis: radius,
        semiMinorAxis: radius,
        material: fillColor,
        outline: true,
        outlineColor,
        outlineWidth: WIDTH_LINE,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        classificationType: Cesium.ClassificationType.TERRAIN,
      },
    })
  }

  private _addDynamicCircle(
    center: Cesium.Cartesian3,
    radiusCallback: () => number,
    fillColor: Cesium.Color,
    outlineColor: Cesium.Color,
  ): Cesium.Entity {
    return this.viewer.entities.add({
      position: center,
      ellipse: {
        semiMajorAxis: new Cesium.CallbackProperty(() => radiusCallback() || 1, false),
        semiMinorAxis: new Cesium.CallbackProperty(() => radiusCallback() || 1, false),
        material: fillColor,
        outline: true,
        outlineColor,
        outlineWidth: WIDTH_LINE,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        classificationType: Cesium.ClassificationType.TERRAIN,
      },
    })
  }

  // ========== 工具方法 ==========
  private _getCartesian(screenPosition: Cesium.Cartesian2): Cesium.Cartesian3 | undefined {
    let cart: Cesium.Cartesian3 | undefined = this.viewer.scene.pickPosition(screenPosition)
    if (!cart) {
      cart = this.viewer.camera.pickEllipsoid(screenPosition, this.viewer.scene.globe.ellipsoid) ?? undefined
    }
    return cart
  }

  private _getPositionsWithTemp(): Cesium.Cartesian3[] {
    if (!this.tempPosition) return this.fixedPositions.slice()
    return [...this.fixedPositions, this.tempPosition]
  }

  private _undoLastPoint() {
    if (this.fixedPositions.length === 0) return

    this.fixedPositions.pop()
    const pt = this.pointEntities.pop()
    if (pt) this._safeRemoveEntity(pt)

    if (this.fixedPositions.length === 0) {
      this._clearTempEntities()
      this.tempPosition = null
    }
  }

  private _clearTempEntities() {
    this.pointEntities.forEach(e => this._safeRemoveEntity(e))
    this.pointEntities = []

    if (this.dynamicEntity) {
      this._safeRemoveEntity(this.dynamicEntity)
      this.dynamicEntity = null
    }
    if (this.dynamicOutline) {
      this._safeRemoveEntity(this.dynamicOutline)
      this.dynamicOutline = null
    }
  }

  private _safeRemoveEntity(entity: Cesium.Entity) {
    try {
      this.viewer.entities.remove(entity)
    }
    catch {}
  }

  private _destroyHandler() {
    if (this.handler) {
      try {
        this.handler.destroy()
      }
      catch {}
      this.handler = null
    }
  }

  private _bindEsc() {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.stop()
      }
    }
    window.addEventListener('keydown', handleEsc)
  }
}

// Composable 封装
export function useDraw(viewer: Ref<Cesium.Viewer | undefined> | ShallowRef<Cesium.Viewer | undefined>) {
  const drawTool = shallowRef<DrawTool>()
  const activeMode = ref<DrawMode>('')

  // 初始化绘制工具
  watch(
    () => viewer.value,
    (v) => {
      if (v && !drawTool.value) {
        drawTool.value = new DrawTool(v)
      }
    },
    { immediate: true },
  )

  // 切换绘制模式
  function toggleMode(mode: DrawMode) {
    if (!drawTool.value) return

    if (activeMode.value === mode) {
      // 再次点击同一工具，停止绘制
      drawTool.value.stop()
      activeMode.value = ''
      return
    }

    activeMode.value = mode
    switch (mode) {
      case 'pin':
        drawTool.value.startDrawPin()
        break
      case 'polyline':
        drawTool.value.startDrawPolyline()
        break
      case 'polygon':
        drawTool.value.startDrawPolygon()
        break
      case 'circle':
        drawTool.value.startDrawCircle()
        break
    }
  }

  // 清除所有绘制
  function clearAll() {
    drawTool.value?.clearAll()
    activeMode.value = ''
  }

  // 停止当前绘制
  function stop() {
    drawTool.value?.stop()
    activeMode.value = ''
  }

  // 获取所有绘制结果
  function getDrawResults(): DrawResult[] {
    return drawTool.value?.allDrawResults || []
  }

  // 组件卸载时清理
  onUnmounted(() => {
    drawTool.value?.stop()
  })

  return {
    activeMode,
    toggleMode,
    clearAll,
    stop,
    getDrawResults,
  }
}
