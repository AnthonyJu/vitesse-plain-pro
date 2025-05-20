interface Options {
  path: string
  levels: any[]
}

export function useMarzipano(panoRef: Ref<HTMLElement | null>, opts: Options) {
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
    const Marzipano = await loadMarzipano()

    viewer.value = new Marzipano.Viewer(panoRef.value, {
      controls: { mouseViewMode: 'drag' },
    })

    const source = Marzipano.ImageUrlSource.fromString(
      `${opts.path}/{z}/{f}/{y}/{x}.jpg`,
      { cubeMapPreviewUrl: `${opts.path}/preview.jpg` },
    )

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
      pinFirstLevel: true,
    })

    scene.value.switchTo()
    view.value.setParameters(initialViewParameters)
  }

  const isRotating = ref(false)
  function changeAutorotate() {
    if (isRotating.value) {
      viewer.value.stopMovement()
    }
    else {
      const autorotate = window.Marzipano.autorotate({
        yawSpeed: 0.1,
        targetPitch: 0,
        targetFov: Math.PI / 2,
      })
      viewer.value.startMovement(autorotate)
    }
  }

  return {
    viewer,
    view,
    scene,
    createPano,
    isRotating,
    changeAutorotate,
  }
}
