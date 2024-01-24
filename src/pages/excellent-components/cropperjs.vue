<template>
  <div class="main-container">
    <el-card class="mt-15px" shadow="hover" header="图片剪裁：简单示例">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <div class="mx-auto h-300px w-500px">
            <img id="image" class="max-w-100%" src="@/assets/cropper_avatar.png">
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <div class="preview ml-10px">
            <div class="mb-10px">预览</div>
            <div class="mb-10px h-100px w-100px overflow-hidden">
              <img
                class="mr-10px full"
                :style="img_100Style"
                src="@/assets/cropper_avatar.png"
              >
              100x100
            </div>
            <div class="h-50px w-50px overflow-hidden">
              <img
                class="mr-10px full"
                :style="img_50Style"
                src="@/assets/cropper_avatar.png"
              >
              50x50
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<route lang="yaml">
  meta:
    name: 图片剪裁
</route>

<script setup lang='ts'>
import Cropper from 'cropperjs'

interface MoveData {
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

// TODO 优化：封装成函数
const img_100Style = computed(() => {
  return {
    width: `${30000 / moveData.width}px`,
    height: `${30000 / moveData.height}px`,
    transform: `translate(${-(moveData.left - 100) / 2}px,${-moveData.top / 2}px)`,
  }
})
const img_50Style = computed(() => {
  return {
    width: `${15000 / moveData.width}px`,
    height: `${15000 / moveData.height}px`,
    transform: `translate(${-(moveData.left - 100) / 4}px,${-moveData.top / 4}px)`,
  }
})

function initCropper(id: string, options: Cropper.Options) {
  const image = document.getElementById(id) as HTMLImageElement
  const cropper = new Cropper(image, options)
  // 监听剪裁框移动事件 结束时获取剪裁后的图片
  // TODO 预览图不能使用监听cropmove的形式，来升成图片地址，因为这个事件会频繁触发，会导致浏览器卡顿
  image.addEventListener('cropend', () => {
    previewImage.value = cropper.getCroppedCanvas({ width: 100, height: 100 }).toDataURL('image/jpeg', 0.8)
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
      moveData = cropper.value!.getCropBoxData()
      // eslint-disable-next-line no-console
      console.log('🚀 ~ moveData.value:', moveData)
    },
  })
})
</script>
