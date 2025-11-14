<template>
  <div
    id="camera-view-map"
    ref="mapContainer"
    class="absolute right-15px top-15px z-10 w-400px"
    :style="{ 'aspect-ratio': baseInfo.sensorWidth / baseInfo.sensorHeight }"
  />
</template>

<script setup lang="ts">
const { baseInfo } = defineProps<{
  baseInfo: {
    position: {
      x: number
      y: number
      z: number
    }
    heading: number
    tilt: number
    zoom: number
    focalLength: [number, number]
    sensorWidth: number
    sensorHeight: number
  }
}>()

const emit = defineEmits<{
  updateFrustum: [any]
}>()

const { view } = useArcgis3D('camera-view-map')

// 外置参数变更后的相机
const camera = ref({
  position: [
    baseInfo.position.x,
    baseInfo.position.y,
    baseInfo.position.z,
  ],
  heading: baseInfo.heading,
  tilt: baseInfo.tilt,
  fov: fovCalculate(baseInfo.zoom, baseInfo.focalLength[0]),
})

// fov = 2 * arctan(sensor_height / 2 f) * (180 / Math.PI)
// 在 arcgis 中使用 sensor_height，因为 arcgis fov 是垂直视场角
// sensor_height：传感器高度 f：实时焦距（实时 zoom * 最小焦距）
// 焦距越小，fov越大，视野越广； 焦距越大，fov越小，视野越窄；

// fov 范围：根据最小和最大焦距计算出的 fov 范围
const fovScope = computed(() => {
  const f_min = baseInfo.focalLength[0]
  const f_max = baseInfo.focalLength[1]
  // 最小焦距对应最大 fov，最大焦距对应最小 fov
  return [fovCalculate(1, f_max), fovCalculate(1, f_min)]
})

// 根据 zoom 和 最小焦距 计算 实时焦距
function fovCalculate(zoom: number, focalLength: number) {
  const f = zoom * focalLength
  return 2 * Math.atan(baseInfo.sensorHeight / (2 * f)) * (180 / Math.PI)
}

// 获取地图四个顶点的经纬度
const mapContainer = ref()
const updateFrustumFn = useDebounceFn(updateFrustum, 100)
function updateFrustum() {
  const w = mapContainer.value.clientWidth
  const h = mapContainer.value.clientHeight
  // 获取四个顶点的经纬度
  const boundingBox = [
    view.toMap({ x: 0, y: 0 }),
    view.toMap({ x: w, y: 0 }),
    view.toMap({ x: w, y: h }),
    view.toMap({ x: 0, y: h }),
  ]
  // 组装结果
  const result = {
    boundingBox: boundingBox.map((item) => {
      if (item) return [item.longitude, item.latitude, item.z]
      else return null
    }),
    camera: {
      heading: camera.value.heading,
      tilt: camera.value.tilt,
      zoom: fovToZoom(camera.value.fov),
    },
  }
  emit('updateFrustum', result)
}

// 根据 fov 计算 zoom
function fovToZoom(fov: number) {
  const f_min = baseInfo.focalLength[0]
  const f = baseInfo.sensorHeight / (2 * Math.tan((fov * Math.PI) / 360))
  return Number((f / f_min).toFixed(2))
}

// 设置地图相机
function setMapCamera({ position, heading, tilt, fov } = {}) {
  const _camera = view.camera.clone()
  _camera.position = position || camera.value.position
  if (position) camera.value.position = position

  _camera.heading = heading || camera.value.heading
  if (heading) camera.value.heading = heading

  _camera.tilt = tilt || camera.value.tilt
  if (tilt) camera.value.tilt = tilt

  _camera.fov = fov || camera.value.fov
  if (fov) camera.value.fov = fov

  view.camera = _camera

  updateFrustumFn()
}

view.when(() => {
  setTimeout(() => {
    setMapCamera()
  }, 1000)

  // 拖拽 手动旋转相机
  view.on('drag', (event) => {
    event.stopPropagation() // 阻止默认拖拽行为

    if (event.action === 'update') {
      const _camera = view.camera.clone()

      // 🔄 根据拖动方向旋转
      const zoom = fovToZoom(_camera.fov)
      const heading = _camera.heading - event.native.movementX * 0.1 / zoom

      // 限制 tilt 在 0-90 之间
      const tilt = _camera.tilt + event.native.movementY * 0.1 / zoom
      if (tilt < 0) _camera.tilt = 0
      else if (tilt > 90) _camera.tilt = 90

      setMapCamera({ heading, tilt })
    }
  })

  // 缩放 手动修改相机 fov
  view.on('mouse-wheel', (event) => {
    event.stopPropagation() // 阻止默认缩放行为

    const _camera = view.camera.clone()

    let fov = _camera.fov + event.deltaY * 0.1

    // 限制 fov 在范围内
    if (fov < fovScope.value[0]) fov = fovScope.value[0]
    else if (fov > fovScope.value[1]) fov = fovScope.value[1]

    setMapCamera({ fov })
  })
})
</script>
