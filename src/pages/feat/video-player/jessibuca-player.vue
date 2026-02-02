<template>
  <div class="layout-default">
    <NoticeBar
      text="🎥 播放器插件：Jessibuca（pro 版本才支持 hls），点击查看"
      link="https://github.com/langhuihui/jessibuca"
    />

    <div class="player-shell">
      <div id="jessibuca-container" class="player-area" />

      <div class="control-panel">
        <el-input v-model="url" placeholder="请输入视频地址">
          <template #append>
            <el-button type="primary" @click="handlePlay">播放</el-button>
          </template>
        </el-input>

        <div class="control-buttons">
          <el-button :disabled="!isPlaying" @click="handlePause">暂停</el-button>
          <el-button type="danger" plain :disabled="!playerReady" @click="handleDestroy">销毁</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useScriptTag } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { onMounted, onUnmounted, ref } from 'vue'

const url = ref('')
const isPlaying = ref(false)
const playerReady = ref(false)
const scriptLoaded = ref(false)

let jessibuca: any = null

const { load, unload } = useScriptTag(
  '/libs/jessibuca/jessibuca.js',
  () => {
    scriptLoaded.value = true
    createPlayer()
  },
  { manual: true },
)

onMounted(() => {
  load()
})

onUnmounted(() => {
  jessibuca?.destroy()
  jessibuca = null
  playerReady.value = false
  isPlaying.value = false
  unload()
})

async function ensureReady() {
  if (!scriptLoaded.value)
    await load()

  if (!playerReady.value)
    createPlayer()
}

function createPlayer() {
  const container = document.getElementById('jessibuca-container')
  if (!container)
    return

  const JessibucaCtor = (window as any).Jessibuca
  if (!JessibucaCtor) {
    ElMessage.error('Jessibuca 脚本未加载成功')
    return
  }

  jessibuca?.destroy()

  jessibuca = new JessibucaCtor({
    container,
    decoder: './libs/jessibuca/decoder.js',
    videoBuffer: 0.2,
    isResize: true,
    text: '',
    loadingText: '',
    useMSE: true,
    autoWasm: true,
    debug: false,
    showBandwidth: true,
    operateBtns: {
      fullscreen: true,
      screenshot: true,
      play: true,
      audio: true,
      record: true,
    },
    isNotMute: false,
    recordType: 'mp4',
  })

  isPlaying.value = false
  playerReady.value = true
}

async function handlePlay() {
  if (!url.value) {
    ElMessage.warning('请输入视频地址')
    return
  }

  await ensureReady()

  jessibuca?.play(url.value)
  isPlaying.value = true
}

function handlePause() {
  if (!jessibuca)
    return

  jessibuca.pause()
  isPlaying.value = false
}

async function handleDestroy() {
  if (!jessibuca)
    return

  await jessibuca.destroy()
  jessibuca = null
  playerReady.value = false
  isPlaying.value = false

  createPlayer()
}
</script>

<style scoped>
.player-shell {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  margin-top: 10px;
}

.player-area {
  width: 600px;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: rgb(13 14 27 / 70%);
  border-radius: 8px;
  box-shadow: 0 10px 20px rgb(0 0 0 / 25%);
}

.control-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 600px;
}

.control-buttons {
  display: flex;
  gap: 10px;
}
</style>
