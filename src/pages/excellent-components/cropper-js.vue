<template>
  <div class="main-container">
    <NoticeBar
      text="🎉图片剪裁组件cropperjs，地址：https://github.com/fengyuanchen/cropperjs，点击前往"
      right-icon="carbon:chevron-right"
      mode="link"
      @link="linkFn"
    />
    <el-card class="mt-15px" shadow="hover" header="图片剪裁：简单示例">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <div class="mx-auto h-300px w-300px">
            <img id="image" class="max-w-100%" src="@/assets/cropper_avatar.png">
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <div class="mb-10px">预览</div>
          <div class="flex items-end">
            <div>
              <div class="h-150px w-150px overflow-hidden rounded-full">
                <img
                  class="mr-10px full"
                  :style="img_150Style"
                  src="@/assets/cropper_avatar.png"
                >
              </div>
              <div class="text-center">150x150</div>
            </div>
            <div class="mx-20px">
              <div class="h-100px w-100px overflow-hidden rounded-full">
                <img
                  class="mr-10px full"
                  :style="img_100Style"
                  src="@/assets/cropper_avatar.png"
                >
              </div>
              <div class="text-center">100x100</div>
            </div>
            <div>
              <div class="h-50px w-50px overflow-hidden rounded-full">
                <img
                  class="mr-10px full"
                  :style="img_50Style"
                  src="@/assets/cropper_avatar.png"
                >
              </div>
              <div class="text-center">50x50</div>
            </div>
          </div>
        </el-col>
      </el-row>

      <div class="my-10px">代码</div>
      <div id="cropper-demo" />
    </el-card>
  </div>
</template>

<route lang="yaml">
  meta:
    name: 图片剪裁
</route>

<script setup lang='ts'>
import Cropper from 'cropperjs'
import { cropperjsStr } from './data/highlight'

useSyntaxHighlighter(cropperjsStr, 'html', '#cropper-demo')

interface MoveData {
  width: number
  height: number
  left: number
  top: number
}

interface CropData {
  width: number
  height: number
  left: number
  top: number
}

const cropper = ref<Cropper>()
const previewImage = ref('')
let moveData = reactive<MoveData>({
  width: 180,
  height: 180,
  left: 160,
  top: 60,
})
const img_150Style = ref({})
const img_100Style = ref({})
const img_50Style = ref({})

// 预览图样式函数
function watchPreview(
  cropData: CropData,
  previewWidth: number,
  previewHeight: number,
  cropWidth: number,
  cropHeight: number,
) {
  const { width, height, left, top } = cropData
  const imgWidth = cropWidth * previewWidth / width
  const imgHeight = cropHeight * previewHeight / height
  const imgLeft = -left * imgWidth / cropWidth
  const imgTop = -top * imgHeight / cropHeight
  return {
    width: `${imgWidth.toFixed(0)}px`,
    height: `${imgHeight.toFixed(0)}px`,
    transform: `translate(${imgLeft.toFixed(0)}px,${imgTop.toFixed(0)}px)`,
  }
}

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

function linkFn() {
  window.open('https://github.com/fengyuanchen/cropperjs')
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
      moveData = cropper.value!.getCropBoxData()
      img_150Style.value = watchPreview(moveData, 150, 150, 300, 300)
      img_100Style.value = watchPreview(moveData, 100, 100, 300, 300)
      img_50Style.value = watchPreview(moveData, 50, 50, 300, 300)
    },
  })
})
</script>
