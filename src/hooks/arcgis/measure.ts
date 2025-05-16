import * as geometryEngine from '@arcgis/core/geometry/geometryEngine'
import Point from '@arcgis/core/geometry/Point'
import Graphic from '@arcgis/core/Graphic'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol'
import TextSymbol from '@arcgis/core/symbols/TextSymbol'

export function useMeasure(arcgis: Arcgis, isMu = false) {
  const layer = new GraphicsLayer()
  const sketch = useSketch(arcgis, 'measure')

  const textOptions = {
    haloColor: 'black',
    haloSize: 1,
    color: '#fff',
    font: { size: 13 },
    xoffset: 3,
    yoffset: 5,
  }

  // 创建测量类型
  function create(type: 'polyline' | 'polygon' | 'rectangle' | 'circle') {
    sketch.viewModel?.create(type)
  }

  // 移除所有测量结果
  function removeAll() {
    layer.removeAll()
    sketch.layer.removeAll()
  }

  // 给polyline添加折点
  function addPoint(xy: number[], color: string | number[] | __esri.Color = [255, 255, 255]) {
    layer.graphics.add(new Graphic({
      geometry: new Point({
        x: xy[0],
        y: xy[1],
        spatialReference: arcgis.view.spatialReference,
      }),
      symbol: new SimpleMarkerSymbol({
        color,
        size: 8,
        outline: { color: [0, 0, 0], width: 1 },
      }),
    }))
  }

  // 计算polyline的长度
  function measureLine(polyline: __esri.Polyline) {
    let text = ''
    const length = geometryEngine.geodesicLength(polyline, 'meters')

    // polyline的长度大于1000m时，显示为km
    if (length > 1000) text = `${(length / 1000).toFixed(2)} km`
    else text = `${length.toFixed(2)} m`

    return text
  }

  // 计算polygon的面积
  function measurePolygon(polygon: any, state: string) {
    let text = ''

    // 计算polygon周长
    const polyline = geometryEngine.geodesicDensify(polygon, 100, 'meters')
    const length = geometryEngine.geodesicLength(polyline, 'meters')
    // polygon周长大于1000m时，显示为km
    if (length > 1000) text += `周长：${(length / 1000).toFixed(2)} km`
    else text += `周长：${length.toFixed(2)} m`

    // 计算polygon的面积
    const area = geometryEngine.geodesicArea(polygon, 'square-meters')
    if (isMu) {
      text += `\n 面积：${(area / 666.667).toFixed(2)} 亩`
    }
    else {
      // polygon的面积大于1000000m2时，显示为km2
      if (area > 1000000) text += `\n 面积：${(area / 1000000).toFixed(2)} km²`
      else text += `\n 面积：${area.toFixed(2)} m²`
    }

    const graphic = new Graphic({
      geometry: new Point({
        x: polygon.centroid.x,
        y: polygon.centroid.y,
        spatialReference: arcgis.view.spatialReference,
      }),
      symbol: new TextSymbol({ text, ...textOptions }),
    })

    arcgis.view.graphics.removeAll()
    if (state === 'complete') layer.graphics.add(graphic)
    else arcgis.view.graphics.add(graphic)
  }

  // 实时展示测量结果
  let realTimeTextPoint: __esri.Graphic | null = null
  function showRealTimeMeasure(points: [number, number], text: string) {
    const point = new Point({ x: points[0], y: points[1], spatialReference: arcgis.view.spatialReference })
    const symbol = new TextSymbol({ text, ...textOptions })

    if (realTimeTextPoint) {
      realTimeTextPoint.geometry = point
      realTimeTextPoint.symbol = symbol
    }
    else {
      realTimeTextPoint = new Graphic({ geometry: point, symbol })
      layer.graphics.add(realTimeTextPoint)
    }
  }
  function removeRealTimeMeasure() {
    if (realTimeTextPoint) {
      layer.graphics.remove(realTimeTextPoint)
      realTimeTextPoint.destroy()
      realTimeTextPoint = null
    }
  }

  onMounted(() => {
    arcgis.map?.add(layer, 70)
    // @ts-expect-error An event or an array of events to listen for.
    sketch.viewModel?.on(['create', 'delete', 'redo', 'undo', 'update'], (event: any) => {
      const { state, tool, graphic, toolEventInfo } = event

      if (tool === 'polyline') {
        if (state === 'start') {
          addPoint(toolEventInfo.added[0], '#67C23A')
        }
        else if (toolEventInfo?.type === 'cursor-update') {
          useDebounceFn(() => {
            const text = measureLine(graphic.geometry)
            showRealTimeMeasure(toolEventInfo.coordinates, text)
          }, 60)()
        }
        else if (toolEventInfo?.type === 'vertex-add') {
          removeRealTimeMeasure()
          addPoint(toolEventInfo.added[0], '#f6a937')

          const text = measureLine(graphic.geometry)
          layer.graphics.add(new Graphic({
            geometry: new Point({
              x: toolEventInfo.added[0][0],
              y: toolEventInfo.added[0][1],
              spatialReference: arcgis.view.spatialReference,
            }),
            symbol: new TextSymbol({ text, ...textOptions }),
          }))
        }
        else if (state === 'complete') {
          removeRealTimeMeasure()
          addPoint(graphic.geometry.paths[0].slice(-1)[0], '#ff5454')
        }
      }
      else {
        if (graphic && graphic.geometry.rings[0].length > 3) {
          useDebounceFn(() => {
            measurePolygon(graphic.geometry, state)
          }, 300)()
        }
      }
    })
  })

  return { create, removeAll }
}
