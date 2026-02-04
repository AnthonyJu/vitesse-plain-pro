<template>
  <div class="video-playback">
    <!-- 登录区域 -->
    <el-card class="login-card" shadow="hover">
      <template #header>
        <span>设备登录</span>
        <el-tag :type="isLogin ? 'success' : 'danger'" style="margin-left: 10px;">
          {{ isLogin ? '已登录' : '未登录' }}
        </el-tag>
      </template>
      <el-form :model="loginForm" label-width="80px" :inline="true">
        <el-form-item label="IP地址">
          <el-input v-model="loginForm.ip" placeholder="设备IP" style="width: 150px;" />
        </el-form-item>
        <el-form-item label="端口">
          <el-input v-model="loginForm.port" placeholder="端口" style="width: 80px;" />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="loginForm.username" placeholder="用户名" style="width: 120px;" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            style="width: 120px;"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loginLoading" @click="handleLogin">登录</el-button>
          <el-button :disabled="!isLogin" @click="handleLogout">注销</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 实时预览 + 云台控制 -->
    <el-row :gutter="15" style="margin-top: 15px;">
      <!-- 左侧：实时预览 -->
      <el-col :span="12">
        <el-card class="preview-card" shadow="hover">
          <template #header>
            <div class="video-header">
              <span>实时预览</span>
              <div class="preview-controls">
                <el-select v-model="previewChannel" placeholder="通道" style="width: 120px;" size="small">
                  <el-option
                    v-for="item in channelList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-select v-model="streamType" placeholder="码流" style="width: 100px; margin-left: 8px;" size="small">
                  <el-option
                    v-for="item in streamOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <el-button
                  type="primary"
                  size="small"
                  :disabled="!isLogin || isPreviewing"
                  style="margin-left: 8px;"
                  @click="handleStartPreview"
                >
                  开始预览
                </el-button>
                <el-button size="small" :disabled="!isPreviewing" @click="handleStopPreview">
                  停止预览
                </el-button>
              </div>
            </div>
          </template>
          <!-- 预览视频区域 -->
          <div ref="previewContainer" class="video-container preview-video">
            <canvas ref="previewCanvasRef" class="video-canvas" />
            <video ref="previewVideoRef" class="video-element" />
            <div v-if="previewLoading" class="video-loading">
              <el-icon class="is-loading"><Loading /></el-icon>
              <span>加载中...</span>
            </div>
          </div>
          <!-- 预览控制按钮 -->
          <div class="preview-toolbar">
            <el-space wrap>
              <span style="font-size: 12px;">音量:</span>
              <el-slider
                v-model="volume"
                :min="0"
                :max="1"
                :step="0.1"
                style="width: 80px;"
                size="small"
              />
              <el-button :disabled="!isPreviewing" size="small" @click="handleTurnOnSound">
                <el-icon><Microphone /></el-icon> 打开声音
              </el-button>
              <el-button :disabled="!isPreviewing" size="small" @click="handleTurnOffSound">
                <el-icon><Mute /></el-icon> 关闭声音
              </el-button>
              <el-button :disabled="!isPreviewing" size="small" @click="handleCapture">
                <el-icon><Camera /></el-icon> 抓图
              </el-button>
              <el-button
                :disabled="!isPreviewing || isRecording"
                size="small"
                type="success"
                @click="handleStartRecord"
              >
                <el-icon><VideoCamera /></el-icon> 开始录像
              </el-button>
              <el-button
                :disabled="!isRecording"
                size="small"
                type="danger"
                @click="handleStopRecord"
              >
                <el-icon><VideoCameraFilled /></el-icon> 停止录像
              </el-button>
            </el-space>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：云台控制 -->
      <el-col :span="12">
        <el-card class="ptz-card" shadow="hover">
          <template #header>
            <span>云台控制</span>
          </template>
          <!-- 步长设置 -->
          <div class="ptz-step">
            <span>步长 (1-8):</span>
            <el-select v-model="ptzStep" style="width: 80px; margin-left: 8px;" size="small">
              <el-option v-for="i in 8" :key="i" :label="i" :value="i" />
            </el-select>
          </div>
          <!-- 方向控制 -->
          <div class="ptz-direction">
            <div class="ptz-row">
              <el-button
                :disabled="!isPreviewing"
                @mousedown="handlePTZ('LeftUp', false)"
                @mouseup="handlePTZ('LeftUp', true)"
              >
                ↖
              </el-button>
              <el-button
                :disabled="!isPreviewing"
                @mousedown="handlePTZ('Up', false)"
                @mouseup="handlePTZ('Up', true)"
              >
                ↑
              </el-button>
              <el-button
                :disabled="!isPreviewing"
                @mousedown="handlePTZ('RightUp', false)"
                @mouseup="handlePTZ('RightUp', true)"
              >
                ↗
              </el-button>
            </div>
            <div class="ptz-row">
              <el-button
                :disabled="!isPreviewing"
                @mousedown="handlePTZ('Left', false)"
                @mouseup="handlePTZ('Left', true)"
              >
                ←
              </el-button>
              <el-button
                :disabled="!isPreviewing"
                type="primary"
                @mousedown="handlePTZ('Auto', false)"
                @mouseup="handlePTZ('Auto', true)"
              >
                自动
              </el-button>
              <el-button
                :disabled="!isPreviewing"
                @mousedown="handlePTZ('Right', false)"
                @mouseup="handlePTZ('Right', true)"
              >
                →
              </el-button>
            </div>
            <div class="ptz-row">
              <el-button
                :disabled="!isPreviewing"
                @mousedown="handlePTZ('LeftDown', false)"
                @mouseup="handlePTZ('LeftDown', true)"
              >
                ↙
              </el-button>
              <el-button
                :disabled="!isPreviewing"
                @mousedown="handlePTZ('Down', false)"
                @mouseup="handlePTZ('Down', true)"
              >
                ↓
              </el-button>
              <el-button
                :disabled="!isPreviewing"
                @mousedown="handlePTZ('RightDown', false)"
                @mouseup="handlePTZ('RightDown', true)"
              >
                ↘
              </el-button>
            </div>
          </div>
          <!-- 变倍聚焦 -->
          <el-divider content-position="left">变倍/聚焦/光圈</el-divider>
          <div class="ptz-zoom">
            <el-button-group>
              <el-button
                :disabled="!isPreviewing"
                size="small"
                @mousedown="handlePTZ('ZoomWide', false)"
                @mouseup="handlePTZ('ZoomWide', true)"
              >
                变倍-
              </el-button>
              <el-button
                :disabled="!isPreviewing"
                size="small"
                @mousedown="handlePTZ('ZoomTele', false)"
                @mouseup="handlePTZ('ZoomTele', true)"
              >
                变倍+
              </el-button>
            </el-button-group>
            <el-button-group style="margin-left: 8px;">
              <el-button
                :disabled="!isPreviewing"
                size="small"
                @mousedown="handlePTZ('FocusFar', false)"
                @mouseup="handlePTZ('FocusFar', true)"
              >
                聚焦-
              </el-button>
              <el-button
                :disabled="!isPreviewing"
                size="small"
                @mousedown="handlePTZ('FocusNear', false)"
                @mouseup="handlePTZ('FocusNear', true)"
              >
                聚焦+
              </el-button>
            </el-button-group>
            <el-button-group style="margin-left: 8px;">
              <el-button
                :disabled="!isPreviewing"
                size="small"
                @mousedown="handlePTZ('IrisSmall', false)"
                @mouseup="handlePTZ('IrisSmall', true)"
              >
                光圈-
              </el-button>
              <el-button
                :disabled="!isPreviewing"
                size="small"
                @mousedown="handlePTZ('IrisLarge', false)"
                @mouseup="handlePTZ('IrisLarge', true)"
              >
                光圈+
              </el-button>
            </el-button-group>
          </div>
          <!-- 预置点 -->
          <el-divider content-position="left">预置点</el-divider>
          <div class="ptz-preset">
            <el-input-number
              v-model="presetNum"
              :min="1"
              :max="255"
              size="small"
              style="width: 100px;"
            />
            <el-button
              :disabled="!isPreviewing"
              size="small"
              style="margin-left: 8px;"
              @click="handlePTZ('GotoPreset', false)"
            >
              查看
            </el-button>
            <el-button
              :disabled="!isPreviewing"
              size="small"
              @click="handlePTZ('SetPreset', false)"
            >
              设置
            </el-button>
            <el-button
              :disabled="!isPreviewing"
              size="small"
              @click="handlePTZ('ClearPreset', false)"
            >
              删除
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 录像查询区域 -->
    <el-card class="search-card" shadow="hover" style="margin-top: 15px;">
      <template #header>
        <span>录像查询</span>
      </template>
      <el-form :model="searchForm" label-width="80px" :inline="true">
        <el-form-item label="通道">
          <el-select v-model="searchForm.channel" placeholder="选择通道" style="width: 150px;">
            <el-option
              v-for="item in channelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="searchForm.startTime"
            type="datetime"
            placeholder="开始时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="searchForm.endTime"
            type="datetime"
            placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="!isLogin"
            :loading="searchLoading"
            @click="handleSearch"
          >
            查询录像
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 录像回放区域 -->
    <el-row :gutter="15" style="margin-top: 15px;">
      <!-- 视频播放区域 -->
      <el-col :span="12">
        <el-card class="video-card" shadow="hover">
          <template #header>
            <div class="video-header">
              <span>录像回放</span>
              <el-tag v-if="currentPlayer">{{ playSpeed }}X</el-tag>
            </div>
          </template>
          <div ref="videoContainer" class="video-container">
            <canvas ref="canvasRef" class="video-canvas" />
            <video ref="videoRef" class="video-element" />
            <canvas ref="ivsCanvasRef" class="ivs-canvas" />
            <div v-if="videoLoading" class="video-loading">
              <el-icon class="is-loading"><Loading /></el-icon>
              <span>加载中...</span>
            </div>
          </div>
          <!-- 时间进度条 -->
          <div class="timeline-control">
            <span class="time-text">{{ currentPlayTime }}</span>
            <el-slider
              v-model="sliderValue"
              :disabled="!currentPlayer"
              :show-tooltip="false"
              class="timeline-slider"
              @mousedown="isDragging = true"
              @mouseup="handleSliderMouseUp"
              @change="handleProgressChange"
            />
            <span class="time-text">{{ recordEndTime || '--:--:--' }}</span>
          </div>
          <!-- 播放控制按钮 -->
          <div class="playback-toolbar">
            <el-button-group>
              <el-button size="small" :disabled="!currentPlayer" @click="handleSlow">
                <el-icon><DArrowLeft /></el-icon> 慢放
              </el-button>
              <el-button size="small" :disabled="!currentPlayer" @click="handlePause">
                <el-icon><VideoPause /></el-icon> 暂停
              </el-button>
              <el-button size="small" :disabled="!currentPlayer" @click="handlePlay">
                <el-icon><VideoPlay /></el-icon> 播放
              </el-button>
              <el-button size="small" :disabled="!currentPlayer" @click="handleFast">
                快进 <el-icon><DArrowRight /></el-icon>
              </el-button>
              <el-button
                size="small"
                :disabled="!currentPlayer"
                type="danger"
                @click="handleStop"
              >
                <el-icon><CircleClose /></el-icon> 停止
              </el-button>
            </el-button-group>
          </div>
        </el-card>
      </el-col>

      <!-- 录像列表区域 -->
      <el-col :span="12">
        <el-card class="record-card" shadow="hover">
          <template #header>
            <span>录像列表 (共 {{ recordList.length }} 条)</span>
          </template>
          <el-table
            :data="paginatedRecords"
            style="width: 100%;"
            height="400"
            highlight-current-row
            size="small"
            @row-dblclick="handlePlayRecord"
          >
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="StartTime" label="开始时间" />
            <el-table-column prop="EndTime" label="结束时间" />
            <el-table-column label="大小">
              <template #default="{ row }">
                {{ formatSize(row.Length) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="{ row, $index }">
                <el-button type="primary" link size="small" @click="handlePlayRecord(row, $index)">
                  播放
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="recordList.length"
            layout="prev, pager, next"
            style=" justify-content: center;margin-top: 10px;"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import {
  Camera,
  CircleClose,
  DArrowLeft,
  DArrowRight,
  Loading,
  Microphone,
  Mute,
  VideoCamera,
  VideoCameraFilled,
  VideoPause,
  VideoPlay,
} from '@element-plus/icons-vue'

// const { load } =
useScriptTag(
  '/libs/dh-nvr-sdk/module/PlayerControl.js',
  // play,
  // { manual: true },
)

// ==================== 响应式数据 ====================

// 登录相关
const isLogin = ref(false)
const loginLoading = ref(false)
const loginForm = reactive({
  ip: '10.108.2.89',
  port: '80',
  username: 'admin',
  password: 'SDbztt2025#',
})

// 查询相关
const searchLoading = ref(false)
const channelList = ref([])
const searchForm = reactive({
  channel: 0,
  startTime: '',
  endTime: '',
})

// 录像列表
const recordList = ref([])
const currentPage = ref(1)
const pageSize = 10

// 视频播放
const videoContainer = ref(null)
const canvasRef = ref(null)
const videoRef = ref(null)
const ivsCanvasRef = ref(null)
const videoLoading = ref(false)
const currentPlayer = ref(null)
const playSpeed = ref(1)
const currentTime = ref(0)
const totalTime = ref(0)
const seekTime = ref(0)
const sliderValue = ref(0)
const isDragging = ref(false)
const recordStartTime = ref('')
const recordEndTime = ref('')

// 实时预览相关
const previewChannel = ref(0)
const streamType = ref(0)
const volume = ref(0.5)
const isPreviewing = ref(false)
const isRecording = ref(false)
const previewPlayer = ref(null)
const recordPlayer = ref(null)
const previewLoading = ref(false)
const previewContainer = ref(null)
const previewCanvasRef = ref(null)
const previewVideoRef = ref(null)
const streamOptions = ref([
  { label: '主码流', value: 0 },
  { label: '辅码流', value: 1 },
])

// 云台控制相关
const ptzStep = ref(5)
const presetNum = ref(1)

// 大华 SDK 动态加载
let playerControlPromise = null
let PlayerControlCtor = null
function ensurePlayerControl() {
  if (PlayerControlCtor) return Promise.resolve(PlayerControlCtor)

  if (typeof window !== 'undefined' && window.PlayerControl) {
    PlayerControlCtor = window.PlayerControl
    return Promise.resolve(PlayerControlCtor)
  }

  if (!playerControlPromise) {
    playerControlPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-player-control]')
      if (existing) {
        existing.addEventListener('load', () => resolve(window.PlayerControl))
        existing.addEventListener('error', () => reject(new Error('PlayerControl 脚本加载失败')))
        return
      }

      const script = document.createElement('script')
      script.src = '/libs/dh-nvr-sdk/module/PlayerControl.js'
      script.dataset.playerControl = 'true'
      script.async = true
      script.onload = () => {
        if (window.PlayerControl) {
          PlayerControlCtor = window.PlayerControl
          resolve(PlayerControlCtor)
        }
        else {
          reject(new Error('PlayerControl 未在全局暴露'))
        }
      }
      script.onerror = () => reject(new Error('PlayerControl 脚本加载失败'))
      document.head.appendChild(script)
    })
  }

  return playerControlPromise
}

