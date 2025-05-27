interface Options {
  path: string
  levels: any[]
}

// https://www.marzipano.net/docs.html
export function useMarzipano(panoRef: Ref<HTMLElement | null>, opts: Options) {
  const isLoading = ref(false)

  const viewer = shallowRef<any>(null)
  const view = shallowRef<any>(null)
  const scene = shallowRef<any>(null)

  const initialViewParameters = {
    pitch: 0,
    yaw: 0,
    fov: 1.5707963267948966,
  }

  async function loadMarzipano(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (window.Marzipano) return resolve(window.Marzipano)
      const script = document.createElement('script')
      script.src = '/libs/marzipano/marzipano.js'
      script.onload = () => resolve(window.Marzipano)
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  async function createPano() {
    isLoading.value = true
    try {
      const Marzipano = await loadMarzipano()

      viewer.value = new Marzipano.Viewer(panoRef.value, {
        controls: { mouseViewMode: 'drag' },
      })

      const source = Marzipano.ImageUrlSource.fromString(
        `${opts.path}/{z}/{f}/{y}/{x}.jpg`,
        { cubeMapPreviewUrl: `${opts.path}/preview.jpg` },
      )
      source._concurrency = 16
      source._retryDelay = 1000 * 60 * 60 * 24 * 7 // 主要是为了避免在加载失败后频繁请求

      const errorDeb = useDebounceFn(() => {
        ElMessage.error('加载全景图失败')
        isLoading.value = false
      })
      source.addEventListener('networkError', errorDeb)

      const geometry = new Marzipano.CubeGeometry(opts.levels)

      const limiter = Marzipano.RectilinearView.limit.traditional(
        3600,
        100 * Math.PI / 180,
        120 * Math.PI / 180,
      )

      view.value = new Marzipano.RectilinearView(initialViewParameters, limiter)

      scene.value = viewer.value.createScene({
        source,
        geometry,
        view: view.value,
        pinFirstLevel: false,
      })

      scene.value.switchTo()
      view.value.setParameters(initialViewParameters)

      scene.value.layer().addEventListener('renderComplete', (complete: boolean) => {
        if (complete) isLoading.value = false
      })
    }
    catch (error) {
      isLoading.value = false
      console.error('Failed to create pano:', error)
    }
  }

  const isRotating = ref(false)
  function changeAutorotate() {
    if (isRotating.value) {
      isRotating.value = false
      viewer.value.stopMovement()
    }
    else {
      const autorotate = window.Marzipano.autorotate({
        yawSpeed: 0.1,
        targetPitch: 0,
        targetFov: Math.PI / 2,
      })
      viewer.value.startMovement(autorotate)
      isRotating.value = true
    }
  }

  onBeforeUnmount(() => {
    if (viewer.value) {
      viewer.value.destroy()
      viewer.value = null
    }
  })

  return {
    viewer,
    view,
    scene,
    createPano,
    isRotating,
    changeAutorotate,
    isLoading,
  }
}
