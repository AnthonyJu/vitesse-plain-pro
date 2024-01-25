export const tsStr = `import { codeToHtml } from 'shikiji'

/**
 * @description: Syntax highlighter
 * @param {string} str code string
 * @param {string} lang language
 * @param {string} container container selector
 * @return { html: Ref<string> } html: highlight HTML string
 */
export function useSyntaxHighlighter(str: string, lang: string, container?: string) {
  const html = ref('')

  onMounted(() => {
    codeToHtml(str, {
      lang,
      theme: 'vitesse-dark',
    })
      .then((value) => {
        html.value = value

        if (!container) return

        const el = document.querySelector(container)
        if (el) el.innerHTML = value
      })
  })

  return {
    html,
  }
}`

export const vueStr = `<template>
  <div id="vue" />
</template>

<route lang='yaml'>
meta:
  name: 语法高亮
</route>

<script setup lang='ts'>
import { vueStr } from './data/highlight'

useSyntaxHighlighter(vueStr, 'vue', '#vue')
</script>
`

export const countUpStr = `<CountUp ref="countUpRef" :end-val="data.count">
  <template v-if="data.prefix" #prefix>
    <span class="mr-10px text-#fff text-14px">{{ data.prefix }}</span>
  </template>
  <template v-if="data.suffix" #suffix>
    <span class="text-#fff ml-10px text-14px">{{ data.suffix }}</span>
  </template>
</CountUp>`

export const cropperjsStr = `<template>
  <div class="mx-auto h-300px w-300px">
    <img id="image" class="max-w-100%" src="@/assets/cropper_avatar.png">
  </div>
</template>

<script setup lang='ts'>
import Cropper from 'cropperjs'
import { cropperjsStr } from './data/highlight'


const cropper = ref<Cropper>()
const previewImage = ref('')

// 初始化剪裁框 官方地址:https://github.com/fengyuanchen/cropperjs
function initCropper(id: string, options: Cropper.Options) {
  const image = document.getElementById(id) as HTMLImageElement
  const cropper = new Cropper(image, options)

  // 监听剪裁框移动事件 结束时获取剪裁后的图片
  // 预览图不能使用监听cropmove的形式，来升成图片地址，因为这个事件会频繁触发，会导致浏览器卡顿
  image.addEventListener('cropend', () => {
    previewImage.value = cropper.getCroppedCanvas().toDataURL('image/jpeg')
  })

  return cropper
}

onMounted(() => {
  cropper.value = initCropper('image', {
    viewMode: 1,
    dragMode: 'none',
    initialAspectRatio: 1,
    aspectRatio: 1,
    preview: '.before',
    background: false,
    autoCropArea: 0.6,
    zoomOnWheel: false,
    crop: () => {
      // do something...
    },
  })
})
</script>
`

export const tourDemoStr = `<template>
  <el-button type="primary" @click="open = true">开始漫游</el-button>
  <el-divider />
  <el-space>
    <el-button ref="ref1">上传文件</el-button>
    <el-button ref="ref2" type="primary">保存</el-button>
    <el-button ref="ref3" :icon="MoreFilled" />
    <!-- 子组件漫游也是支持的 -->
  </el-space
  <el-tour v-model="open">
    <el-tour-step :target="ref1?.$el" title="上传文件">
      <img
        src="https://element-plus.org/images/element-plus-logo.svg"
        alt="tour.png"
      >
      <div>把想要上传的文件放在这</div>
    </el-tour-step>
    <el-tour-step
      :target="ref2?.$el"
      title="保存"
      description="保存你的更改"
    />
    <el-tour-step
      :target="ref3?.$el"
      title="其他选项"
      description="点击查看其他选项"
    />
  </el-tour>
</template>

<script setup lang='ts'>
import { MoreFilled } from '@element-plus/icons-vue'
import type { ButtonInstance } from 'element-plus'

const open = ref(false)
const ref1 = ref<ButtonInstance>()
const ref2 = ref<ButtonInstance>()
const ref3 = ref<ButtonInstance>()
</script>
`
