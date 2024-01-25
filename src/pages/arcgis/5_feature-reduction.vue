<template>
  <div id="map" full bg="light dark:dark" />
</template>

<route lang='yaml'>
meta:
  name: 特征缩减（点聚合）
  fullContent: true
</route>

<script setup lang="ts">
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import FeatureLayer from '@arcgis/core/layers/FeatureLayer'
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol'
import SimpleRenderer from '@arcgis/core/renderers/SimpleRenderer'
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol'
import Maker_Png from '@/assets/maker.png'
import '@arcgis/core/assets/esri/themes/light/main.css'

onMounted(() => {
  // 创建 Map 实例
  const map = new Map({ basemap: 'streets-navigation-vector' })

  // 创建 MapView 实例
  const view = new MapView({
    container: 'map',
    map,
    center: [120.38, 36.06],
    zoom: 12,
  })
  // 创建要素数据源

  const layer = new FeatureLayer({
    fields: [
      {
        name: 'name',
        alias: 'name',
        type: 'string',
      },
    ],
    outFields: ['*'],
    objectIdField: 'ObjectID',
    source: Array.from({ length: 1200 }).map((_, index) => {
      return {
        geometry: {
          type: 'point',
          x: 120.3 + Math.random(),
          y: 36 + Math.random(),
          spatialReference: {
            wkid: 4326,
          },
        },
        attributes: {
          ObjectID: index,
          name: `name ${index}`,
        },
      }
    }),
    renderer: new SimpleRenderer({
      symbol: new PictureMarkerSymbol({
        url: Maker_Png,
        width: '24px',
        height: '24px',
      }),
    }),
    featureReduction: {
      type: 'cluster',
      clusterRadius: '200px',
      clusterMinSize: '24px',
      clusterMaxSize: '60px',
      symbol: new SimpleMarkerSymbol({
        color: '#409eff',
        size: 12,
        outline: {
          color: [255, 255, 255],
          width: 2,
        },
      }),
      labelingInfo: [
        {
          labelExpressionInfo: {
            expression: 'Text($feature.cluster_count)',
          },
          symbol: {
            type: 'text',
            color: '#fff',
            font: {
              size: '24px',
            },
          },
          labelPlacement: 'center-center',
          where: 'cluster_count < 10',
        },
        {
          labelExpressionInfo: {
            expression: 'Text($feature.cluster_count)',
          },
          symbol: {
            type: 'text',
            color: 'yellow',
            font: {
              size: '24px',
            },
          },
          labelPlacement: 'center-center',
          where: 'cluster_count >= 10 AND cluster_count < 100',
        },
        {
          labelExpressionInfo: {
            expression: 'Text($feature.cluster_count, \'#,###\')',
          },
          symbol: {
            type: 'text',
            color: 'red',
            font: {
              size: '24px',
            },
          },
          labelPlacement: 'center-center',
          where: 'cluster_count >= 100',
        },
      ],
      // renderer: new SimpleRenderer({
      //   symbol: new SimpleMarkerSymbol({
      //     color: 'green',
      //     size: 12,
      //     outline: {
      //       color: [255, 255, 255],
      //       width: 2,
      //     },
      //   }),
      //   visualVariables: [new ColorVariable({
      //     field: 'cluster_count',
      //     stops: [
      //       { value: 1, color: 'green' },
      //       { value: 10, color: 'yellow' },
      //       { value: 100, color: 'red' },
      //     ],
      //   })],
      // }),
    },
  })

  map.add(layer)

  view.on('click', (event) => {
    view.hitTest(event).then((response) => {
      // eslint-disable-next-line no-console
      console.log(response.results[0])
    })
  })
})
</script>
