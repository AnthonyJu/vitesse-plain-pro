<template>
  <div id="viewer" class="full" />
</template>

<script setup lang='ts'>
import { Viewer } from '@photo-sphere-viewer/core'
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin'
import panoramaImg from '@/assets/panorama/image.png'
import pinImg from '@/assets/panorama/marker.png'

import '@photo-sphere-viewer/core/index.css'
import '@photo-sphere-viewer/markers-plugin/index.css'

onMounted(() => {
  const viewer = new Viewer({
    container: 'viewer',
    panorama: panoramaImg,

    plugins: [
      MarkersPlugin.withConfig({
        markers: [
          {
            id: 'pin',
            position: { yaw: 0.11, pitch: 0.32 },
            image: pinImg,
            size: { width: 32, height: 32 },
            anchor: 'bottom center',
            data: { compass: '#304ACC' },
          },
          {
            id: 'polygon',
            polygon: [
              [6.2208, 0.0906],
              [0.0443, 0.1028],
              [0.2322, 0.0849],
              [0.4531, 0.0387],
              [0.5022, -0.0056],
              [0.4587, -0.0396],
              [0.252, -0.0453],
              [0.0434, -0.0575],
              [6.1302, -0.0623],
              [6.0094, -0.0169],
              [6.0471, 0.032],
              [6.2208, 0.0906],
            ],
            // polygonPixels: [
            //   [2941, 1413],
            //   [3042, 1402],
            //   [3222, 1419],
            //   [3433, 1463],
            //   [3480, 1505],
            //   [3438, 1538],
            //   [3241, 1543],
            //   [3041, 1555],
            //   [2854, 1559],
            //   [2739, 1516],
            //   [2775, 1469],
            //   [2941, 1413],
            // ],
            svgStyle: {
              fill: 'rgba(255,0,0,0.2)',
              stroke: 'rgba(255, 0, 50, 0.8)',
              strokeWidth: '2px',
            },
            data: { compass: 'rgba(255, 0, 50, 0.8)' },
          },
          {
            id: 'polyline',
            polylinePixels: [
              [2478, 1635],
              [2184, 1747],
              [1674, 1953],
              [1166, 1852],
              [709, 1669],
              [301, 1519],
              [94, 1399],
              [34, 1356],
            ],
            svgStyle: {
              stroke: 'rgba(80, 150, 50, 0.8)',
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
              strokeWidth: '20px',
            },
            data: { compass: 'rgba(80, 150, 50, 0.8)' },
          },
        ],
      }),
    ],
  })

  viewer.addEventListener('click', (event) => {
    /* eslint-disable no-console */
    console.log('Viewer clicked:', event)
  })
})
</script>
