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
          <el-button :disabled="!isLogin" size="small" @click="checkStorageStatus">检查存储</el-button>
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
                <el-select
                  v-model="previewChannel"
                  placeholder="通道"
                  style="width: 150px;"
                  size="small"
                  filterable
                  allow-create
                  default-first-option
                >
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
          <div class="video-wrapper preview-video">
            <div id="divPlugin" class="video-container" />
            <div v-show="previewLoading" class="video-loading">
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
                :max="100"
                :step="10"
                style="width: 80px;"
                size="small"
                @change="handleSetVolume"
              />
              <el-button :disabled="!isPreviewing" size="small" @click="handleOpenSound">
                <el-icon><Microphone /></el-icon> 打开声音
              </el-button>
              <el-button :disabled="!isPreviewing" size="small" @click="handleCloseSound">
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
          <!-- 速度设置 -->
          <div class="ptz-step">
            <span>云台速度 (1-7):</span>
            <el-select v-model="ptzSpeed" style="width: 80px; margin-left: 8px;" size="small">
              <el-option v-for="i in 7" :key="i" :label="i" :value="i" />
            </el-select>
          </div>
          <!-- 方向控制 -->
          <div class="ptz-direction">
            <div class="ptz-row">
              <el-button
                :disabled="!isPreviewing"
                @mousedown="handlePTZ(5, false)"
                @mouseup="handlePTZStop"
              >
                ↖
              </el-button>
              <el-button
                :disabled="!isPreviewing"
                @mousedown="handlePTZ(1, false)"
                @mouseup="handlePTZStop"
              >
                ↑
              </el-button>
              <el-button
                :disabled="!isPreviewing"
                @mousedown="handlePTZ(7, false)"
                @mouseup="handlePTZStop"
              >
                ↗
              </el-button>
            </div>
            <div class="ptz-row">
              <el-button
                :disabled="!isPreviewing"
                @mousedown="handlePTZ(3, false)"
                @mouseup="handlePTZStop"
              >
                ←
              </el-button>
              <el-button
                :disabled="!isPreviewing"
                @click="handlePTZAuto"
              >
                自动
              </el-button>
              <el-button
                :disabled="!isPreviewing"
                @mousedown="handlePTZ(4, false)"
                @mouseup="handlePTZStop"
              >
                →
              </el-button>
            </div>
            <div class="ptz-row">
              <el-button
                :disabled="!isPreviewing"
                @mousedown="handlePTZ(6, false)"
                @mouseup="handlePTZStop"
              >
                ↙
              </el-button>
              <el-button
                :disabled="!isPreviewing"
                @mousedown="handlePTZ(2, false)"
                @mouseup="handlePTZStop"
              >
                ↓
              </el-button>
              <el-button
                :disabled="!isPreviewing"
                @mousedown="handlePTZ(8, false)"
                @mouseup="handlePTZStop"
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
                @mousedown="handlePTZ(10, false)"
                @mouseup="handlePTZZoomStop"
              >
                变倍+
              </el-button>
              <el-button
                :disabled="!isPreviewing"
                @mousedown="handlePTZ(11, false)"
                @mouseup="handlePTZZoomStop"
              >
                变倍-
              </el-button>
            </el-button-group>
            <el-button-group style="margin-left: 8px;">
              <el-button
                :disabled="!isPreviewing"
                @mousedown="handlePTZ(12, false)"
                @mouseup="handlePTZFocusStop"
              >
                聚焦+
              </el-button>
              <el-button
                :disabled="!isPreviewing"
                @mousedown="handlePTZ(13, false)"
                @mouseup="handlePTZFocusStop"
              >
                聚焦-
              </el-button>
            </el-button-group>
            <el-button-group style="margin-left: 8px;">
              <el-button
                :disabled="!isPreviewing"
                @mousedown="handlePTZ(14, false)"
                @mouseup="handlePTZIrisStop"
              >
                光圈+
              </el-button>
              <el-button
                :disabled="!isPreviewing"
                @mousedown="handlePTZ(15, false)"
                @mouseup="handlePTZIrisStop"
              >
                光圈-
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
              @click="handleGoPreset"
            >
              调用预置点
            </el-button>
            <el-button
              :disabled="!isPreviewing"
              size="small"
              @click="handleSetPreset"
            >
              设置预置点
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
          <el-select
            v-model="searchForm.channel"
            placeholder="选择通道"
            style="width: 150px;"
            filterable
            allow-create
            default-first-option
          >
            <el-option
              v-for="item in channelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="码流类型">
          <el-select v-model="searchForm.streamType" style="width: 100px;">
            <el-option label="主码流" :value="1" />
            <el-option label="子码流" :value="2" />
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
      <!-- 回放控制区域 -->
      <el-col :span="12">
        <el-card class="video-card" shadow="hover">
          <template #header>
            <div class="video-header">
              <span>录像回放控制</span>
            </div>
          </template>
          <!-- 回放控制按钮 -->
          <div class="playback-toolbar">
            <el-button-group>
              <el-button
                :disabled="!isLogin || recordList.length === 0"
                @click="handleStartPlayback"
              >
                <el-icon><VideoPlay /></el-icon> 开始回放
              </el-button>
              <el-button :disabled="!isPlayback" @click="handleStopPlayback">
                <el-icon><CircleClose /></el-icon> 停止回放
              </el-button>
              <el-button :disabled="!isPlayback" @click="handlePause">
                <el-icon><VideoPause /></el-icon> 暂停
              </el-button>
              <el-button :disabled="!isPlayback" @click="handleResume">
                <el-icon><VideoPlay /></el-icon> 恢复
              </el-button>
              <el-button :disabled="!isPlayback" @click="handlePlaySlow">
                <el-icon><DArrowLeft /></el-icon> 慢放
              </el-button>
              <el-button :disabled="!isPlayback" @click="handlePlayFast">
                <el-icon><DArrowRight /></el-icon> 快放
              </el-button>
            </el-button-group>
          </div>
          <!-- OSD时间显示 -->
          <div v-if="isPlayback" class="osd-time">
            <span>OSD时间: </span>
            <el-tag>{{ osdTime || '--' }}</el-tag>
            <el-button size="small" style="margin-left: 10px;" @click="handleGetOSDTime">
              获取OSD时间
            </el-button>
          </div>
          <!-- 剪辑按钮 -->
          <div class="clip-toolbar" style="margin-top: 15px;">
            <el-button
              :disabled="!isPlayback || isClipping"
              size="small"
              type="success"
              @click="handleStartClip"
            >
              开始剪辑
            </el-button>
            <el-button
              :disabled="!isClipping"
              size="small"
              type="danger"
              @click="handleStopClip"
            >
              停止剪辑
            </el-button>
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
            height="300"
            highlight-current-row
            size="small"
            @row-click="handleSelectRecord"
          >
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="fileName" label="文件名" show-overflow-tooltip />
            <el-table-column prop="startTime" label="开始时间" width="160" />
            <el-table-column prop="endTime" label="结束时间" width="160" />
            <el-table-column label="操作" width="80">
              <template #default="{ row }">
                <el-button size="small" type="primary" link @click="handleDownload(row)">
                  下载
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="recordList.length"
            layout="prev, pager, next"
            style="justify-content: center; margin-top: 10px;"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 操作日志 -->
    <el-card class="log-card" shadow="hover" style="margin-top: 15px;">
      <template #header>
        <div class="log-header">
          <span>操作日志</span>
          <el-button size="small" @click="logList = []">清空</el-button>
        </div>
      </template>
      <div class="log-content">
        <div v-for="(log, index) in logList" :key="index" class="log-item">
          {{ log }}
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
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

