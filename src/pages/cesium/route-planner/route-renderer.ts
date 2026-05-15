import type { Viewer } from 'cesium'
import type { MissionResult } from './generate-mission-route'
import type { LargeAreaResult, SubRegionResult } from './large-area-planner'
import { Cartesian3, Color, HeightReference, PolygonHierarchy, VerticalOrigin } from 'cesium'
import EndPng from '@/assets/cesium/end.png'
import PhotoPng from '@/assets/cesium/photo.png'
import PointPng from '@/assets/cesium/point.png'
import StartPng from '@/assets/cesium/start.png'

/**
 * Cesium 航线渲染器
 *
 * 负责：
 * - 单次规划的航线、航点、拍照点、起飞点范围渲染
 * - 大范围规划的子区域、航线渲染
 * - 高亮/取消高亮子区域
 * - 起飞范围、拍照点显示切换
 */
export class RouteRenderer {
  private viewer: Viewer | null = null
  private highlightedSubRegionId: number | null = null
  private showPhotoPoints = false
  private currentSingleData: { polygon: [number, number][][], result: MissionResult, altitude: number } | null = null
  private currentLargeAreaData: {
    originalPolygon: [number, number][][]
    result: LargeAreaResult
    altitude: number
  } | null = null

  init(viewer: Viewer) {
    this.viewer = viewer
  }

  clearAll() {
    this.viewer?.entities.removeAll()
  }

