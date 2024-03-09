import SnappingOptions from '@arcgis/core/views/interactive/snapping/SnappingOptions'

export function useEditor(arcgis: Arcgis) {
  const sketch = useSketch(arcgis, 'editor')

  onMounted(() => {
    sketch.viewModel!.snappingOptions = new SnappingOptions({
      enabled: true,
      featureSources: [{ layer: sketch.layer, enabled: true }],
    })
  })

  return sketch
}
