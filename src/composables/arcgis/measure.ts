import Graphic from '@arcgis/core/Graphic'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import Point from '@arcgis/core/geometry/Point'
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine'
import TextSymbol from '@arcgis/core/symbols/TextSymbol'
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol'

export function useMeasure(arcgis: Arcgis) {
  const layer = new GraphicsLayer()
  const sketch = useSketch(arcgis, 'measure')

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
        spatialReference: arcgis.view!.spatialReference,
      }),
      symbol: new SimpleMarkerSymbol({
        color,
        size: 7,
        outline: { color: [0, 0, 0], width: 1 },
      }),
    }))
  }

  // 计算polyline的长度
  function measureLine(polyline: any, point: number[]) {
    let text = ''
    const length = geometryEngine.geodesicLength(polyline, 'meters')

    // polyline的长度大于1000m时，显示为km
    if (length > 1000) text = `${(length / 1000).toFixed(2)} km`
    else text = `${length.toFixed(2)} m`

    layer.graphics.add(new Graphic({
      geometry: new Point({
        x: point[0],
        y: point[1],
        spatialReference: arcgis.view!.spatialReference,
      }),
      symbol: new TextSymbol({
        text,
        xoffset: 3,
        yoffset: 5,
        font: { size: 12 },
      }),
    }))
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
    // polygon的面积大于1000000m2时，显示为km2
    if (area > 1000000) text += `\n 面积：${(area / 1000000).toFixed(2)} km²`
    else text += `\n 面积：${area.toFixed(2)} m²`

    const graphic = new Graphic({
      geometry: new Point({
        x: polygon.centroid.x,
        y: polygon.centroid.y,
        spatialReference: arcgis.view!.spatialReference,
      }),
      symbol: new TextSymbol({
        text,
        font: { size: 12 },
      }),
    })

    arcgis.view!.graphics.removeAll()
    if (state === 'complete') layer.graphics.add(graphic)
    else arcgis.view!.graphics.add(graphic)
  }

  onMounted(() => {
    arcgis.map?.add(layer)
    // @ts-expect-error An event or an array of events to listen for.
    sketch.viewModel?.on(['create', 'delete', 'redo', 'undo', 'update'], (event: any) => {
      const { state, tool, graphic, toolEventInfo } = event

      if (tool === 'polyline') {
        if (state === 'start') {
          addPoint(toolEventInfo.added[0], '#67C23A')
        }
        else if (toolEventInfo?.type === 'vertex-add') {
          addPoint(toolEventInfo.added[0])
          measureLine(graphic.geometry, toolEventInfo.added[0])
        }
        else if (state === 'complete') {
          addPoint(graphic.geometry.paths[0].slice(-1)[0], '#F56C6C')
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