// ==================== 计算属性 ====================

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return recordList.value.slice(start, start + pageSize)
})

// 进度百分比
const progressPercent = computed(() => {
  if (totalTime.value === 0) return 0
  return (currentTime.value / totalTime.value) * 100
})

// 同步进度条值（非拖拽时）
watch(progressPercent, (val) => {
  if (!isDragging.value) {
    sliderValue.value = val
  }
})

// 当前播放时间（根据录像开始时间和播放进度计算）
const currentPlayTime = computed(() => {
  if (!recordStartTime.value) return '--:--:--'
  // 解析开始时间
  const startDate = new Date(recordStartTime.value.replace(' ', 'T'))
  if (Number.isNaN(startDate.getTime())) return recordStartTime.value
  // 加上当前播放秒数
  const currentDate = new Date(startDate.getTime() + currentTime.value * 1000)
  // 格式化为 HH:mm:ss
  const h = String(currentDate.getHours()).padStart(2, '0')
  const m = String(currentDate.getMinutes()).padStart(2, '0')
  const s = String(currentDate.getSeconds()).padStart(2, '0')
  return `${h}:${m}:${s}`
})

// ==================== 方法 ====================

// 初始化默认时间
function initDefaultTime() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  searchForm.startTime = `${year}-${month}-${day} 00:00:00`
  searchForm.endTime = `${year}-${month}-${day} 23:59:59`
}

