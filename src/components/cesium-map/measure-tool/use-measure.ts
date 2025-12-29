import * as Cesium from 'cesium'

const COLOR_DISTANCE = Cesium.Color.CYAN // 测距线颜色
const COLOR_DISTANCE_DYNAMIC = Cesium.Color.CYAN.withAlpha(0.75) // 测距动态线颜色
const COLOR_POINT_START = Cesium.Color.GREEN // 起点颜色
const COLOR_POINT_MIDDLE = Cesium.Color.BLUE // 中间点颜色
const COLOR_POINT_END = Cesium.Color.RED // 终点颜色

const COLOR_AREA_OUTLINE = Cesium.Color.CYAN // 面积轮廓线颜色
const COLOR_AREA_FILL = Cesium.Color.CYAN.withAlpha(0.2) // 面积填充颜色

const COLOR_HEIGHT = Cesium.Color.CYAN // 高度线颜色
const COLOR_HEIGHT_DYNAMIC = Cesium.Color.CYAN.withAlpha(0.75) // 高度线颜色

const COLOR_LABEL_DEFAULT = Cesium.Color.YELLOW // 标签默认颜色

const SIZE_POINT_DEFAULT = 7 // 测量点默认大小
const WIDTH_POINT_OUTLINE = 2 // 点边框宽度
const WIDTH_LINE_DEFAULT = 3 // 默认线宽（测距 / 测高）
const LABEL_OFFSET_Y = -16 // label 垂直偏移（像素）

export class MeasureTool {
  viewer: Cesium.Viewer
  handler: Cesium.ScreenSpaceEventHandler | null
  fixedPositions: Cesium.Cartesian3[]
  tempPosition: Cesium.Cartesian3 | null
  pointEntities: Cesium.Entity[]
  segmentLineEntities: Cesium.Entity[]
  segmentLabelEntities: Cesium.Entity[]
  dynamicEntity: Cesium.Entity | null
  tempSegmentLabel: Cesium.Entity | null
  mode: string | null
  showMu: boolean
  muFactor: number
  dynamicOutline: Cesium.Entity | null
  tempAreaLabel: Cesium.Entity | null
  tempSegmentText: string
  tempAreaText: string
  tempHeightLabel: Cesium.Entity | null
  tempHeightText: string

  constructor(viewer: Cesium.Viewer) {
    this.viewer = viewer
    this.handler = null

    this.fixedPositions = [] // 已确定的点
    this.tempPosition = null // 鼠标移动产生的临时点f
    this.pointEntities = [] // 点实体
    this.segmentLineEntities = [] // 段实体 / 最终线 / polygon 等
    this.segmentLabelEntities = [] // 段标签或最终标签
    this.dynamicEntity = null // 动态预览实体（polyline 或 polygon）
    this.tempSegmentLabel = null // 动态段长度标签
    this.mode = null
    this.showMu = false
    this.muFactor = 666.6666666667
    this.dynamicOutline = null
    this.tempAreaLabel = null
    this.tempSegmentText = ''
    this.tempAreaText = ''
    this.tempHeightLabel = null
    this.tempHeightText = ''
    this._bindEsc()
  }

  startDistanceMeasure() {
    this._start('distance')
  }

  startAreaMeasure(showMu = true) {
    this._start('area', { showMu })
  }

  startHeightMeasure() {
    this._start('height')
  }

  clearAll() {
    this._clearAllEntities()
    this._destroyHandler()
  }

  _start(mode: string, opts: Record<string, any> = {}) {
    this._destroyHandler()
    // this._clearAllEntities();
    this.mode = mode
    this.showMu = opts.showMu !== undefined ? opts.showMu : true
    this.fixedPositions = []
    this.tempPosition = null
    this.pointEntities = []
    this.segmentLineEntities = []
    this.segmentLabelEntities = []
    this.dynamicEntity = null
    this.tempSegmentLabel = null
    this.tempAreaLabel = null
    this.tempSegmentText = ''
    this.tempAreaText = ''
    this.tempHeightLabel = null
    this.tempHeightText = ''

    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas)

