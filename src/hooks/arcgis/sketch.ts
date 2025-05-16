import GraphicLayer from '@arcgis/core/layers/GraphicsLayer'
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol'
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol'
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol'
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel'
// https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Sketch-SketchViewModel.html

interface Sketch {
  layer: GraphicLayer
  viewModel: SketchViewModel | null
  canRedo: boolean
  canUndo: boolean
}

type OnComplete = (geometry: __esri.Geometry) => void

const color: string | number[] | __esri.Color = [96, 165, 250, 0.3]
const lineColor: string | number[] | __esri.Color = [96, 165, 250, 0.9]
const lineWidth = 3
const fillColor: string | number[] | __esri.Color = [96, 165, 250, 0.4]
const outlineColor: string | number[] | __esri.Color = [96, 165, 250]
const outlineWidth = 2

export function useSketch(arcgis: Arcgis, asTool?: 'measure' | 'editor' | boolean, onComplete?: OnComplete): Sketch {
  const sketch: Sketch = shallowReactive({
    layer: new GraphicLayer(),
    viewModel: null,
    canRedo: false,
    canUndo: false,
  })

  arcgis.map.add(sketch.layer, 70)

  sketch.viewModel = new SketchViewModel({
    view: arcgis.view,
    layer: sketch.layer,
    // 为true时 将是 横切线与横切面，为false时则直绘制在3d地图上
    defaultCreateOptions: {
      hasZ: false,
    },
    defaultUpdateOptions: {
      enableZ: false,
    },
    updateOnGraphicClick: asTool === true || asTool === 'editor',
    pointSymbol: new SimpleMarkerSymbol({
      color,
      size: 8,
      outline: {
        color: outlineColor,
        width: outlineWidth,
      },
    }),
    polylineSymbol: new SimpleLineSymbol({
      color: lineColor,
      width: lineWidth,
    }),
    polygonSymbol: new SimpleFillSymbol({
      color: fillColor,
      outline: {
        color: outlineColor,
        width: outlineWidth,
      },
    }),
  })

  if (!asTool) {
    // @ts-expect-error An event or an array of events to listen for.
    sketch.viewModel.on(['create', 'delete', 'redo', 'undo', 'update'], (event) => {
      sketch.canRedo = sketch.viewModel!.canRedo()
      sketch.canUndo = sketch.viewModel!.canUndo()

      // 绘制结束
      if (event.state === 'complete') onComplete?.(event.graphic.geometry)
    })
  }

  return sketch
}
