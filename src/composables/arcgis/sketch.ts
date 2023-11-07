import GraphicLayer from '@arcgis/core/layers/GraphicsLayer'

// https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Sketch-SketchViewModel.html
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel'
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol'
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol'
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol'

interface Sketch {
  layer: GraphicLayer
  viewModel: SketchViewModel | null
  canRedo: boolean
  canUndo: boolean
}

const color: string | number[] | __esri.Color = [96, 165, 250, 0.6]
const lineWidth = 3
const outlineColor: string | number[] | __esri.Color = [96, 165, 250]
const outlineWidth = 2

export function useSketch(arcgis: Arcgis, asTool?: 'measure' | 'editor'): Sketch {
  const sketch: Sketch = shallowReactive({
    layer: new GraphicLayer(),
    viewModel: null,
    canRedo: false,
    canUndo: false,
  })

  onMounted(() => {
    arcgis.map?.add(sketch.layer)
    sketch.viewModel = new SketchViewModel({
      view: arcgis.view!,
      layer: sketch.layer,
      // 为true时将是横切线与横切面，为false时则直绘制在3d地图上
      // defaultCreateOptions: {
      //   hasZ: false // default value
      // },
      // defaultUpdateOptions: {
      //   enableZ: false // default value
      // },
      updateOnGraphicClick: asTool !== 'measure',
      pointSymbol: new SimpleMarkerSymbol({
        color,
        size: 10,
        outline: {
          color: outlineColor,
          width: outlineWidth,
        },
      }),
      polygonSymbol: new SimpleFillSymbol({
        color,
        outline: {
          color: outlineColor,
          width: outlineWidth,
        },
      }),
      polylineSymbol: new SimpleLineSymbol({
        color,
        width: lineWidth,
      }),
    })

    if (!asTool) {
      // @ts-expect-error An event or an array of events to listen for.
      sketch.viewModel.on(['create', 'delete', 'redo', 'undo', 'update'], () => {
        sketch.canRedo = sketch.viewModel!.canRedo()
        sketch.canUndo = sketch.viewModel!.canUndo()
      })
    }
  })

  return sketch
}
