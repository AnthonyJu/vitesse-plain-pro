import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import SceneView from '@arcgis/core/views/SceneView'
import ScaleBar from '@arcgis/core/widgets/ScaleBar'
import Zoom from '@arcgis/core/widgets/Zoom'
import '@arcgis/core/assets/esri/themes/light/main.css'

export function useArcgis(container: string) {
  const map = new Map({
    basemap: 'streets-navigation-vector',
  })
  const view = new MapView({
    zoom: 13,
    center: [120.38, 36.06],
    ui: {
      components: [],
    },
    popupEnabled: false,
  })

  const zoom = new Zoom({ view })
  view.ui.add(zoom, 'bottom-right')

  const scale = new ScaleBar({ view, unit: 'metric' })
  view.ui.add(scale, 'bottom-right')

  onMounted(() => {
    view.map = map
    view.container = document.getElementById(container) as HTMLDivElement
  })

  return {
    map,
    view,
  }
}

export function useArcgis3D(container: string) {
  const map = new Map({
    basemap: 'satellite',
    ground: 'world-elevation',
  })
  const view = new SceneView({
    camera: {
      position: {
        x: 120.38,
        y: 36.06,
        z: 2000,
      },
      tilt: 0,
      fov: 75,
      heading: 0,
    },
  })

  onMounted(() => {
    view.map = map
    view.container = document.getElementById(container) as HTMLDivElement
  })

  return {
    map,
    view,
  }
}
