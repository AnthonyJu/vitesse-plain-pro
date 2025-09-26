/**
 * 分片文件上传器组合函数
 * 支持大文件分片上传，具备进度追踪、并行上传、错误处理等功能
 * @returns {object} 包含上传方法和进度状态的对象
 */
export function useSliceUploader() {
  /** 上传进度百分比 (0-100) */
  const percentage = ref(0)

  /**
   * 上传多个文件
   * @param {File[] | FileList} files - 待上传的文件列表
   * @returns {Promise<any[]>} 上传结果数组
   */
  async function upload(files: File[] | FileList) {
    if (!files || !files.length) return []

    /** 并行上传分片数量限制 */
    const parallelLimit = 5
    /** 每个分片大小：5MB */
    const chunk_size = 5 * 1024 * 1024

    /** 计算所有文件的总大小 */
    const totalSize = Array.from(files).reduce((sum, f) => sum + f.size, 0)
    /** 已上传的总字节数 */
    let totalUploadedBytes = 0
    /** 记录每个分片的上传字节数，用于计算总进度 */
    const uploadedBytesMap = {}
    /** 存储上传结果的数组 */
    const results: any[] = []
    /** 中断上传标志 */
    let abort = false

    /**
     * 更新上传进度
     * @param {string} fileKey - 文件标识
     * @param {number} chunkIndex - 分片索引
     * @param {number} loaded - 已上传字节数
     */
    function updateProgress(fileKey, chunkIndex, loaded) {
      const chunkKey = `${fileKey}-${chunkIndex}`
      const prev = uploadedBytesMap[chunkKey] || 0
      uploadedBytesMap[chunkKey] = loaded
      totalUploadedBytes += (loaded - prev)
      percentage.value = Math.min(100, Math.round((totalUploadedBytes / totalSize) * 100))
    }

    // 循环处理每个文件
    for (const file of Array.from(files)) {
      // 检查是否需要中断上传
      if (abort) break

      try {
        // 开始分片上传单个文件
        const mergeResponse = await sliceFileChunks(
          file,
          chunk_size,
          parallelLimit,
          (chunkIndex, loaded) => {
            updateProgress(file.name, chunkIndex, loaded)
          },
          () => abort,
          () => { abort = true },
        )

        results.push(mergeResponse)
      }
      catch (e) {
        console.error(`文件 ${file.name} 上传失败:`, e)

        ElMessage.error('文件上传失败')
        throw new Error('文件上传失败')
      }
    }

    return results
  }

  return {
    upload,
    percentage,
  }
}

/**
 * 分片上传单个文件
 * @param {File} file - 要上传的文件
 * @param {number} chunk_size - 分片大小
 * @param {number} parallelLimit - 并行上传限制
 * @param {Function} onChunkProgress - 分片进度回调函数
 * @param {Function} isAborted - 检查是否中断上传的函数
 * @param {Function} triggerAbort - 触发中断上传的函数
 * @returns {Promise} 文件合并结果
 */
async function sliceFileChunks(file, chunk_size, parallelLimit, onChunkProgress, isAborted, triggerAbort) {
  /** 总分片数量 */
  const TOTAL_CHUNKS = Math.ceil(file.size / chunk_size)
  /** 唯一文件标识符 */
  const FILE_ID = `${file.name}-${file.size}-${Date.now()}`

  /** 已上传完成的分片集合 */
  const uploadedChunks = new Set()
  /** 当前正在上传的分片数量 */
  let currentUploads = 0
  /** 活跃分片数量（包括正在上传和等待上传的） */
  let activeChunks = 0
  /** 当前分片索引 */
  /** 当前分片索引 */
  let chunkIndex = 0

  return new Promise((resolve, reject) => {
    // 使用定时器监控上传状态，每200ms检查一次
    const timer = setInterval(() => {
      // 检查是否中断上传
      if (isAborted()) {
        clearInterval(timer)
        reject(new Error('上传中断'))
        return
      }

      // 所有分片上传完成，执行文件合并
      if (chunkIndex >= TOTAL_CHUNKS && activeChunks === 0) {
        clearInterval(timer)
        request.post('/xchangtu-insur/upload/merge', {
          fileId: FILE_ID,
          filename: file.name,
          totalChunks: TOTAL_CHUNKS,
        }, { timeout: 0 }).then(res => resolve(res.data)).catch(reject)
        return
      }

      // 控制并发上传，在限制范围内启动新的分片上传
      while (currentUploads < parallelLimit && chunkIndex < TOTAL_CHUNKS) {
        // 跳过已上传的分片
        if (uploadedChunks.has(chunkIndex)) {
          chunkIndex++
          continue
        }

        // 计算当前分片的起始和结束位置
        const start = chunkIndex * chunk_size
        const end = Math.min(start + chunk_size, file.size)
        const chunk = file.slice(start, end)
        const currentChunkIndex = chunkIndex++

        // 更新计数器
        currentUploads++
        activeChunks++

        // 启动分片上传
        uploadChunk(chunk, currentChunkIndex, FILE_ID, file.name, onChunkProgress)
          .then(() => {
            uploadedChunks.add(currentChunkIndex)
          })
          .catch(() => {
            triggerAbort()
          })
          .finally(() => {
            currentUploads--
            activeChunks--
          })
      }
    }, 200)
  })
}

/**
 * 上传单个分片
 * @param {Blob} chunk - 文件分片
 * @param {number} index - 分片索引
 * @param {string} fileId - 文件标识符
 * @param {string} filename - 文件名
 * @param {Function} onChunkProgress - 分片上传进度回调
 * @returns {Promise} 上传结果
 */
async function uploadChunk(chunk, index, fileId, filename, onChunkProgress) {
  // 构建表单数据
  const formData = new FormData()
  formData.append('file', chunk, filename)
  formData.append('chunkIndex', index)
  formData.append('fileId', fileId)

  // 发送分片上传请求
  await request.post('/xchangtu-insur/upload/chunk', formData, {
    timeout: 0, // 不设置超时，避免大文件上传失败
    onUploadProgress: (e) => {
      if (e.lengthComputable && typeof onChunkProgress === 'function') {
        onChunkProgress(index, e.loaded, e.total)
      }
    },
  })
}