// 格式化文件大小
function formatSize(bytes) {
  if (!bytes) return '0 KB'
  const kb = Math.round(bytes / 1024)
  if (kb < 1024) return `${kb} KB`
  return `${(kb / 1024).toFixed(2)} MB`
}

// 登录
async function handleLogin() {
  if (!loginForm.ip || !loginForm.username || !loginForm.password) {
    ElMessage.warning('请填写完整的登录信息')
    return
  }

  loginLoading.value = true
  const target = `${loginForm.ip}:${loginForm.port}`

  try {
    // 设置IP (假设 setIP 是全局函数)
    if (typeof setIP === 'function') {
      setIP(target)
    }

    // 调用 RPC 登录
    await RPC.login(loginForm.username, loginForm.password, false)

    // 保活
    if (typeof RPC.keepAlive === 'function') {
      RPC.keepAlive(300, 60000, _getSession(), target)
    }

    isLogin.value = true
    ElMessage.success('登录成功')

    // 获取通道列表
    await fetchChannelList()
  }
  catch (err) {
    console.error('登录失败:', err)
    ElMessage.error(`登录失败: ${err.message || '未知错误'}`)
  }
  finally {
    loginLoading.value = false
  }
}

// 注销
async function handleLogout() {
  try {
    // 停止当前播放
    handleStop()
    // 停止预览
    handleStopPreview()

    await RPC.Global.logout()
    isLogin.value = false
    channelList.value = []
    recordList.value = []
    ElMessage.success('已注销')
  }
  catch (err) {
    console.error('注销失败:', err)
  }
}