// 声明全局 WebVideoCtrl
declare const WebVideoCtrl: any

// ==================== 响应式数据 ====================

// 登录相关
const isLogin = ref(false)
const loginLoading = ref(false)
const loginForm = reactive({
  ip: '192.168.1.194',
  port: '80',
  username: 'admin',
  password: 'jn123456',
})

// 设备标识
const deviceIdentify = ref('')

// 查询相关
const searchLoading = ref(false)
const channelList = ref<{ label: string, value: string }[]>([])
const searchForm = reactive({
  channel: '',
  streamType: 1,
  startTime: '',
  endTime: '',
})

// 录像列表
const recordList = ref<any[]>([])
const currentPage = ref(1)
const pageSize = 10
const selectedRecord = ref<any>(null)

// 实时预览相关
const previewChannel = ref('')
const streamType = ref(1)
const volume = ref(50)
const isPreviewing = ref(false)
const isRecording = ref(false)
const previewLoading = ref(false)
const streamOptions = ref([
  { label: '主码流', value: 1 },
  { label: '子码流', value: 2 },
  { label: '第三码流', value: 3 },
])

// 回放相关
const isPlayback = ref(false)
const isClipping = ref(false)
const osdTime = ref('')

// 云台控制相关
const ptzSpeed = ref(4)
const presetNum = ref(1)
const ptzAutoEnabled = ref(false)

// 日志
const logList = ref<string[]>([])

// SDK 加载状态
const sdkLoaded = ref(false)
const pluginReady = ref(false) // 插件是否就绪

// ==================== 计算属性 ====================

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return recordList.value.slice(start, start + pageSize)
})

// ==================== 工具方法 ====================

// 格式化时间
function formatDate(date: Date, fmt: string): string {
  const o: Record<string, number> = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  }
  const yearMatch = fmt.match(/(y+)/)
  if (yearMatch) {
    fmt = fmt.replace(yearMatch[1], (`${date.getFullYear()}`).substring(4 - yearMatch[1].length))
  }
  for (const k in o) {
    const regex = new RegExp(`(${k})`)
    const match = fmt.match(regex)
    if (match) {
      const replacement = match[1].length === 1
        ? String(o[k])
        : (`00${o[k]}`).substring(String(o[k]).length)
      fmt = fmt.replace(match[1], replacement)
    }
  }
  return fmt
}

