import type { Viewer } from 'cesium'

const viewerMap = new Map<string, Viewer>()
const readyCallbacks = new Map<string, Array<(viewer: Viewer) => void>>()
// 共享的响应式状态
const viewerRefs = new Map<string, ShallowRef<Viewer | undefined>>()
const isReadyRefs = new Map<string, Ref<boolean>>()

function getOrCreateRefs(id: string) {
  if (!viewerRefs.has(id)) {
    viewerRefs.set(id, shallowRef<Viewer>())
  }
  if (!isReadyRefs.has(id)) {
    isReadyRefs.set(id, ref(false))
  }
  return {
    viewer: viewerRefs.get(id)!,
    isReady: isReadyRefs.get(id)!,
  }
}

/**
 * Cesium Viewer 管理 composable
 * @param cesiumId - Cesium 容器 ID
 */
export function useCesium(cesiumId?: string) {
  const id = cesiumId || inject<string>('cesiumId', 'cesiumId')
  const { viewer, isReady } = getOrCreateRefs(id)

  // 注册 viewer
  function registerViewer(v: Viewer) {
    viewerMap.set(id, v)
    viewer.value = v
    isReady.value = true

    // 执行等待中的回调
    const callbacks = readyCallbacks.get(id) || []
    callbacks.forEach(cb => cb(v))
    readyCallbacks.delete(id)
  }

  // 注销 viewer
  function unregisterViewer() {
    viewerMap.delete(id)
    viewer.value = undefined
    isReady.value = false
  }

  // 获取 viewer（同步，可能为 undefined）
  function getViewer(): Viewer | undefined {
    return viewerMap.get(id)
  }

  // 等待 viewer 就绪
  function onViewerReady(callback: (viewer: Viewer) => void) {
    const v = viewerMap.get(id)
    if (v) {
      callback(v)
    }
    else {
      const callbacks = readyCallbacks.get(id) || []
      callbacks.push(callback)
      readyCallbacks.set(id, callbacks)
    }
  }

  return {
    viewer,
    isReady,
    registerViewer,
    unregisterViewer,
    getViewer,
    onViewerReady,
  }
}