// 获取通道列表
async function fetchChannelList() {
  try {
    // NVR 设备
    const params = await RPC.LogicDeviceManager.getCameraAll()
    channelList.value = params.camera
      .filter(item => item.DeviceInfo?.VideoInputs && item.DeviceID && item.Channel === 0)
      .map((item) => {
        return {
          label: item.DeviceInfo.Address,
          value: item.UniqueChannel,
        }
      })
    if (channelList.value.length > 0) {
      searchForm.channel = channelList.value[0].value
      previewChannel.value = channelList.value[0].value
    }

    // 获取码流类型
    await fetchStreamOptions()
  }
  catch (err) {
    console.error('获取通道列表失败:', err)
  }
}

// 获取码流类型
async function fetchStreamOptions() {
  try {
    const params = await RPC.MagicBox.getProductDefinition('MaxExtraStream')
    const maxExtra = params.definition || 1
    const options = [{ label: '主码流', value: 0 }]
    if (maxExtra > 1) {
      for (let i = 1; i <= maxExtra; i++) {
        options.push({ label: `辅码流${i}`, value: i })
      }
    }
    else {
      options.push({ label: '辅码流', value: 1 })
    }
    streamOptions.value = options
  }
  catch (err) {
    console.error('获取码流类型失败:', err)
  }
}

