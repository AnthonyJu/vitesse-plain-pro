/**
 * 截图当前帧
 * @param videoEl HTMLVideoElement
 * @returns Promise<Blob | null>
 */
export function takeSnapshot(videoEl: HTMLVideoElement): Promise<Blob | null> {
  if (!videoEl || !videoEl.videoWidth || !videoEl.videoHeight) {
    console.warn('⚠️ 视频还未准备好，无法截图')
    return Promise.resolve(null)
  }

  const width = videoEl.videoWidth
  const height = videoEl.videoHeight
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    console.error('⚠️ Canvas 获取上下文失败')
    return Promise.resolve(null)
  }

  ctx.drawImage(videoEl, 0, 0, width, height)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob)
    }, 'image/png')
  })
}

/**
 * 开始录制视频
 * @param videoEl HTMLVideoElement
 * @param options MediaRecorderOptions
 * @returns { start: Function, stop: Function }
 */
export function createRecorder(
  videoEl: HTMLVideoElement,
  options: MediaRecorderOptions = { mimeType: 'video/webm;codecs=vp9' },
) {
  const stream = videoEl.captureStream?.() || (videoEl as any).mozCaptureStream?.()
  if (!stream) throw new Error('当前浏览器不支持 captureStream')

  const chunks: BlobPart[] = []
  const recorder = new MediaRecorder(stream, options)

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size) chunks.push(e.data)
  }

  function stop(filename = 'recording.webm') {
    return new Promise<Blob>((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: options.mimeType || 'video/webm' })
        downloadBlob(blob, filename)
        resolve(blob)
      }
      recorder.stop()
    })
  }

  return {
    start: () => recorder.start(),
    stop,
  }
}

/**
 * 保存 Blob 到本地
 * @param blob Blob
 * @param filename 文件名
 */
export function downloadBlob(blob: Blob, filename = 'file.png') {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
