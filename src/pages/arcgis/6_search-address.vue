<template>
  <div id="map" full bg="light dark:dark" class="relative">
    <SearchAddress class="absolute left-0 top-0 p-10px" @choose="handleChoose" />
    <div class="absolute bottom-0 left-0 p-10px text-12px">
      {{ position }}
    </div>
  </div>
</template>

<script setup lang='ts'>
import PointImg from '@/assets/maker.png'
import Point from '@arcgis/core/geometry/Point'
import Graphic from '@arcgis/core/Graphic'
import Map from '@arcgis/core/Map'
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol'
import MapView from '@arcgis/core/views/MapView'
import SearchAddress from './components/SearchAddress.vue'

const view = shallowRef<MapView>()

const position = ref('')
function handleChoose(val: any) {
  view.value!.graphics.removeAll()
  if (!val) return
  const point = val.split(',')

  const startPoint = new Point({
    latitude: Number(point[1]),
    longitude: Number(point[0]),
  })

  // 如果是 3D 地图，可以查看当前点的海拔高度
  // const elevationResult = await elevationLayer.queryElevation(startPoint)
  // const z = elevationResult.geometry.z + 5

  // const hasZPoint = new Point({
  //   latitude: Number(point[1]),
  //   longitude: Number(point[0]),
  //   z,
  // })

  const startGraphic = new Graphic({
    geometry: startPoint,
    symbol: new PictureMarkerSymbol({
      url: PointImg,
      width: 32,
      height: 32,
    }),
  })

  view.value!.graphics.add(startGraphic)
  view.value!.goTo(
    {
      target: startPoint, // 或者 [x, y]，也可以是 Graphic、Geometry 等
      zoom: 15, // 缩放级别
    },
    {
      speedFactor: 5, // 控制动画速度（越小越慢，越大越快）
      duration: 500, // 动画时长，单位毫秒（优先于 speedFactor）
      animate: true, // 是否开启动画（false 则立即跳转）
    },
  )
}

onMounted(() => {
  // 创建 MapView 实例
  view.value = new MapView({
    container: 'map',
    map: new Map({ basemap: 'streets-navigation-vector' }),
    center: [120.38, 36.06],
    zoom: 12,
    ui: {
      components: [],
    },
  })

  view.value.on('pointer-move', (event) => {
    const point = view.value!.toMap({ x: event.x, y: event.y })
    position.value = `经度: ${point.longitude!.toFixed(8)}, 纬度: ${point.latitude!.toFixed(8)}`
  })
})
</script>
