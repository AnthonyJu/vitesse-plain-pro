<template>
  <div class="layout-default">
    <NoticeBar
      text="🎉播放器插件：xg-player，点击查看"
      link="https://h5player.bytedance.com/guide/"
    />

    <el-tabs v-model="active" type="card" class="mt-10px">
      <el-tab-pane v-for="item in tabs" :key="item" :label="item" :name="item" />
    </el-tabs>

    <div id="xg-player" />
    <div class="mt-10px w-600px flex-col flex-items gap-10px">
      <el-select v-show="active === 'hls'" v-model="hlsUrl" @change="handleSelect">
        <el-option
          v-for="item in hlsUrls"
          :key="item.url"
          :label="item.name"
          :value="item.url"
        />
      </el-select>
      <el-input v-model="url" placeholder="请输入视频地址">
        <template #append>
          <el-button type="primary" @click="play">播放</el-button>
        </template>
      </el-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import Player from 'xgplayer'
import FlvPlugin from 'xgplayer-flv'
import HlsPlugin from 'xgplayer-hls'
import 'xgplayer/dist/index.min.css'

const active = ref('mp4')
const tabs = ['mp4', 'hls', 'flv']

const url = ref('')
const plugins = shallowRef()

const hlsUrl = ref('')
const hlsUrls = [
  { name: '青岛-奥帆中心', url: 'http://video10.qtv.com.cn/aqdafzx2022/manifest.m3u8' },
  { name: '青岛-太平角', url: 'http://video10.qtv.com.cn/aqdtp2022/manifest.m3u8' },
  { name: '青岛-太平湾', url: 'https://video11.qtv.com.cn/sxt203/manifest.m3u8' },
]
function handleSelect() {
  url.value = hlsUrl.value
  play()
}

watch(active, () => {
  initUrl()
  play()
})

function initUrl() {
  if (active.value === 'mp4') {
    url.value = 'https://lf3-static.bytednsdoc.com/obj/eden-cn/nupenuvpxnuvo/xgplayer_doc/xgplayer-demo.mp4'
    plugins.value = undefined
  }
  else if (active.value === 'hls') {
    url.value = 'http://video10.qtv.com.cn/aqdafzx2022/manifest.m3u8'
    hlsUrl.value = url.value
    plugins.value = [HlsPlugin]
  }
  else if (active.value === 'flv') {
    url.value = 'https://mister-ben.github.io/videojs-flvjs/bbb.flv'
    plugins.value = [FlvPlugin]
  }
}

function play() {
  // eslint-disable-next-line no-new
  new Player({
    id: 'xg-player',
    width: 600,
    isLive: active.value !== 'mp4',
    autoplay: true,
    plugins: plugins.value,
    url: url.value,
  })
}

onMounted(() => {
  initUrl()
  play()
})
</script>
