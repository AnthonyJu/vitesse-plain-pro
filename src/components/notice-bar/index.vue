<template>
  <div class="notice-bar" :style="{ background, height: `${height}px` }">
    <div class="notice-bar-warp" :style="{ color, fontSize: `${size}px` }">
      <div v-if="leftIcon" class="notice-bar-warp-left-icon" :class="leftIcon" />

      <div
        ref="noticeBarWarpRef"
        class="notice-bar-warp-text-box"
        :class="link ? 'cursor-pointer' : ''"
        @click="handleClick"
      >
        <div v-if="!scrollable" ref="noticeBarTextRef" class="notice-bar-warp-text">{{ text }}</div>
        <div v-else class="notice-bar-warp-slot"><slot /></div>
      </div>

      <div class="notice-bar-warp-right-icon i-carbon-close" @click="handleClose" />
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义父组件传过来的值
const props = defineProps({
  // 是否可关闭
  closeable: {
    type: Boolean,
    default: () => false,
  },
  // 通知文本内容
  text: {
    type: String,
    default: () => '',
  },
  // 通知链接地址
  link: {
    type: String,
    default: () => '',
  },
  animate: {
    type: Boolean,
    default: () => false,
  },
  // 通知文本颜色
  color: {
    type: String,
    default: () => 'var(--el-color-warning)',
  },
  // 通知背景色
  background: {
    type: String,
    default: () => 'var(--el-color-warning-light-9)',
  },
  // 字体大小，单位px
  size: {
    type: [Number, String],
    default: () => 14,
  },
  // 通知栏高度，单位px
  height: {
    type: Number,
    default: () => 40,
  },
  // 动画延迟时间 (s)
  delay: {
    type: Number,
    default: () => 1,
  },
  // 滚动速率 (px/s)
  speed: {
    type: Number,
    default: () => 100,
  },
  // 是否开启垂直滚动
  scrollable: {
    type: Boolean,
    default: () => false,
  },
  // 自定义左侧图标
  leftIcon: {
    type: String,
    default: () => '',
  },
  // 自定义右侧图标
  rightIcon: {
    type: String,
    default: () => '',
  },
})

// 定义变量内容
const noticeBarWarpRef = ref()
const noticeBarTextRef = ref()
const state = reactive({
  order: 1,
  oneTime: 0,
  twoTime: 0,
  warpOWidth: 0,
  textOWidth: 0,
})

const timer = ref()

// 初始化 animation 各项参数
function initAnimation() {
  nextTick(() => {
    state.warpOWidth = noticeBarWarpRef.value.offsetWidth
    state.textOWidth = noticeBarTextRef.value.offsetWidth
    document.styleSheets[0].insertRule(`@keyframes oneAnimation {0% {left: 0px;} 100% {left: -${state.textOWidth}px;}}`)
    document.styleSheets[0].insertRule(`@keyframes twoAnimation {0% {left: ${state.warpOWidth}px;} 100% {left: -${state.textOWidth}px;}}`)
    computeAnimationTime()
    timer.value = setTimeout(() => {
      changeAnimation()
    }, props.delay * 1000)
  })
}
// 计算 animation 滚动时长
function computeAnimationTime() {
  state.oneTime = state.textOWidth / props.speed
  state.twoTime = (state.textOWidth + state.warpOWidth) / props.speed
}
// 改变 animation 动画调用
function changeAnimation() {
  if (noticeBarTextRef.value.style) {
    if (state.order === 1) {
      noticeBarTextRef.value.style!.cssText = `animation: oneAnimation ${state.oneTime}s linear; opacity: 1;}`
      state.order = 2
    }
    else {
      noticeBarTextRef.value.style!.cssText = `animation: twoAnimation ${state.twoTime}s linear infinite; opacity: 1;`
    }
  }
}
// 监听 animation 动画的结束
function listenerAnimationend() {
  noticeBarTextRef.value.addEventListener(
    'animationend',
    () => {
      changeAnimation()
    },
    false,
  )
}

function handleClick() {
  if (props.link) {
    window.open(props.link)
  }
}

// 关闭通知栏
function handleClose() {
  if (props.closeable) {
    noticeBarWarpRef.value.style.display = 'none'
    timer.value && clearTimeout(timer.value)
  }
}

// 页面加载时
onMounted(() => {
  if (props.scrollable) return false
  if (props.animate) {
    initAnimation()
    listenerAnimationend()
  }
})

onBeforeUnmount(() => {
  timer.value && clearTimeout(timer.value)
})
</script>

<style scoped lang="scss">
.notice-bar {
  width: 100%;
  padding: 0 15px;
  border-radius: 4px;

  .notice-bar-warp {
    display: flex;
    align-items: center;
    width: 100%;
    height: inherit;

    .notice-bar-warp-text-box {
      position: relative;
      display: flex;
      flex: 1;
      align-items: center;
      height: inherit;
      overflow: hidden;

      .notice-bar-warp-text {
        position: absolute;
        left: 0;
        white-space: nowrap;
      }

      .notice-bar-warp-slot {
        width: 100%;
        white-space: nowrap;

        :deep(.el-carousel__item) {
          display: flex;
          align-items: center;
        }
      }
    }

    .notice-bar-warp-left-icon {
      width: 24px;
      font-size: inherit !important;
    }

    .notice-bar-warp-right-icon {
      width: 24px;
      font-size: inherit !important;
      text-align: right;

      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
