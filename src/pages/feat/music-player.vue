<template>
  <div>
    <el-card shadow="hover" header="音频播放器：简单示例">
      <div class="player-box">
        <div class="flex-center">
          <img class="poster h-120px w-120px rounded-full" :src="songsData.poster">
        </div>
        <div class="pl-20px">
          <div class="mb-20px">{{ songsData.name }}</div>
          <div class="w-260px">
            <el-progress :percentage="percentage">
              <div text>{{ durationText }}</div>
            </el-progress>
          </div>
        </div>
      </div>
      <div>
        <el-button type="primary" @click="initSound">播放</el-button>
        <el-button type="primary" @click="sound.pause()">暂停</el-button>
        <el-button type="primary" @click="sound.stop(0)">重播</el-button>
      </div>
    </el-card>
  </div>
</template>

<route lang="yaml">
  meta:
    name: 音频播放器
</route>

<script setup lang='ts'>
import { Howl } from 'howler'
import poster from '@/assets/images/audios-poster/poster-1.png'

const songsData = reactive({
  poster,
  name: '爱人错过 — 告五人',
  duration: 0,
})

let sound: Howl
const durationText = ref('00:00')

const timer = ref()
const percentage = ref(0)

// 计算音频总时长 格式化为 00:00
function getDurationText(time: number) {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
}

function initSound() {
  if (!sound) {
    sound = new Howl({
      src: ['/audios/song-1.mp3'],
      html5: true,
      autoplay: true,
      loop: true,
      volume: 0.5,
      onplay() {
        songsData.duration = sound.duration()
        durationText.value = getDurationText(sound.duration())
        timer.value = setInterval(() => {
          percentage.value = (sound.seek() / sound.duration()) * 100
        }, 1000)
      },
    })
  }
  sound.play()
}

onBeforeUnmount(() => {
  clearInterval(timer.value)
})

// 获取当前播放时间
</script>

<style scoped lang="scss">
.player-box {
  display: flex;
  align-items: center;
  justify-self: start;
  width: 100%;

  .poster {
    animation: rotate 10s linear infinite;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
