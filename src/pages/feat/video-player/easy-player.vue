<template>
  <div class="layout-default">
    <NoticeBar
      text="🎉播放器插件：easy-player，点击查看"
      link="https://github.com/EasyDarwin/EasyPlayer.js"
    />

    <div id="easy-player" class="my-10px aspect-ratio-16/9 h-auto! w-600px!" />

    <div class="mt-10px w-600px flex-col flex-items gap-10px">
      <el-input v-model="url" placeholder="请输入视频地址">
        <template #append>
          <el-button type="primary" @click="play">播放</el-button>
        </template>
      </el-input>
    </div>
  </div>
</template>

<script setup lang="ts">
const url = ref('https://mister-ben.github.io/videojs-flvjs/bbb.flv')

let easyPlayer: any = null

const { load } = useScriptTag(
  '/easy-player/EasyPlayer-pro.js',
  play,
  { manual: true },
)

async function play() {
  if (easyPlayer) {
    await easyPlayer.destroy()
    easyPlayer = null
  }

  const container = document.getElementById('easy-player')
  // @ts-expect-error EasyPlayerPro
  easyPlayer = new EasyPlayerPro(container, {
    isLive: true, // 默认 true
    hasAudio: false, // 是否解析音频
    isMute: true, // 是否渲染音频

    bufferTime: 0.2, // 缓存时长
    loadTimeOut: 30, // 超时时间s
    loadTimeReplay: 3, // 重连次数 -1 为一直加载

    stretch: true, // 视频拉伸
    poster: '', // 视频封面

    // 解码模式 MSE > WCS > wasm(simd适合高分辨率)
    MSE: true,
    WCS: false,
    WASM: false,
    WASMSIMD: true,
    gpuDecoder: true, // 硬解码

    webGPU: false,
    canvasRender: false, // canvas渲染

    isRtcSRS: false, // 是否rtc srs 类型
    isRtcZLM: false, // 是否rtc zlm 类型

    // watermark: , // 水印 {text: {content:'test',color:'',opacity:,fontSize:''},right: 0,top: 0}
    // fullWatermark: , // 全屏水印 {text: 'test',angle:'',color:'',fontSize: '',opacity:''}

    // quality: ['普清', '高清', '超清', '4K', '8K'], // 画质选择
    // qualityIndex: , // 默认显示的清晰度，如果不设置，会显示第一个清晰度

    ptzConfig: { ptz: false, ptzMore: false }, // PTZ配置
    debug: false, // 控制台日志打印
  })

  easyPlayer.play(url.value)
}

onMounted(() => {
  load()
})
</script>

<style lang="scss" scoped>
::v-deep(.easyplayer-container .easyplayer-loading-logo .easyplayer-loading-img) {
  background-image: url("@/assets/loading.svg") !important;
}
</style>