  renderSingleResult(polygon: [number, number][][], result: MissionResult, altitude: number) {
    if (!this.viewer) return
    this.clearAll()

    // 缓存
    this.currentSingleData = { polygon, result, altitude }
    this.currentLargeAreaData = null

    // 1. 渲染任务区域边界
    this.renderPolygon(polygon, Color.RED, 4)

    // 2. 渲染航线
    const points = result.waypoints.map(p =>
      Cartesian3.fromDegrees(p.coordinates[0], p.coordinates[1], altitude),
    )
    this.viewer.entities.add({
      polyline: {
        positions: points,
        width: 3,
        material: Color.YELLOW,
        clampToGround: true,
      },
    })

    // 3. 渲染航点
    result.waypoints.forEach((p, i) => {
      const image = i === 0 ? StartPng : (i === result.waypoints.length - 1 ? EndPng : PointPng)
      this.viewer!.entities.add({
        position: Cartesian3.fromDegrees(p.coordinates[0], p.coordinates[1], altitude),
        billboard: {
          image,
          scale: 0.8,
          verticalOrigin: VerticalOrigin.BOTTOM,
          heightReference: HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      })
    })

    // 4. 渲染拍照点（受开关控制）
    if (this.showPhotoPoints) {
      this.renderPhotoPoints(result, altitude)
    }
  }

  renderLargeAreaResult(originalPolygon: [number, number][][], result: LargeAreaResult, altitude: number) {
    if (!this.viewer) return
    this.clearAll()

    // 缓存
    this.currentLargeAreaData = { originalPolygon, result, altitude }
    this.currentSingleData = null

    // 1. 渲染整个大范围区域外边界（红线，与单次规划一致）
    this.renderPolygon(originalPolygon, Color.RED, 4)

    // 2. 对每个子区域进行渲染
    result.subRegions.forEach((subRegion) => {
      const isActive = this.highlightedSubRegionId !== null && subRegion.id === this.highlightedSubRegionId
      this.renderSubRegion(subRegion, altitude, isActive)
    })
  }

  highlightSubRegion(
    subRegion: SubRegionResult | null,
    altitude: number,
    allSubRegions: SubRegionResult[],
    originalPolygon?: [number, number][][],
  ) {
    if (!this.viewer) return

    // 重新渲染所有子区域
    this.clearAll()

    // 重新画大范围区域红线
    if (originalPolygon) {
      this.renderPolygon(originalPolygon, Color.RED, 4)
    }

    allSubRegions.forEach((sr) => {
      const isActive = subRegion !== null && sr.id === subRegion.id
      this.renderSubRegion(sr, altitude, isActive)
    })

    this.highlightedSubRegionId = subRegion?.id ?? null
  }

  setShowPhotoPoints(val: boolean) {
    this.showPhotoPoints = val
    this.reRender()
  }

  private reRender() {
    if (this.currentSingleData) {
      this.renderSingleResult(
        this.currentSingleData.polygon,
        this.currentSingleData.result,
        this.currentSingleData.altitude,
      )
    }
    else if (this.currentLargeAreaData) {
      this.renderLargeAreaResult(
        this.currentLargeAreaData.originalPolygon,
        this.currentLargeAreaData.result,
        this.currentLargeAreaData.altitude,
      )
    }
  }

  private renderPolygon(polygon: [number, number][][], color: Color, width: number) {
    if (!this.viewer) return

    const positions = polygon[0].map(p =>
      Cartesian3.fromDegrees(p[0], p[1], 0),
    )
    this.viewer.entities.add({
      polyline: {
        positions,
        width,
        material: color,
        clampToGround: true,
      },
    })
  }

  private renderSubRegion(subRegion: SubRegionResult, altitude: number, isActive: boolean) {
    if (!this.viewer) return

    const color = Color.fromCssColorString(subRegion.color)
    const fillColor = isActive ? color.withAlpha(0.35) : color.withAlpha(0.15)
    const outlineColor = isActive ? color : color.withAlpha(0.6)

    // 渲染子区域多边形
    const positions = subRegion.polygon[0].map(p =>
      Cartesian3.fromDegrees(p[0], p[1], 0),
    )
    this.viewer.entities.add({
      polygon: {
        hierarchy: new PolygonHierarchy(positions),
        material: fillColor,
        outline: true,
        outlineColor,
        classificationType: 2, // ClassificationType.TERRAIN
      },
      properties: { subRegionId: subRegion.id },
    })

    // 激活时渲染子区域边界线（清晰的 polyline，比 polygon outline 更醒目）
    if (isActive) {
      this.viewer.entities.add({
        polyline: {
          positions,
          width: 3,
          material: color,
          clampToGround: true,
        },
        properties: { subRegionId: subRegion.id },
      })
    }

    // 渲染子区域航线
    const waypoints = subRegion.missionResult.waypoints
    if (waypoints.length > 1) {
      const points = waypoints.map(p =>
        Cartesian3.fromDegrees(p.coordinates[0], p.coordinates[1], altitude),
      )
      this.viewer.entities.add({
        polyline: {
          positions: points,
          width: isActive ? 3 : 2,
          material: color,
          clampToGround: true,
        },
        properties: { subRegionId: subRegion.id },
      })
    }

    // 只有激活的子区域才渲染详细点位
    if (isActive) {
      subRegion.missionResult.waypoints.forEach((p, i) => {
        const image = i === 0 ? StartPng : (i === subRegion.missionResult.waypoints.length - 1 ? EndPng : PointPng)
        this.viewer!.entities.add({
          position: Cartesian3.fromDegrees(p.coordinates[0], p.coordinates[1], altitude),
          billboard: {
            image,
            scale: 0.8,
            verticalOrigin: VerticalOrigin.BOTTOM,
            heightReference: HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
          },
          properties: { subRegionId: subRegion.id },
        })
      })

      if (this.showPhotoPoints) {
        this.renderPhotoPoints(subRegion.missionResult, altitude, subRegion.id)
      }
    }
  }

  private renderPhotoPoints(result: MissionResult, altitude: number, subRegionId?: number) {
    if (!this.viewer) return

    result.photoPoints.forEach((p) => {
      const entity: any = {
        position: Cartesian3.fromDegrees(p[0], p[1], altitude),
        billboard: {
          image: PhotoPng,
          scale: 0.6,
          verticalOrigin: VerticalOrigin.CENTER,
          heightReference: HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      }
      if (subRegionId !== undefined) {
        entity.properties = { subRegionId }
      }
      this.viewer!.entities.add(entity)
    })
  }
}