// 查询录像
async function handleSearch() {
  if (!searchForm.startTime || !searchForm.endTime) {
    ElMessage.warning('请选择时间范围')
    return
  }

  searchLoading.value = true
  recordList.value = []
  currentPage.value = 1

  try {
    const params = {
      condition: {
        Channels: [searchForm.channel],
        StartTime: searchForm.startTime,
        EndTime: searchForm.endTime,
        Flags: ['*'],
        Events: ['*'],
        Mode: 'Event',
        Types: ['dav'],
        VideoStream: 'Main',
      },
    }

    // 创建查询实例
    const instanceRes = await RPC.MediaFileFind.instance()
    const queryId = instanceRes.result

    // 设置查询条件
    await RPC.MediaFileFind.findFile(queryId, params)

    // 递归查询所有文件
    const allRecords = []
    const findNext = async () => {
      const data = await RPC.MediaFileFind.findNextFile(queryId, { count: 100 })
      if (Number.isInteger(data.found) && data.found > 0) {
        allRecords.push(...data.infos)
        if (data.found === 100) {
          await findNext()
        }
      }
    }

    await findNext()

    // 关闭查询
    await RPC.MediaFileFind.close(queryId)
    RPC.MediaFileFind.destroy(queryId)

    recordList.value = allRecords
    ElMessage.success(`查询到 ${allRecords.length} 条录像`)
  }
  catch (err) {
    console.error('查询录像失败:', err)
    if (err?.error?.code === 285409409) {
      ElMessage.error('回放功能需要确保SD卡经过设备认证')
    }
    else {
      ElMessage.error('查询失败: 无数据或发生错误')
    }
  }
  finally {
    searchLoading.value = false
  }
}

