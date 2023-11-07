import Map from '@arcgis/core/Map'
import SceneView from '@arcgis/core/views/SceneView'

import '@arcgis/core/assets/esri/themes/light/main.css'

// import '@arcgis/core/assets/esri/themes/dark/main.css'

export interface Arcgis {
  map: Map | null
  view: SceneView | null
}

export function useArcgis3d(container: string) {
  const arcgis: Arcgis = shallowReactive({
    map: null,
    view: null,
  })

  onMounted(() => {
    arcgis.map = new Map({
      basemap: 'satellite',
      ground: 'world-elevation',
    })
    arcgis.view = new SceneView({
      container,
      map: arcgis.map,
      center: [116.6, 35.5],
      zoom: 10,
    })
  })

  return arcgis
}