// 添加日志
function addLog(msg: string) {
  const time = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
  logList.value.unshift(`${time} ${msg}`)
  // 只保留最近100条日志
  if (logList.value.length > 100) {
    logList.value.pop()
  }
}

// 初始化默认时间
function initDefaultTime() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  searchForm.startTime = `${year}-${month}-${day} 00:00:00`
  searchForm.endTime = `${year}-${month}-${day} 23:59:59`
}

// 动态加载脚本
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`)
    if (existing) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
    document.head.appendChild(script)
  })
}

// 加载海康 SDK
async function loadHKSDK() {
  try {
    // 按顺序加载所需脚本
    await loadScript('/libs/hk-sdk/codebase/jsPlugin/jquery.min.js')
    await loadScript('/libs/hk-sdk/codebase/encryption/AES.js')
    await loadScript('/libs/hk-sdk/codebase/encryption/cryptico.min.js')
    await loadScript('/libs/hk-sdk/codebase/encryption/crypto-3.1.2.min.js')
    await loadScript('/libs/hk-sdk/codebase/webVideoCtrl.js')

    sdkLoaded.value = true
    addLog('海康 SDK 加载成功')

    // 初始化插件
    initPlugin()
  }
  catch (error: any) {
    addLog(`海康 SDK 加载失败: ${error.message}`)
    ElMessage.error('海康 SDK 加载失败')
  }
}

// 初始化插件
function initPlugin() {
  if (!window.WebVideoCtrl) {
    addLog('WebVideoCtrl 未找到')
    return
  }

  // 检查浏览器是否支持无插件
  const iRet = WebVideoCtrl.I_SupportNoPlugin()
  if (!iRet) {
    ElMessage.error('当前浏览器版本过低，不支持无插件，请升级后再试！')
    return
  }

  // 等待 DOM 渲染完成后再初始化
  nextTick(() => {
    // 确认 divPlugin 元素存在
    const pluginDiv = document.getElementById('divPlugin')
    if (!pluginDiv) {
      addLog('错误：divPlugin 元素不存在')
      return
    }

    // 初始化插件参数
    WebVideoCtrl.I_InitPlugin('100%', '100%', {
      bWndFull: true,
      iPackageType: 2,
      iWndowType: 1,
      bNoPlugin: true,
      cbSelWnd: (_xmlDoc: any) => {
      // 窗口选择回调
      },
      cbDoubleClickWnd: (_iWndIndex: number, _bFullScreen: boolean) => {
      // 双击窗口回调
      },
      cbEvent: (iEventType: number, iParam1: number, _iParam2: number) => {
        if (iEventType === 2) {
          addLog(`窗口 ${iParam1} 回放结束`)
          isPlayback.value = false
        }
        else if (iEventType === -1) {
          addLog(`设备 ${iParam1} 网络错误`)
        }
        else if (iEventType === 3001) {
          handleStopRecord()
        }
      },
      cbInitPluginComplete: () => {
        WebVideoCtrl.I_InsertOBJECTPlugin('divPlugin')
        pluginReady.value = true
        addLog('插件初始化完成，可以开始使用')
      },
      cbPluginErrorHandler: (iWndIndex: number, iErrorCode: number, _oError: any) => {
        const errorCodes: Record<number, string> = {
          1001: '码流传输过程异常',
          1002: '回放结束',
          1003: '取流失败，连接被动断开',
          1006: '视频编码格式不支持',
          1007: '网络异常导致websocket断开',
          1008: '首帧回调超时',
        }
        addLog(`窗口 ${iWndIndex}: ${errorCodes[iErrorCode] || `错误码 ${iErrorCode}`}`)
      },
    })
  })
}

// ==================== 登录相关方法 ====================

// 登录
async function handleLogin() {
  if (!loginForm.ip || !loginForm.username || !loginForm.password) {
    ElMessage.warning('请填写完整的登录信息')
    return
  }

  if (!sdkLoaded.value) {
    ElMessage.warning('SDK 正在加载中，请稍候...')
    return
  }

  loginLoading.value = true
  const szDeviceIdentify = `${loginForm.ip}_${loginForm.port}`

  try {
    // HTTP 登录 (protocol = 1)
    const iRet = WebVideoCtrl.I_Login(loginForm.ip, 1, loginForm.port, loginForm.username, loginForm.password, {
      success: () => {
        isLogin.value = true
        deviceIdentify.value = szDeviceIdentify
        addLog(`${szDeviceIdentify} 登录成功！`)
        ElMessage.success('登录成功')
        // 获取设备端口信息
        getDevicePort()
        // 获取通道列表
        fetchChannelList()
      },
      error: (status: number, _xmlDoc: any) => {
        addLog(`${szDeviceIdentify} 登录失败！ 状态码: ${status}`)
        ElMessage.error('登录失败')
      },
    })

    if (iRet === -1) {
      addLog(`${szDeviceIdentify} 已登录过！`)
      isLogin.value = true
      deviceIdentify.value = szDeviceIdentify
      getDevicePort()
      fetchChannelList()
    }
  }
  catch (err: any) {
    addLog(`登录异常: ${err.message}`)
    ElMessage.error('登录失败')
  }
  finally {
    loginLoading.value = false
  }
}

// 注销
function handleLogout() {
  if (!deviceIdentify.value)
    return

  try {
    // 停止预览
    if (isPreviewing.value) {
      handleStopPreview()
    }
    // 停止回放
    if (isPlayback.value) {
      handleStopPlayback()
    }

    const iRet = WebVideoCtrl.I_Logout(deviceIdentify.value)
    if (iRet === 0) {
      addLog(`${deviceIdentify.value} 退出成功！`)
      ElMessage.success('已注销')
    }
    else {
      addLog(`${deviceIdentify.value} 退出失败！`)
    }
  }
  catch (err: any) {
    addLog(`注销异常: ${err.message}`)
  }
  finally {
    isLogin.value = false
    deviceIdentify.value = ''
    channelList.value = []
    recordList.value = []
    isPreviewing.value = false
    isPlayback.value = false
  }
}

// 获取设备端口
function getDevicePort() {
  if (!deviceIdentify.value)
    return

  try {
    const oPort = WebVideoCtrl.I_GetDevicePort(deviceIdentify.value)
    if (oPort != null) {
      addLog(`设备端口信息 - 设备端口: ${oPort.iDevicePort}, RTSP端口: ${oPort.iRtspPort}`)
    }
    else {
      addLog('获取设备端口信息失败')
    }
  }
  catch (err: any) {
    addLog(`获取设备端口异常: ${err.message}`)
  }
}

// 检查存储状态
function checkStorageStatus() {
  if (!deviceIdentify.value) {
    ElMessage.warning('请先登录设备')
    return
  }

  addLog('正在检查设备存储状态...')

  // 使用海康 ISAPI 接口查询存储状态
  const szUrl = 'ISAPI/ContentMgmt/Storage'

  WebVideoCtrl.I_SendHTTPRequest(deviceIdentify.value, szUrl, {
    async: true,
    type: 'GET',
    success: (xmlDoc: any) => {
      try {
        const $ = (window as any).$
        const storage = $(xmlDoc).find('storage').first()

        if (storage.length > 0) {
          const id = storage.find('id').text()
          const status = storage.find('status').text()
          const capacity = storage.find('capacity').text()
          const freeSpace = storage.find('freeSpace').text()

          const capacityGB = (Number.parseInt(capacity) / 1024 / 1024 / 1024).toFixed(2)
          const freeSpaceGB = (Number.parseInt(freeSpace) / 1024 / 1024 / 1024).toFixed(2)
          const usedGB = (Number.parseFloat(capacityGB) - Number.parseFloat(freeSpaceGB)).toFixed(2)

          const statusText = status === 'ok' ? '正常' : status === 'unformatted' ? '未格式化' : '异常'

          addLog(`存储状态 - ID: ${id}, 状态: ${statusText}, 总容量: ${capacityGB}GB, 已用: ${usedGB}GB, 可用: ${freeSpaceGB}GB`)

          if (status === 'ok') {
            ElMessage.success({
              message: `存储设备正常 - 总容量: ${capacityGB}GB | 已用: ${usedGB}GB | 可用: ${freeSpaceGB}GB`,
              duration: 5000,
            })
          }
          else if (status === 'unformatted') {
            ElMessage.warning({
              message: '存储设备未格式化，请在设备管理界面格式化存储设备后再查询录像',
              duration: 5000,
            })
          }
          else {
            ElMessage.warning({
              message: `存储设备状态异常: ${statusText}，请检查存储设备是否正常工作`,
              duration: 5000,
            })
          }
        }
        else {
          addLog('未检测到存储设备')
          ElMessage.warning({
            message: '未检测到存储设备，设备未安装SD卡、硬盘或配置NAS存储',
            duration: 5000,
          })
        }
      }
      catch (e: any) {
        addLog(`解析存储信息失败: ${e.message}`)
        ElMessage.error('获取存储信息失败')
      }
    },
    error: (status: number, _xmlDoc: any) => {
      if (status === 403) {
        addLog('检查存储状态失败 (403)：用户无权限访问存储信息')
        ElMessage.error('无权限访问存储信息，请使用管理员账户登录')
      }
      else if (status === 404) {
        addLog('检查存储状态失败 (404)：设备不支持存储查询接口')
        ElMessage.warning('设备不支持存储状态查询，请在设备管理界面手动检查')
      }
      else {
        addLog(`检查存储状态失败！状态码: ${status}`)
        ElMessage.error('检查存储状态失败')
      }
    },
  })
}

// 获取通道列表
function fetchChannelList() {
  if (!deviceIdentify.value)
    return

  channelList.value = []

  // 获取模拟通道
  WebVideoCtrl.I_GetAnalogChannelInfo(deviceIdentify.value, {
    async: false,
    success: (xmlDoc: any) => {
      const $ = (window as any).$
      const oChannels = $(xmlDoc).find('VideoInputChannel')
      oChannels.each(function (this: any, i: number) {
        const id = $(this).find('id').eq(0).text()
        let name = $(this).find('name').eq(0).text()
        if (!name) {
          name = `Camera ${i < 9 ? `0${i + 1}` : i + 1}`
        }
        channelList.value.push({ label: name, value: id })
      })
      addLog(`${deviceIdentify.value} 获取模拟通道成功，共 ${channelList.value.length} 个通道`)
    },
    error: (_status: number, _xmlDoc: any) => {
      addLog(`${deviceIdentify.value} 获取模拟通道失败！`)
    },
  })

  // 获取数字通道（403错误不影响后续操作）
  WebVideoCtrl.I_GetDigitalChannelInfo(deviceIdentify.value, {
    async: false,
    success: (xmlDoc: any) => {
      const $ = (window as any).$
      const oChannels = $(xmlDoc).find('InputProxyChannelStatus')
      let count = 0
      oChannels.each(function (this: any, i: number) {
        const id = $(this).find('id').eq(0).text()
        let name = $(this).find('name').eq(0).text()
        const online = $(this).find('online').eq(0).text()
        if (online === 'false')
          return true
        if (!name) {
          name = `IPCamera ${i < 9 ? `0${i + 1}` : i + 1}`
        }
        channelList.value.push({ label: name, value: id })
        count++
      })
      addLog(`${deviceIdentify.value} 获取数字通道成功，共 ${count} 个通道`)
    },
    error: (status: number, _xmlDoc: any) => {
      // 403 错误说明设备不支持数字通道或没有权限，这是正常的
      if (status === 403) {
        addLog(`${deviceIdentify.value} 该设备不支持数字通道或没有权限（403）`)
      }
      else {
        addLog(`${deviceIdentify.value} 获取数字通道失败！状态码: ${status}`)
      }
    },
  })

  // 设置默认通道
  // 如果没有获取到通道，提供默认通道选项
  if (channelList.value.length === 0) {
    addLog('未能自动获取通道列表，已添加默认通道，您也可以手动输入通道号')
    // 添加一些常用的默认通道
    channelList.value = [
      { label: '通道 1', value: '1' },
      { label: '通道 2', value: '2' },
      { label: '通道 3', value: '3' },
      { label: '通道 4', value: '4' },
    ]
  }

  // 使用 nextTick 确保 DOM 更新完成后再设置默认值
  nextTick(() => {
    if (channelList.value.length > 0) {
      previewChannel.value = channelList.value[0].value
      searchForm.channel = channelList.value[0].value
    }
  })
}

// ==================== 预览相关方法 ====================

// 开始预览
async function handleStartPreview() {
  if (!isLogin.value || !previewChannel.value) {
    ElMessage.warning('请先登录并选择通道')
    return
  }

  if (!sdkLoaded.value || typeof WebVideoCtrl === 'undefined') {
    ElMessage.error('SDK 未加载完成，请稍候重试')
    return
  }

  if (!pluginReady.value) {
    ElMessage.error('插件未就绪，请稍候片刻再试')
    addLog('插件未就绪，等待初始化完成...')
    return
  }

  previewLoading.value = true

  // 等待 DOM 更新完成
  await nextTick()

  const channelId = Number.parseInt(previewChannel.value)
  if (Number.isNaN(channelId) || channelId <= 0) {
    previewLoading.value = false
    ElMessage.warning('通道号格式不正确，请输入有效的通道号')
    return
  }

  addLog(`开始预览 - 设备: ${deviceIdentify.value}, 通道: ${channelId}, 码流类型: ${streamType.value}`)

  const startRealPlay = () => {
    try {
      const iRet = WebVideoCtrl.I_StartRealPlay(deviceIdentify.value, {
        iStreamType: streamType.value,
        iChannelID: channelId,
        bZeroChannel: false,
        bProxy: false, // 先尝试直连，如果失败可以改为 true
        success: () => {
          previewLoading.value = false
          isPreviewing.value = true
          addLog(`${deviceIdentify.value} 通道 ${channelId} 开始预览成功！`)
          ElMessage.success('预览已开始')
        },
        error: (status: any, xmlDoc: any) => {
          previewLoading.value = false

          // 处理 status 可能为 undefined 的情况
          const statusCode = status !== undefined ? status : 'unknown'

          try {
            const $ = (window as any).$
            let errorMsg = '未知错误'

            if (xmlDoc && $) {
              const statusString = $(xmlDoc).find('statusString').eq(0).text()
              const subStatusCode = $(xmlDoc).find('subStatusCode').eq(0).text()
              if (statusString) errorMsg = statusString
              if (subStatusCode) errorMsg += ` (${subStatusCode})`
            }

            // 详细的日志记录
            addLog(`预览失败详情 - 状态码: ${statusCode}, 错误信息: ${errorMsg}, xmlDoc存在: ${!!xmlDoc}`)

            if (status === 403) {
              addLog(`预览失败: 设备不支持Websocket取流或无权限访问 (403)`)
              ElMessage.error('设备不支持Websocket取流或无权限')
            }
            else if (status === 401) {
              addLog(`预览失败: 认证失败，请重新登录 (401)`)
              ElMessage.error('认证失败，请重新登录')
            }
            else if (status === undefined || status === null) {
              addLog(`预览失败: 可能是网络连接问题或设备不在线`)
              ElMessage.error('预览失败：无法连接到设备，请检查设备IP、端口和网络连接')
            }
            else {
              ElMessage.error(`预览失败 (${statusCode}): ${errorMsg}`)
            }
          }
          catch (e: any) {
            addLog(`错误处理异常: ${e.message}`)
            ElMessage.error('预览失败：发生未知错误')
          }
        },
      })

      // 记录返回值
      if (iRet !== undefined) {
        addLog(`I_StartRealPlay 返回值: ${iRet}`)
        if (iRet === -1) {
          previewLoading.value = false
          addLog('预览失败: 该窗口已经在预览或回放')
          ElMessage.warning('该窗口已经在预览或回放')
        }
      }
    }
    catch (e: any) {
      previewLoading.value = false
      addLog(`预览异常: ${e.message || e}`)
      ElMessage.error(`预览异常: ${e.message || '未知错误'}`)
    }
  }

  // 检查是否已在播放
  const oWndInfo = WebVideoCtrl.I_GetWindowStatus(0)
  if (oWndInfo != null) {
    WebVideoCtrl.I_Stop({
      success: () => {
        startRealPlay()
      },
    })
  }
  else {
    startRealPlay()
  }
}

// 停止预览
function handleStopPreview() {
  WebVideoCtrl.I_Stop({
    success: () => {
      isPreviewing.value = false
      isRecording.value = false
      addLog(`${deviceIdentify.value} 停止预览成功！`)
      ElMessage.info('预览已停止')
    },
    error: () => {
      addLog(`${deviceIdentify.value} 停止预览失败！`)
    },
  })
}

// 打开声音
function handleOpenSound() {
  WebVideoCtrl.I_OpenSound().then(() => {
    addLog('打开声音成功！')
    ElMessage.success('声音已打开')
  }).catch((e: number) => {
    if (e === 1023) {
      addLog('声音已是打开状态！')
    }
    else {
      addLog('打开声音失败！')
    }
  })
}

// 关闭声音
function handleCloseSound() {
  WebVideoCtrl.I_CloseSound().then(() => {
    addLog('关闭声音成功！')
    ElMessage.success('声音已关闭')
  }).catch((e: number) => {
    if (e === 1023) {
      addLog('声音已是关闭状态！')
    }
    else {
      addLog('关闭声音失败！')
    }
  })
}

// 设置音量
function handleSetVolume(val: number | number[]) {
  const volume = Array.isArray(val) ? val[0] : val
  WebVideoCtrl.I_SetVolume(volume).then(() => {
    addLog(`音量设置成功: ${volume}`)
  }).catch(() => {
    addLog('音量设置失败！')
  })
}

// 抓图
function handleCapture() {
  const szPicName = `${deviceIdentify.value}_${previewChannel.value}_${Date.now()}.jpg`
  WebVideoCtrl.I2_CapturePic(szPicName, {}).then(() => {
    addLog('抓图成功！')
    ElMessage.success('抓图成功')
  }).catch(() => {
    addLog('抓图失败！')
    ElMessage.error('抓图失败')
  })
}

// 开始录像
function handleStartRecord() {
  const szFileName = `${deviceIdentify.value}_${previewChannel.value}_${Date.now()}`
  WebVideoCtrl.I_StartRecord(szFileName, {
    bDateDir: true,
    success: () => {
      isRecording.value = true
      addLog('开始录像成功！')
      ElMessage.success('录像已开始')
    },
    error: () => {
      addLog('开始录像失败！')
      ElMessage.error('开始录像失败')
    },
  })
}

// 停止录像
function handleStopRecord() {
  WebVideoCtrl.I_StopRecord({
    success: () => {
      isRecording.value = false
      addLog('停止录像成功！')
      ElMessage.success('录像已停止')
    },
    error: () => {
      addLog('停止录像失败！')
    },
  })
}

// ==================== 云台控制相关方法 ====================

// 云台控制
function handlePTZ(iPTZIndex: number, bStop: boolean) {
  const oWndInfo = WebVideoCtrl.I_GetWindowStatus(0)
  if (!oWndInfo)
    return

  WebVideoCtrl.I_PTZControl(iPTZIndex, bStop, {
    iPTZSpeed: ptzSpeed.value,
    success: () => {
      addLog(`${bStop ? '停止' : '开启'}云台成功！`)
    },
    error: (_status: number, _xmlDoc: any) => {
      addLog(`${bStop ? '停止' : '开启'}云台失败！`)
    },
  })
}

// 云台自动
function handlePTZAuto() {
  const oWndInfo = WebVideoCtrl.I_GetWindowStatus(0)
  if (!oWndInfo)
    return

  const speed = ptzAutoEnabled.value ? 0 : ptzSpeed.value

  WebVideoCtrl.I_PTZControl(9, false, {
    iPTZSpeed: speed,
    success: () => {
      ptzAutoEnabled.value = !ptzAutoEnabled.value
      addLog(ptzAutoEnabled.value ? '开启云台自动成功！' : '停止云台自动成功！')
    },
    error: () => {
      addLog('云台自动控制失败！')
    },
  })
}

// 停止方向控制
function handlePTZStop() {
  handlePTZ(1, true)
}

// 停止变倍
function handlePTZZoomStop() {
  handlePTZ(11, true)
}

// 停止聚焦
function handlePTZFocusStop() {
  handlePTZ(12, true)
}

// 停止光圈
function handlePTZIrisStop() {
  handlePTZ(14, true)
}

// 设置预置点
function handleSetPreset() {
  const oWndInfo = WebVideoCtrl.I_GetWindowStatus(0)
  if (!oWndInfo)
    return

  WebVideoCtrl.I_SetPreset(presetNum.value, {
    success: () => {
      addLog(`设置预置点 ${presetNum.value} 成功！`)
      ElMessage.success('预置点设置成功')
    },
    error: () => {
      addLog(`设置预置点 ${presetNum.value} 失败！`)
      ElMessage.error('预置点设置失败')
    },
  })
}

// 调用预置点
function handleGoPreset() {
  const oWndInfo = WebVideoCtrl.I_GetWindowStatus(0)
  if (!oWndInfo)
    return

  WebVideoCtrl.I_GoPreset(presetNum.value, {
    success: () => {
      addLog(`调用预置点 ${presetNum.value} 成功！`)
      ElMessage.success('预置点调用成功')
    },
    error: () => {
      addLog(`调用预置点 ${presetNum.value} 失败！`)
      ElMessage.error('预置点调用失败')
    },
  })
}

// ==================== 录像查询相关方法 ====================

// 查询录像
function handleSearch() {
  if (!searchForm.startTime || !searchForm.endTime) {
    ElMessage.warning('请选择时间范围')
    return
  }

  if (!searchForm.channel) {
    ElMessage.warning('请选择通道')
    return
  }

  searchLoading.value = true
  recordList.value = []
  currentPage.value = 1

  let searchTimes = 0

  const doSearch = () => {
    const channelId = Number.parseInt(searchForm.channel)
    WebVideoCtrl.I_RecordSearch(
      deviceIdentify.value,
      channelId,
      searchForm.startTime,
      searchForm.endTime,
      {
        iStreamType: searchForm.streamType,
        iSearchPos: searchTimes * 40,
        success: (xmlDoc: any) => {
          const $ = (window as any).$
          const responseStatus = $(xmlDoc).find('responseStatusStrg').eq(0).text()

          if (responseStatus === 'MORE' || responseStatus === 'OK') {
            const items = $(xmlDoc).find('searchMatchItem')
            items.each(function (this: any, i: number) {
              const szPlaybackURI = $(this).find('playbackURI').eq(0).text()
              if (!szPlaybackURI.includes('name='))
                return

              const szStartTime = $(this).find('startTime').eq(0).text()
              const szEndTime = $(this).find('endTime').eq(0).text()
              const szFileName = szPlaybackURI.substring(szPlaybackURI.indexOf('name=') + 5, szPlaybackURI.indexOf('&size='))

              recordList.value.push({
                index: searchTimes * 40 + i + 1,
                fileName: szFileName,
                startTime: szStartTime.replace('T', ' ').replace('Z', ''),
                endTime: szEndTime.replace('T', ' ').replace('Z', ''),
                playbackURI: szPlaybackURI,
              })
            })

            if (responseStatus === 'MORE') {
              searchTimes++
              doSearch()
            }
            else {
              searchLoading.value = false
              addLog(`搜索录像文件成功！共 ${recordList.value.length} 条`)
              ElMessage.success(`查询到 ${recordList.value.length} 条录像`)
            }
          }
          else if (responseStatus === 'NO MATCHES') {
            searchLoading.value = false
            addLog('没有录像文件！')
            ElMessage.info('没有找到录像')
          }
        },
        error: (_status: number, _xmlDoc: any) => {
          searchLoading.value = false
          addLog('搜索录像文件失败！')
          ElMessage.error('查询失败')
        },
      },
    )
  }

  doSearch()
}

// 选择录像
function handleSelectRecord(row: any) {
  selectedRecord.value = row
}

// 下载录像
function handleDownload(row: any) {
  const szFileName = `${deviceIdentify.value}_${searchForm.channel}_${row.fileName}`
  addLog('开始下载！录像文件大，请耐心等待。完成后到浏览器下载内容页面查看')

  WebVideoCtrl.I_StartDownloadRecord(deviceIdentify.value, row.playbackURI, szFileName, {
    bDateDir: true,
  }).then(() => {
    addLog('下载成功！')
    ElMessage.success('下载成功')
  }).catch(() => {
    addLog('下载失败！')
    ElMessage.error('下载失败')
  })
}

// ==================== 回放相关方法 ====================

// 开始回放
function handleStartPlayback() {
  if (!searchForm.channel || !searchForm.startTime || !searchForm.endTime) {
    ElMessage.warning('请先查询录像')
    return
  }

  const startPlayback = () => {
    WebVideoCtrl.I_StartPlayback(deviceIdentify.value, {
      iStreamType: searchForm.streamType,
      iChannelID: Number.parseInt(searchForm.channel),
      szStartTime: searchForm.startTime,
      szEndTime: searchForm.endTime,
      bProxy: true,
      success: () => {
        isPlayback.value = true
        isPreviewing.value = false
        addLog('开始回放成功！')
        ElMessage.success('回放已开始')
      },
      error: (status: number, _xmlDoc: any) => {
        if (status === 403) {
          addLog('设备不支持Websocket取流！')
        }
        else {
          addLog('开始回放失败！')
        }
        ElMessage.error('回放失败')
      },
    })
  }

  // 检查是否已在播放
  const oWndInfo = WebVideoCtrl.I_GetWindowStatus(0)
  if (oWndInfo != null) {
    WebVideoCtrl.I_Stop({
      success: () => {
        startPlayback()
      },
    })
  }
  else {
    startPlayback()
  }
}

// 停止回放
function handleStopPlayback() {
  WebVideoCtrl.I_Stop({
    success: () => {
      isPlayback.value = false
      isClipping.value = false
      addLog('停止回放成功！')
      ElMessage.info('回放已停止')
    },
    error: () => {
      addLog('停止回放失败！')
    },
  })
}

// 暂停
function handlePause() {
  WebVideoCtrl.I_Pause({
    success: () => {
      addLog('暂停成功！')
    },
    error: () => {
      addLog('暂停失败！')
    },
  })
}

// 恢复
function handleResume() {
  WebVideoCtrl.I_Resume({
    success: () => {
      addLog('恢复成功！')
    },
    error: () => {
      addLog('恢复失败！')
    },
  })
}

// 慢放
function handlePlaySlow() {
  WebVideoCtrl.I_PlaySlow({
    success: () => {
      addLog('慢放成功！')
    },
    error: () => {
      addLog('慢放失败！')
    },
  })
}

// 快放
function handlePlayFast() {
  WebVideoCtrl.I_PlayFast({
    success: () => {
      addLog('快放成功！')
    },
    error: () => {
      addLog('快放失败！')
    },
  })
}

// 获取OSD时间
function handleGetOSDTime() {
  WebVideoCtrl.I_GetOSDTime({
    success: (szOSDTime: string) => {
      osdTime.value = szOSDTime
      addLog(`获取OSD时间成功: ${szOSDTime}`)
    },
    error: () => {
      addLog('获取OSD时间失败！')
    },
  })
}

// 开始剪辑
function handleStartClip() {
  const szFileName = `${deviceIdentify.value}_${searchForm.channel}_clip_${Date.now()}`
  WebVideoCtrl.I_StartRecord(szFileName, {
    bDateDir: true,
    success: () => {
      isClipping.value = true
      addLog('开始剪辑成功！')
      ElMessage.success('剪辑已开始')
    },
    error: () => {
      addLog('开始剪辑失败！')
      ElMessage.error('开始剪辑失败')
    },
  })
}

// 停止剪辑
function handleStopClip() {
  WebVideoCtrl.I_StopRecord({
    success: () => {
      isClipping.value = false
      addLog('停止剪辑成功！')
      ElMessage.success('剪辑已停止')
    },
    error: () => {
      addLog('停止剪辑失败！')
    },
  })
}

// ==================== 生命周期 ====================

onMounted(() => {
  initDefaultTime()
  loadHKSDK()
})

onBeforeUnmount(() => {
  handleLogout()
})
</script>

<style lang="scss" scoped>
.video-playback {
  padding: 15px;
}

.video-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.video-wrapper {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  background-color: #000;
}

.video-container {
  width: 100%;
  height: 100%;
}

.preview-video {
  height: 400px;
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

.preview-controls {
  display: flex;
  align-items: center;
}

.preview-toolbar {
  padding: 10px;
  margin-top: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.playback-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: center;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.clip-toolbar {
  display: flex;
  justify-content: center;
}

.osd-time {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
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

.log-card {
  .log-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .log-content {
    max-height: 200px;
    overflow-y: auto;
    font-family: Monaco, Menlo, monospace;
    font-size: 12px;
  }

  .log-item {
    padding: 4px 0;
    color: #606266;
    border-bottom: 1px solid #ebeef5;
  }
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
