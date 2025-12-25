<template>
  <div v-loading="isLoading" class="relative full">
    <TresCanvas @render="render">
      <!-- 透视相机 -->
      <TresPerspectiveCamera ref="camera" :args="[90, 1, 0.1, 1000]" :position="[0, 0, 0]" />
      <!-- 环境光 -->
      <TresAmbientLight color="#ffffff" :intensity="2" :position="[300, 300, 250]" />
      <!-- 全景球体 -->
      <TresMesh
        @pointer-down="onPointerDown"
        @pointer-move="onPointerMove"
        @pointer-up="onPointerUp"
        @wheel="onDocumentMouseWheel"
      >
        <TresSphereGeometry :scale="[-1, 1, 1]" :args="[500, 60, 40]" />
        <TresMeshStandardMaterial :map="texture" />
      </TresMesh>
    </TresCanvas>

    <el-button class="absolute bottom-10px right-10px z-10" type="primary" @click="stopRotate = !stopRotate">
      {{ stopRotate ? '自动游览' : '暂停游览' }}
    </el-button>
  </div>
</template>

<script setup lang='ts'>
import { useTexture } from '@tresjs/cientos'
import { TresCanvas } from '@tresjs/core'
import * as THREE from 'three'
import { useDragView } from './composables/drag-view'

const { url } = defineProps<{
  url: string
}>()
const { state: texture, isLoading } = await useTexture(url)
// 设置颜色空间, 使得贴图颜色更加真实
texture.value.colorSpace = THREE.SRGBColorSpace

const camera = ref<InstanceType<typeof THREE.PerspectiveCamera>>()

const {
  render,
  stopRotate,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onDocumentMouseWheel,
} = useDragView(camera)
</script>
