import { ElMessage } from 'element-plus'
import { onBeforeUnmount, ref } from 'vue'

/**
 * 视频截屏和录制
 * @param options { containerId?: string, videoRef?: Ref<HTMLVideoElement | null> }
 */
export function useVideoCapture(container: HTMLElement | string) {
  // 判断传入的 container 是否是字符串或 HTMLElement
  function isRefOrString(val: any) {
    if (typeof val === 'string' || (val && typeof val === 'object' && 'value' in val && typeof val.value === 'object')) {
      return document.getElementById(container as string)?.querySelector('video')
    }
    else {
      return val
    }
  }

  /**
   * 截图当前帧
   */
  // TODO 截图资源如果是 mp4 资源不能跨域，否则无法进行 canvas 转为图片的 api
  function takeSnapshot(): Promise<Blob | null> {
    const videoEl = isRefOrString(container)
    if (!videoEl || !videoEl.videoWidth || !videoEl.videoHeight) {
      console.warn('⚠️ video 不存在或未准备好')
      return Promise.resolve(null)
    }
    videoEl.crossOrigin = 'anonymous'

    const width = videoEl.videoWidth
    const height = videoEl.videoHeight
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      console.error('⚠️ Canvas 2D绘制失败')
      return Promise.resolve(null)
    }

    ctx.drawImage(videoEl, 0, 0, width, height)

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          ElMessage.success('截图成功')
          downloadBlob(blob, 'image.png')
          resolve(blob)
        }
        else {
          resolve(null)
        }
      }, 'image/png')
    })
  }

  const isRecording = ref(false)
  let recorder: MediaRecorder | null = null
  let chunks: BlobPart[] = []

  /**
   * 开始录制
   */
  // TODO 录制同样 资源如果是 mp4 资源不能跨域，否则无法进行
  function startRecording(options: MediaRecorderOptions = { mimeType: 'video/mp4' }) {
    const videoEl = isRefOrString(container)
    if (!videoEl) throw new Error('videoEl 未准备好')
    const stream = videoEl.captureStream?.() || (videoEl as any).mozCaptureStream?.()
    if (!stream) throw new Error('当前浏览器不支持 captureStream')

    chunks = []
    recorder = new MediaRecorder(stream, options)

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size) chunks.push(e.data)
    }

    recorder.start()
    isRecording.value = true
  }

  /**
   * 停止录制
   */
  function stopRecording(filename = 'recording.mp4'): Promise<Blob> {
    if (!recorder) throw new Error('尚未开始录制')

    return new Promise((resolve) => {
      recorder!.onstop = () => {
        const blob = new Blob(chunks, { type: recorder?.mimeType || 'video/mp4' })
        downloadBlob(blob, filename)
        isRecording.value = false
        resolve(blob)
      }
      recorder!.stop()
    })
  }

  /**
   * 保存 Blob 到本地
   */
  function downloadBlob(blob: Blob, filename = 'file.png') {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  onBeforeUnmount(() => {
    recorder?.stop()
    recorder = null
  })

  return {
    isRecording,
    takeSnapshot,
    startRecording,
    stopRecording,
  }
}
