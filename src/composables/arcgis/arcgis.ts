import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'

// import TileLayer from '@arcgis/core/layers/TileLayer'
// import Basemap from '@arcgis/core/Basemap'

import Zoom from '@arcgis/core/widgets/Zoom'
import ScaleBar from '@arcgis/core/widgets/ScaleBar'

import '@arcgis/core/assets/esri/themes/light/main.css'

export function useArcgis(container: string) {
  const arcgis: Arcgis = shallowReactive({
    map: null,
    view: null,
  })

  onMounted(() => {
    // // @ts-expect-error 类型“typeof BaseTileLayer”上不存在属性“createSubclass”。
    // const TintLayer = BaseTileLayer.createSubclass({
    //   properties: {
    //     urlTemplate:
    //     'http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={x}&TILECOL={y}&tk=eae0d50fe5343e4fd7669974d0684bed',
    //   },
    //   getTileUrl(level: any, row: any, col: any) {
    //     return this.urlTemplate
    //       .replace('{z}', level)
    //       .replace('{x}', row)
    //       .replace('{y}', col)
    //   },
    // })
    // const mapBaseMap = new Basemap({
    //   baseLayers: [
    //     new TileLayer({
    //       url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer',
    //     }),
    //   ],
    // })

    // arcgis server
    // const mapBaseMap = new Basemap({
    //   baseLayers: [
    //     new TileLayer({
    //       url: '/arcgis/rest/services/jn/GEO_JN_IMAGES/MapServer',
    //     }),
    //   ],
    // })

    arcgis.map = new Map({ basemap: 'streets-navigation-vector' })
    arcgis.view = new MapView({
      container,
      map: arcgis.map,
      zoom: 13,
      center: [120.38, 36.06],
      ui: {
        components: [],
      },
    })

    // 让鼠标左键点击也可以开启 popup
    arcgis.view.popupEnabled = false

    const zoom = new Zoom({
      view: arcgis.view,
    })
    arcgis.view.ui.add(zoom, 'bottom-right')

    const scale = new ScaleBar({
      view: arcgis.view,
      unit: 'metric',
    })
    arcgis.view.ui.add(scale, 'bottom-right')
  })

  return arcgis
}