// 播放录像
async function handlePlayRecord(row, index) {
  // 先停止当前播放
  handleStop()

  videoLoading.value = true
  playSpeed.value = 1
  currentTime.value = 0
  totalTime.value = 0

  // 记录录像的开始和结束时间
  recordStartTime.value = row.StartTime || ''
  recordEndTime.value = row.EndTime || ''

  const { username, password } = loginForm
  const url = row.FilePath
  const _ip = location.hostname
  const _port = location.port || 80
  const options = {
    wsURL: `ws://${_ip}:${_port}/rtspoverwebsocket`,
    rtspURL: `rtsp://${_ip}:${_port}/${url}`,
    username,
    password,
    lessRateCanvas: true,
    playback: true,
    isPrivateProtocol: false,
    realm: RPC.realm,
    playbackIndex: index,
  }

  let PlayerControl
  try {
    PlayerControl = await ensurePlayerControl()
  }
  catch (e) {
    videoLoading.value = false
    ElMessage.error(e?.message || '播放器加载失败')
    return
  }

  const player = new PlayerControl(options)

  let firstTime = 0

  player.on('PlayStart', () => {
    videoLoading.value = false
  })

  player.on('DecodeStart', (e) => {
    if (e.decodeMode === 'video') {
      videoRef.value.style.display = ''
      canvasRef.value.style.display = 'none'
    }
    else {
      videoRef.value.style.display = 'none'
      canvasRef.value.style.display = ''
    }
    currentPlayer.value = player
  })

  player.on('UpdateCanvas', (e) => {
    if (firstTime === 0) {
      firstTime = e.timestamp
    }
    currentTime.value = Math.floor(e.timestamp - firstTime)
  })

  player.on('GetTotalTime', (e) => {
    totalTime.value = e
  })

  player.on('Error', (e) => {
    console.error('播放错误:', e)
    videoLoading.value = false
    ElMessage.error('播放出错')
  })

  player.on('WorkerReady', () => {
    player.connect()
  })

  player.init(canvasRef.value, videoRef.value)
}

// 暂停
function handlePause() {
  if (currentPlayer.value) {
    currentPlayer.value.pause()
    ElMessage.info('已暂停')
  }
}

// 播放
function handlePlay() {
  if (currentPlayer.value) {
    currentPlayer.value.play()
    ElMessage.info('继续播放')
  }
}

// 停止
function handleStop() {
  if (currentPlayer.value) {
    currentPlayer.value.stop()
    currentPlayer.value.close()
    currentPlayer.value = null

    // 隐藏视频元素
    if (canvasRef.value) canvasRef.value.style.display = 'none'
    if (videoRef.value) videoRef.value.style.display = 'none'

    playSpeed.value = 1
    currentTime.value = 0
    totalTime.value = 0
  }
}

// 慢放
function handleSlow() {
  if (!currentPlayer.value) return
  if (playSpeed.value <= 0.125) return

  playSpeed.value = playSpeed.value / 2
  currentPlayer.value.playFF(playSpeed.value)
  ElMessage.info(`播放速度: ${playSpeed.value}X`)
}

// 快进
function handleFast() {
  if (!currentPlayer.value) return
  if (playSpeed.value >= 8) return

  playSpeed.value = playSpeed.value * 2
  currentPlayer.value.playFF(playSpeed.value)
  ElMessage.info(`播放速度: ${playSpeed.value}X`)
}