    if (mode === 'distance') this._bindDistanceEvents()
    if (mode === 'area') this._bindAreaEvents()
    if (mode === 'height') this._bindHeightEvents()
  }

  /* ---------- Distance events ---------- */
  _bindDistanceEvents() {
    let lastClickTime = 0
    // LEFT_CLICK: 添加点
    this.handler!.setInputAction((_event: any) => {
      const now = Date.now()
      // 防止双击时的第二次 LEFT_CLICK 被重复添加点
      if (now - lastClickTime <= 300) return
      lastClickTime = now

      const cart = this._getCartesian((_event as any).position)
      if (!cart) return
      this.fixedPositions.push(cart)

      // 点样式
      const idx = this.fixedPositions.length - 1
      const color = idx === 0 ? COLOR_POINT_START : COLOR_POINT_MIDDLE
      const pt = this._addPointEntity(cart, color, SIZE_POINT_DEFAULT)
      this.pointEntities.push(pt)

      // 若已有上一点，则生成该段的静态线和该段标签
      if (this.fixedPositions.length > 1) {
        const a = this.fixedPositions[idx - 1]
        const b = cart
        const segLine = this._addPolyline([a, b], COLOR_DISTANCE, true)
        this.segmentLineEntities.push(segLine)
        const label = this._addLabelEntity(b, '计算中...', '14px')
        this.segmentLabelEntities.push(label)
        this._computeTerrainDistance(a, b).then((segLen) => {
          if (label.label) label.label.text = this._formatDistance(segLen)
        })
      }

      // 创建动态预览（如果还没有）
      if (!this.dynamicEntity) {
        this.dynamicEntity = this._addDynamicPolyline(
          () => this._getPositionsWithTemp(),
          COLOR_DISTANCE_DYNAMIC,
          true,
        )
        // 动态段长度标签
        this.tempSegmentLabel = this._addDynamicLabel(
          () => this.tempSegmentText,
          () =>
            this.tempPosition
            || (this.fixedPositions.length ? this.fixedPositions[this.fixedPositions.length - 1] : null),
          '14px',
        )
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    // MOUSE_MOVE: 更新临时点
    this.handler!.setInputAction((_event: any) => {
      if (this.fixedPositions.length === 0) return
      const pos = this._getCartesian((_event as any).endPosition)
      if (!pos) return
      this.tempPosition = pos
      this._updateTempSegmentDistance()
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    // LEFT_DOUBLE_CLICK: 完成（不在这里添加点，避免重复）
    this.handler!.setInputAction((_event: any) => {
      if (this.fixedPositions.length < 2) return

      // 移除动态预览
      if (this.dynamicEntity) {
        this.viewer.entities.remove(this.dynamicEntity)
        this.dynamicEntity = null
      }
      if (this.tempSegmentLabel) {
        this.viewer.entities.remove(this.tempSegmentLabel)
        this.tempSegmentLabel = null
      }

      // 添加最终合并线（覆盖所有点）
      const finalLine = this._addPolyline(this.fixedPositions.slice(), COLOR_DISTANCE, true)
      this.segmentLineEntities.push(finalLine)

      // 标注最后一个点为"终点"：红色
      const lastIdx = this.pointEntities.length - 1
      if (lastIdx >= 0) {
        const lastPtEnt = this.pointEntities[lastIdx]
        if (lastPtEnt.point) {
          (lastPtEnt.point.color as any) = COLOR_POINT_END
        }
      }

      // 结束 handler
      this._destroyHandler()
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

    // RIGHT_CLICK: 撤销最后一个点及相关实体
    this.handler!.setInputAction((_event: any) => {
      if (this.fixedPositions.length === 0) return
      // 移除最后 fixed point
      this.fixedPositions.pop()
      const pEnt = this.pointEntities.pop()
      if (pEnt) this.viewer.entities.remove(pEnt)
      // 移除最后段线 & 标签（如果有）
      const segLine = this.segmentLineEntities.pop()
      if (segLine) this.viewer.entities.remove(segLine)
      const segLabel = this.segmentLabelEntities.pop()
      if (segLabel) this.viewer.entities.remove(segLabel)

      // 如果没有 fixedPositions 了，移除动态预览
      if (this.fixedPositions.length === 0) {
        if (this.dynamicEntity) {
          this.viewer.entities.remove(this.dynamicEntity)
          this.dynamicEntity = null
        }
        if (this.tempSegmentLabel) {
          this.viewer.entities.remove(this.tempSegmentLabel)
          this.tempSegmentLabel = null
        }
        this.tempPosition = null
        this.tempSegmentText = ''
      }
      else {
        // 如果 dynamicEntity 被移除，重新创建以继续绘制
        if (!this.dynamicEntity) {
          this.dynamicEntity = this._addDynamicPolyline(
            () => this._getPositionsWithTemp(),
            COLOR_DISTANCE_DYNAMIC,
            true,
          )
          if (!this.tempSegmentLabel) {
            this.tempSegmentLabel = this._addDynamicLabel(
              () => this.tempSegmentText,
              () =>
                this.tempPosition
                || (this.fixedPositions.length ? this.fixedPositions[this.fixedPositions.length - 1] : null),
              '14px',
            )
          }
        }
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }

  /* ---------- Area events ---------- */
  _bindAreaEvents() {
    // 记录点击时间
    let lastClickTime = 0
    // LEFT_CLICK: 添加点
    this.handler!.setInputAction((_event: any) => {
      const now = Date.now()
      // 防止双击时的第二次 LEFT_CLICK 被重复添加点
      if (now - lastClickTime <= 300) return
      lastClickTime = now

      const cart = this._getCartesian((_event as any).position)
      if (!cart) return
      this.fixedPositions.push(cart)
      const pEnt = this._addPointEntity(cart, COLOR_POINT_MIDDLE, SIZE_POINT_DEFAULT)
      this.pointEntities.push(pEnt)

      this._updateTempArea()

      // 创建动态 polygon（第一次点击）
      if (!this.dynamicEntity) {
        this.dynamicEntity = this._addDynamicPolygon(
          () => this._getPositionsWithTemp(),
          COLOR_AREA_FILL,
          COLOR_AREA_OUTLINE,
        )

        // ✅ 新增：实时轮廓线
        this.dynamicOutline = this._addDynamicPolyline(
          () => {
            const pts = this._getPositionsWithTemp()
            return pts.length > 1 ? pts.concat([pts[0]]) : pts
          },
          COLOR_AREA_OUTLINE,
          true,
        )

        // 实时面积标签
        this.tempAreaLabel = this._addDynamicLabel(
          () => this.tempAreaText,
          () => this._computeCentroid(this._getPositionsWithTemp()),
          'bold 14px',
          true,
        )
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    // MOUSE_MOVE: 更新临时点
    this.handler!.setInputAction((_event: any) => {
      if (this.fixedPositions.length < 1) return
      const pos = this._getCartesian((_event as any).endPosition)
      if (!pos) return
      this.tempPosition = pos
      this._updateTempArea()
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    // LEFT_DOUBLE_CLICK: 完成
    this.handler!.setInputAction((_event: any) => {
      if (this.fixedPositions.length < 3) return

      // 移除动态预览
      if (this.dynamicEntity) {
        this.viewer.entities.remove(this.dynamicEntity)
        this.dynamicEntity = null
      }
      if (this.dynamicOutline) {
        this.viewer.entities.remove(this.dynamicOutline)
        this.dynamicOutline = null
      }
      if (this.tempSegmentLabel) {
        this.viewer.entities.remove(this.tempSegmentLabel)
        this.tempSegmentLabel = null
      }
      if (this.tempAreaLabel) {
        this.viewer.entities.remove(this.tempAreaLabel)
        this.tempAreaLabel = null
      }

      // 最终 polygon
      const poly = this.viewer.entities.add({
        polygon: {
          hierarchy: new Cesium.PolygonHierarchy(this.fixedPositions.slice()),
          material: COLOR_AREA_FILL,
          outline: true,
          outlineColor: COLOR_AREA_OUTLINE,
          // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          classificationType: Cesium.ClassificationType.TERRAIN,
        },
      })
      this.segmentLineEntities.push(poly)

      // 最终贴地轮廓线
      const outline = this._addPolyline(
        this.fixedPositions.slice().concat([this.fixedPositions[0]]),
        COLOR_AREA_OUTLINE,
        true,
      )
      this.segmentLineEntities.push(outline)

      // 计算并显示面积与周长
      const center = this._computeCentroid(this.fixedPositions)
      const label = this._addLabelEntity(center, '计算中...', 'bold 16px', COLOR_LABEL_DEFAULT, true)
      this.segmentLabelEntities.push(label)

      this._computeTerrainArea(this.fixedPositions).then(({ area }) => {
        if (label.label) {
          label.label.text = `面积: ${this._formatArea(area, this.showMu)}`
        }
      })

      this._destroyHandler()
    }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

    // RIGHT_CLICK: 撤销最后一个点
    this.handler!.setInputAction((_event: any) => {
      if (this.fixedPositions.length === 0) return

      // 删除最后一个固定点和点实体
      this.fixedPositions.pop()
      const pEnt = this.pointEntities.pop()
      if (pEnt) this.viewer.entities.remove(pEnt)

      // 删除动态轮廓线和标签
      if (this.dynamicOutline) {
        this.viewer.entities.remove(this.dynamicOutline)
        this.dynamicOutline = null
      }

      if (this.tempAreaLabel) {
        this.viewer.entities.remove(this.tempAreaLabel)
        this.tempAreaLabel = null
        this.tempAreaText = ''
      }

      // 删除最后一段线（如果有）
      const segLine = this.segmentLineEntities.pop()
      if (segLine) this.viewer.entities.remove(segLine)

      // 删除最后一个标签（如果有）
      const segLabel = this.segmentLabelEntities.pop()
      if (segLabel) this.viewer.entities.remove(segLabel)

      // 如果没有剩余点了，删除动态 polygon 和临时段长度标签
      if (this.fixedPositions.length === 0) {
        if (this.dynamicEntity) {
          this.viewer.entities.remove(this.dynamicEntity)
          this.dynamicEntity = null
        }
        if (this.tempSegmentLabel) {
          this.viewer.entities.remove(this.tempSegmentLabel)
          this.tempSegmentLabel = null
        }
        if (this.tempAreaLabel) {
          this.viewer.entities.remove(this.tempAreaLabel)
          this.tempAreaLabel = null
        }
        this.tempPosition = null
        this.tempAreaText = ''
      }
      else {
        // 重新创建动态 polygon 和动态轮廓线
        if (!this.dynamicEntity) {
          this.dynamicEntity = this._addDynamicPolygon(
            () => this._getPositionsWithTemp(),
            COLOR_AREA_FILL,
            COLOR_AREA_OUTLINE,
          )
          this.dynamicOutline = this._addDynamicPolyline(
            () => {
              const pts = this._getPositionsWithTemp()
              return pts.length > 1 ? pts.concat([pts[0]]) : pts
            },
            COLOR_AREA_OUTLINE,
            true,
          )
        }
        if (!this.tempAreaLabel) {
          this.tempAreaLabel = this._addDynamicLabel(
            () => this.tempAreaText,
            () => this._computeCentroid(this._getPositionsWithTemp()),
            'bold 14px',
            true,
          )
        }
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }

  /* ---------- Height events ---------- */
  _bindHeightEvents() {
    this.handler!.setInputAction((_event: any) => {
      const cart = this._getCartesian((_event as any).position)
      if (!cart) return
      this.fixedPositions.push(cart)
      const isFirst = this.fixedPositions.length === 1
      this._addPointEntity(cart, isFirst ? COLOR_POINT_START : COLOR_POINT_END, SIZE_POINT_DEFAULT)

      if (this.fixedPositions.length === 1) {
        // 动态高度线与标签
        this.dynamicEntity = this._addDynamicPolyline(
          () => this._getPositionsWithTemp(),
          COLOR_HEIGHT_DYNAMIC,
          true,
        )
        this.tempHeightLabel = this._addDynamicLabel(
          () => this.tempHeightText,
          () => this._getHeightLabelPosition(),
          'bold 14px',
        )
      }

      if (this.fixedPositions.length === 2) {
        const start = this.fixedPositions[0]
        const end = this.fixedPositions[1]
        this._addPolyline([start, end], COLOR_HEIGHT, true)
        this._computeHeightDiff(start, end).then((diff) => {
          this._addLabelEntity(end, `高度差: ${diff.toFixed(2)} m`, 'bold 16px', COLOR_LABEL_DEFAULT)
        })
        if (this.dynamicEntity) {
          this.viewer.entities.remove(this.dynamicEntity)
          this.dynamicEntity = null
        }
        if (this.tempHeightLabel) {
          this.viewer.entities.remove(this.tempHeightLabel)
          this.tempHeightLabel = null
        }
        this._destroyHandler()
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    // MOUSE_MOVE: 实时高度
    this.handler!.setInputAction((_event: any) => {
      if (this.fixedPositions.length === 0) return
      const pos = this._getCartesian((_event as any).endPosition)
      if (!pos) return
      this.tempPosition = pos
      this._updateTempHeight()
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    // RIGHT_CLICK: 撤销
    this.handler!.setInputAction((_event: any) => {
      if (this.fixedPositions.length === 0) return
      this.fixedPositions.pop()
      const p = this.pointEntities.pop()
      if (p) this.viewer.entities.remove(p)
      this.tempHeightText = ''
      if (this.dynamicEntity) {
        this.viewer.entities.remove(this.dynamicEntity)
        this.dynamicEntity = null
      }
      if (this.tempHeightLabel) {
        this.viewer.entities.remove(this.tempHeightLabel)
        this.tempHeightLabel = null
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }

  /* ---------- 实体创建辅助 ---------- */
  _addPointEntity(
    position: Cesium.Cartesian3,
    color: Cesium.Color = COLOR_POINT_MIDDLE,
    size: number = SIZE_POINT_DEFAULT,
  ) {
    const hr = this.viewer.scene.mode === Cesium.SceneMode.SCENE3D ? Cesium.HeightReference.CLAMP_TO_GROUND : undefined
    const ent = this.viewer.entities.add({
      position,
      point: {
        pixelSize: size,
        color,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: WIDTH_POINT_OUTLINE,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        heightReference: hr,
      },
    })
    return ent
  }

  _addPolyline(
    positionsOrCallback: Cesium.Cartesian3[] | (() => Cesium.Cartesian3[]),
    color: Cesium.Color = COLOR_POINT_MIDDLE,
    clampToGround: boolean = false,
  ) {
    const ent = this.viewer.entities.add({
      polyline: {
        positions: positionsOrCallback,
        width: WIDTH_LINE_DEFAULT,
        material: color,
        clampToGround,
      },
    })
    return ent
  }

  _addLabelEntity(
    position: Cesium.Cartesian3,
    text: string = '',
    font: string = '14px',
    color: Cesium.Color = COLOR_LABEL_DEFAULT,
    clgampToGround: boolean = false,
  ) {
    const ent = this.viewer.entities.add({
      position,
      label: {
        text,
        font,
        fillColor: color,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, LABEL_OFFSET_Y),
        heightReference: clgampToGround ? Cesium.HeightReference.CLAMP_TO_GROUND : undefined,
      },
    })
    return ent
  }

  _addDynamicLabel(
    textCallback: () => string,
    posCallback: () => Cesium.Cartesian3 | null,
    font: string = '14px',
    clgampToGround: boolean = false,
  ) {
    const ent = this.viewer.entities.add({
      position: new Cesium.CallbackProperty(() => posCallback(), false),
      label: {
        text: new Cesium.CallbackProperty(() => textCallback(), false),
        font,
        fillColor: COLOR_LABEL_DEFAULT,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, LABEL_OFFSET_Y),
        heightReference: clgampToGround ? Cesium.HeightReference.CLAMP_TO_GROUND : undefined,
      },
    })
    return ent
  }

  _addDynamicPolyline(
    positionsCallback: () => Cesium.Cartesian3[],
    color: Cesium.Color = COLOR_POINT_MIDDLE,
    clampToGround: boolean = false,
  ) {
    return this.viewer.entities.add({
      polyline: {
        positions: new Cesium.CallbackProperty(() => positionsCallback(), false),
        width: WIDTH_LINE_DEFAULT,
        material: color,
        clampToGround,
      },
    })
  }

  _addDynamicPolygon(
    hierarchyCallback: () => Cesium.Cartesian3[],
    fillColor: Cesium.Color = COLOR_AREA_FILL,
    outlineColor: Cesium.Color = COLOR_AREA_OUTLINE,
  ) {
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

  /* ---------- 计算/格式化 ---------- */
  _getCartesian(screenPosition: Cesium.Cartesian2) {
    let cart = this.viewer.scene.pickPosition(screenPosition)
    if (!cart) cart = this.viewer.camera.pickEllipsoid(screenPosition, this.viewer.scene.globe.ellipsoid)
    return cart
  }

  _getPositionsWithTemp() {
    if (!this.tempPosition) return this.fixedPositions.slice()
    return this.fixedPositions.concat([this.tempPosition])
  }

  _geodesicDistance(c1: Cesium.Cartesian3, c2: Cesium.Cartesian3) {
    if (!c1 || !c2) return 0
    const cg1 = Cesium.Cartographic.fromCartesian(c1)
    const cg2 = Cesium.Cartographic.fromCartesian(c2)
    const geod = new Cesium.EllipsoidGeodesic(cg1, cg2)
    return geod.surfaceDistance
  }

  _computePerimeter(positions: Cesium.Cartesian3[]) {
    let total = 0
    for (let i = 0; i < positions.length; i++) {
      const a = positions[i]
      const b = positions[(i + 1) % positions.length]
      total += this._geodesicDistance(a, b)
    }
    return total
  }

  _computeArea(positions: Cesium.Cartesian3[]) {
    if (!positions || positions.length < 3) return 0
    const R = Cesium.Ellipsoid.WGS84.maximumRadius
    let area = 0
    for (let i = 0; i < positions.length; i++) {
      const c1 = Cesium.Cartographic.fromCartesian(positions[i])
      const c2 = Cesium.Cartographic.fromCartesian(positions[(i + 1) % positions.length])
      area += (c2.longitude - c1.longitude) * (2 + Math.sin(c1.latitude) + Math.sin(c2.latitude))
    }
    area = Math.abs(area) * R * R / 2.0
    return area
  }

  _computeCentroid(positions: Cesium.Cartesian3[]) {
    if (!positions || positions.length === 0) return Cesium.Cartesian3.fromDegrees(0, 0)
    const sum = positions.reduce(
      (acc, p) => {
        acc.x += p.x
        acc.y += p.y
        acc.z += p.z
        return acc
      },
      { x: 0, y: 0, z: 0 },
    )
    const n = positions.length
    const avg = new Cesium.Cartesian3(sum.x / n, sum.y / n, sum.z / n)
    const projected = Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(avg)
    return projected || Cesium.Cartesian3.fromDegrees(0, 0)
  }

  _formatDistance(m: number) {
    if (m >= 1000) return `${(m / 1000).toFixed(3)} km`
    return `${m.toFixed(2)} m`
  }

  _formatArea(m2: number, showMu: boolean = true) {
    if (m2 >= 1000000) {
      const km2 = (m2 / 1e6).toFixed(4)
      const mu = showMu ? ` / ${(m2 / this.muFactor).toFixed(2)} 亩` : ''
      return `${km2} km²${mu}`
    }
    else {
      const mu = showMu ? ` / ${(m2 / this.muFactor).toFixed(2)} 亩` : ''
      return `${m2.toFixed(2)} m²${mu}`
    }
  }

  _destroyHandler() {
    if (this.handler) {
      try {
        this.handler.destroy()
      }
      catch {}
      this.handler = null
    }
    this.tempPosition = null
  }

  _clearAllEntities() {
    (this.pointEntities || []).forEach((e) => {
      try {
        this.viewer.entities.remove(e)
      }
      catch {}
    });
    (this.segmentLineEntities || []).forEach((e) => {
      try {
        this.viewer.entities.remove(e)
      }
      catch {}
    });
    (this.segmentLabelEntities || []).forEach((e) => {
      try {
        this.viewer.entities.remove(e)
      }
      catch {}
    })
    if (this.dynamicEntity) {
      try {
        this.viewer.entities.remove(this.dynamicEntity)
      }
      catch {}
      this.dynamicEntity = null
    }
    if (this.tempSegmentLabel) {
      try {
        this.viewer.entities.remove(this.tempSegmentLabel)
      }
      catch {}
      this.tempSegmentLabel = null
    }
    if (this.tempAreaLabel) {
      try {
        this.viewer.entities.remove(this.tempAreaLabel)
      }
      catch {}
      this.tempAreaLabel = null
    }
    if (this.dynamicOutline) {
      try {
        this.viewer.entities.remove(this.dynamicOutline)
      }
      catch {}
      this.dynamicOutline = null
    }
    if (this.tempHeightLabel) {
      try {
        this.viewer.entities.remove(this.tempHeightLabel)
      }
      catch {}
      this.tempHeightLabel = null
    }

    this.tempSegmentText = ''
    this.tempAreaText = ''
    this.tempHeightText = ''

    this.pointEntities = []
    this.segmentLineEntities = []
    this.segmentLabelEntities = []
    this.fixedPositions = []
    this.tempPosition = null
  }

  _bindEsc() {
    window.addEventListener('keydown', (_e: any) => {
      if ((_e as any).key === 'Escape' || (_e as any).key === 'Esc') {
        this._destroyHandler()
        if (this.dynamicEntity) {
          this.viewer.entities.remove(this.dynamicEntity)
          this.dynamicEntity = null
        }
        if (this.tempSegmentLabel) {
          this.viewer.entities.remove(this.tempSegmentLabel)
          this.tempSegmentLabel = null
        }
        if (this.tempAreaLabel) {
          this.viewer.entities.remove(this.tempAreaLabel)
          this.tempAreaLabel = null
        }
        if (this.dynamicOutline) {
          this.viewer.entities.remove(this.dynamicOutline)
          this.dynamicOutline = null
        }
        this.fixedPositions = []
        this.tempPosition = null
        this.tempSegmentText = ''
        this.tempAreaText = ''
        this.tempHeightText = ''
      }
    })
  }

  async _cartographicsToCartesianWithTerrain(cartos: Cesium.Cartographic[]) {
    const provider = this.viewer.terrainProvider
    try {
      await Cesium.sampleTerrainMostDetailed(provider, cartos)
    }
    catch {}
    return cartos.map((c) => {
      const h = Number.isFinite(c.height) ? c.height : 0
      return Cesium.Cartesian3.fromRadians(c.longitude, c.latitude, h)
    })
  }

  async _sampleTerrainAlongPolyline(points: Cesium.Cartesian3[]) {
    const cartos: Cesium.Cartographic[] = []
    for (let i = 0; i < points.length - 1; i++) {
      const start = Cesium.Cartographic.fromCartesian(points[i])
      const end = Cesium.Cartographic.fromCartesian(points[i + 1])
      const geod = new Cesium.EllipsoidGeodesic(start, end)
      const distance = geod.surfaceDistance
      const steps = Math.max(2, Math.ceil(distance / 50))
      for (let s = 0; s < steps; s++) {
        const frac = s / (steps - 1)
        const c = geod.interpolateUsingFraction(frac)
        cartos.push(new Cesium.Cartographic(c.longitude, c.latitude))
      }
    }
    if (cartos.length === 0) return []
    return this._cartographicsToCartesianWithTerrain(cartos)
  }

  async _computeTerrainDistance(a: Cesium.Cartesian3, b: Cesium.Cartesian3) {
    const sampled = await this._sampleTerrainAlongPolyline([a, b])
    if (sampled.length < 2) return this._geodesicDistance(a, b)
    let total = 0
    for (let i = 1; i < sampled.length; i++) {
      total += Cesium.Cartesian3.distance(sampled[i - 1], sampled[i])
    }
    return total
  }

  async _computeTerrainPerimeter(positions: Cesium.Cartesian3[]) {
    let total = 0
    for (let i = 0; i < positions.length; i++) {
      const a = positions[i]
      const b = positions[(i + 1) % positions.length]
      total += await this._computeTerrainDistance(a, b)
    }
    return total
  }

  async _computeTerrainArea(positions: Cesium.Cartesian3[]) {
    if (!positions || positions.length < 3) return { area: 0, perimeter: 0 }
    const loop = positions.slice().concat([positions[0]])
    const sampled = await this._sampleTerrainAlongPolyline(loop)
    if (sampled.length < 3) {
      return {
        area: this._computeArea(positions),
        perimeter: this._computePerimeter(positions),
      }
    }

    const centroid = this._computeCentroid(sampled)
    let area = 0
    for (let i = 0; i < sampled.length - 1; i++) {
      const v1 = Cesium.Cartesian3.subtract(sampled[i], centroid, new Cesium.Cartesian3())
      const v2 = Cesium.Cartesian3.subtract(sampled[i + 1], centroid, new Cesium.Cartesian3())
      const cross = Cesium.Cartesian3.cross(v1, v2, new Cesium.Cartesian3())
      area += Cesium.Cartesian3.magnitude(cross) / 2
    }

    const perimeter = sampled.slice(0, -1).reduce((acc, _, idx) => {
      const nextIdx = idx + 1
      return acc + Cesium.Cartesian3.distance(sampled[idx], sampled[nextIdx])
    }, 0)

    return { area, perimeter }
  }

  async _updateTempSegmentDistance() {
    if (!this.tempPosition || this.fixedPositions.length === 0) {
      this.tempSegmentText = ''
      return
    }
    const last = this.fixedPositions[this.fixedPositions.length - 1]
    const dist = await this._computeTerrainDistance(last, this.tempPosition)
    this.tempSegmentText = this._formatDistance(dist)
  }

  async _updateTempArea() {
    const pts = this._getPositionsWithTemp()
    if (pts.length < 3) {
      this.tempAreaText = ''
      return
    }
    const { area } = await this._computeTerrainArea(pts)
    this.tempAreaText = `面积: ${this._formatArea(area, this.showMu)}`
  }

  _getHeightLabelPosition() {
  // 高度 label 始终显示在当前鼠标位置
    return this.tempPosition || null
  }

  async _computeHeightDiff(a: Cesium.Cartesian3, b: Cesium.Cartesian3) {
    const cartos = [Cesium.Cartographic.fromCartesian(a), Cesium.Cartographic.fromCartesian(b)]
    await this._cartographicsToCartesianWithTerrain(cartos)
    return cartos[1].height - cartos[0].height
  }

  async _updateTempHeight() {
    if (this.fixedPositions.length === 0 || !this.tempPosition) {
      this.tempHeightText = ''
      return
    }
    const start = this.fixedPositions[0]
    const diff = await this._computeHeightDiff(start, this.tempPosition)
    this.tempHeightText = `高度差: ${diff.toFixed(2)} m`
  }
}
