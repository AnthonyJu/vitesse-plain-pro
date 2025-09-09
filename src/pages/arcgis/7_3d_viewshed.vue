<template>
  <div id="viewshed-map" full bg="light dark:dark" />
</template>

<script setup lang='ts'>
import Viewshed from '@arcgis/core/analysis/Viewshed'
import ViewshedAnalysis from '@arcgis/core/analysis/ViewshedAnalysis'
import ViewshedLayer from '@arcgis/core/layers/ViewshedLayer'

const { view, map } = useArcgis3D('viewshed-map')

const viewshedLayer = new ViewshedLayer({
  title: 'viewshedLayer',
  source: new ViewshedAnalysis(),
})
map.add(viewshedLayer)
view.whenLayerView(viewshedLayer).then((layerView) => {
  layerView.interactive = true

  view.on('click', (e) => {
    const observer = e.mapPoint
    observer.z += 45

    const viewshed = new Viewshed({
      observer,
      farDistance: 1500,
      heading: 0,
      tilt: 90,
      horizontalFieldOfView: 360,
      verticalFieldOfView: 180,
    })

    viewshedLayer.source.viewsheds.add(viewshed)
  })
})
</script>

<style lang='scss' scoped>
::v-deep(.el-scrollbar__view) {
  width: 100%;
  height: 100%;
}
</style>