// 跳转
function _handleSeek() {
  if (currentPlayer.value && seekTime.value >= 0) {
    currentPlayer.value.playByTime(seekTime.value)
    ElMessage.info(`跳转到 ${seekTime.value} 秒`)
  }
}

// 格式化播放时间 (秒 -> HH:MM:SS)
function _formatPlayTime(seconds) {
  if (!seconds || seconds < 0) return '00:00:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// 进度条变化处理
function handleProgressChange(val) {
  if (currentPlayer.value && totalTime.value > 0) {
    const targetTime = Math.floor((val / 100) * totalTime.value)
    currentPlayer.value.playByTime(targetTime)
  }
  isDragging.value = false
}

// 滑块鼠标抬起
function handleSliderMouseUp() {
  // 延迟重置拖拽状态，确保change事件先触发
  setTimeout(() => {
    isDragging.value = false
  }, 100)
}

// ==================== 实时预览相关方法 ====================

// 开始预览
async function handleStartPreview() {
  if (!isLogin.value) {
    ElMessage.warning('请先登录')
    return
  }

  previewLoading.value = true
  const { username, password } = loginForm
  const curChannel = previewChannel.value + 1 // 无插件通道号从1开始
  const stream = streamType.value

  const _ip = location.hostname
  const _port = location.port || 80

  const options = {
    wsURL: `ws://${_ip}:${_port}/rtspoverwebsocket`,
    rtspURL: `rtsp://${_ip}:${_port}/cam/realmonitor?channel=${curChannel}&subtype=${stream}&proto=Private3`,
    username,
    password,
    lessRateCanvas: true,
    playback: false,
    isPrivateProtocol: false,
    realm: RPC.realm,
  }

  let PlayerControl
  try {
    PlayerControl = await ensurePlayerControl()
  }
  catch (e) {
    previewLoading.value = false
    ElMessage.error(e?.message || '播放器加载失败')
    return
  }

  const player = new PlayerControl(options)

  player.on('PlayStart', () => {
    previewLoading.value = false
    isPreviewing.value = true
    ElMessage.success('预览已开始')
  })

  player.on('DecodeStart', (e) => {
    if (e.decodeMode === 'video') {
      previewVideoRef.value.style.display = ''
      previewCanvasRef.value.style.display = 'none'
    }
    else {
      previewVideoRef.value.style.display = 'none'
      previewCanvasRef.value.style.display = ''
    }
    previewPlayer.value = player
  })

  player.on('Error', (e) => {
    console.error('预览错误:', e)
    previewLoading.value = false
    ElMessage.error('预览出错')
  })

  player.on('WorkerReady', () => {
    player.connect()
  })

  player.init(previewCanvasRef.value, previewVideoRef.value)
}

// 停止预览
function handleStopPreview() {
  if (previewPlayer.value) {
    previewPlayer.value.stop()
    previewPlayer.value.close()
    previewPlayer.value = null

    if (previewCanvasRef.value) previewCanvasRef.value.style.display = 'none'
    if (previewVideoRef.value) previewVideoRef.value.style.display = 'none'

    isPreviewing.value = false
    ElMessage.info('预览已停止')
  }

  // 同时停止录像
  if (isRecording.value) {
    handleStopRecord()
  }
}

// 打开声音
function handleTurnOnSound() {
  if (previewPlayer.value) {
    previewPlayer.value.setAudioVolume(volume.value)
    ElMessage.info('声音已打开')
  }
}

// 关闭声音
function handleTurnOffSound() {
  if (previewPlayer.value) {
    previewPlayer.value.setAudioVolume(0)
    ElMessage.info('声音已关闭')
  }
}

// 抓图
function handleCapture() {
  if (previewPlayer.value) {
    const filename = `capture_${Date.now()}`
    previewPlayer.value.capture(filename)
    ElMessage.success('抓图成功')
  }
}

// 开始录像
async function handleStartRecord() {
  if (!isPreviewing.value) {
    ElMessage.warning('请先开始预览')
    return
  }

  const { username, password } = loginForm
  const curChannel = previewChannel.value + 1
  const stream = streamType.value

  const _ip = location.hostname
  const _port = location.port || 80

  const options = {
    wsURL: `ws://${_ip}:${_port}/rtspoverwebsocket`,
    rtspURL: `rtsp://${_ip}:${_port}/cam/realmonitor?channel=${curChannel}&subtype=${stream}&proto=Private3`,
    username,
    password,
    isPrivateProtocol: false,
    realm: RPC.realm,
  }

  let PlayerControl
  try {
    PlayerControl = await ensurePlayerControl()
  }
  catch (e) {
    ElMessage.error(e?.message || '播放器加载失败')
    return
  }

  const player = new PlayerControl(options)
  player.startRecord(true)
  recordPlayer.value = player
  isRecording.value = true
  ElMessage.success('录像已开始')
}

// 停止录像
function handleStopRecord() {
  if (recordPlayer.value) {
    recordPlayer.value.startRecord(false)
    recordPlayer.value = null
    isRecording.value = false
    ElMessage.success('录像已停止并保存')
  }
}

// 监听音量变化
watch(volume, (newVal) => {
  if (previewPlayer.value && isPreviewing.value) {
    previewPlayer.value.setAudioVolume(newVal)
  }
})

// ==================== 云台控制相关方法 ====================

// 云台控制
function handlePTZ(type, isStop) {
  if (!isPreviewing.value) return

  const channel = previewChannel.value
  const stepVal = ptzStep.value
  let arg2 = 0

  // 对角线方向需要设置 arg2
  const diagonalTypes = ['LeftUp', 'RightUp', 'LeftDown', 'RightDown']
  if (diagonalTypes.includes(type)) {
    arg2 = stepVal
  }

  // 预置点操作
  const presetTypes = ['GotoPreset', 'SetPreset', 'ClearPreset']

  try {
    if (!isStop) {
      if (presetTypes.includes(type)) {
        RPC.PTZManager('start', channel, {
          code: type,
          arg1: presetNum.value,
          arg2: 0,
          arg3: 0,
        })
      }
      else {
        RPC.PTZManager('start', channel, {
          code: type,
          arg1: stepVal,
          arg2,
          arg3: 0,
        })
      }
    }
    else {
      RPC.PTZManager('stop', channel, {
        code: type,
        arg1: stepVal,
        arg2,
        arg3: 0,
      })
    }
  }
  catch (err) {
    console.error('云台控制失败:', err)
    ElMessage.error('云台控制失败')
  }
}

// ==================== 生命周期 ====================

onMounted(() => {
  initDefaultTime()
})

onBeforeUnmount(() => {
  handleLogout()
})
</script>

<style scoped lang='scss'>
.video-playback {
  padding: 15px;
}

.video-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.video-container {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  background-color: #000;
}

.video-canvas,
.video-element {
  width: 100%;
  height: 100%;
}

.ivs-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.video-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  color: #fff;
  transform: translate(-50%, -50%);
}

.video-loading .el-icon {
  font-size: 32px;
}

.timeline-control {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 8px 12px;
  margin-top: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;

  .time-text {
    font-family: Monaco, Menlo, monospace;
    font-size: 12px;
    color: #606266;
    white-space: nowrap;
  }

  .timeline-slider {
    flex: 1;
  }
}

.playback-toolbar {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin-top: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.preview-controls {
  display: flex;
  align-items: center;
}

.preview-video {
  height: 400px;
}

.preview-toolbar {
  padding: 10px;
  margin-top: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

// 云台控制样式
.ptz-card {
  height: 100%;
}

.ptz-step {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.ptz-direction {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
}

.ptz-row {
  display: flex;
  gap: 5px;

  .el-button {
    width: 50px;
    height: 40px;
    padding: 0;
    font-size: 16px;
  }
}

.ptz-zoom {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ptz-preset {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

:deep(.el-card__header) {
  padding: 12px 15px;
  background-color: #f5f7fa;
}

:deep(.el-table .el-table__row) {
  cursor: pointer;
}

:deep(.el-divider--horizontal) {
  margin: 15px 0;
}

:deep(.el-divider__text) {
  font-size: 12px;
  color: #909399;
}
</style>
