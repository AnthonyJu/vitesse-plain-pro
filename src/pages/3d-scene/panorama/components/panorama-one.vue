<template>
  <TresCanvas>
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
</template>

<script setup lang='ts'>
import { useDragView } from '@/pages/3d-scene/panorama/components/composables/drag-view'
import { TresCanvas, useTexture } from '@tresjs/core'
import * as THREE from 'three'

const { url } = defineProps<{
  url: string
}>()

// TODO Loading
const texture = await useTexture([url])
// 设置颜色空间, 使得贴图颜色更加真实
texture.colorSpace = THREE.SRGBColorSpace

const camera = ref<InstanceType<typeof THREE.PerspectiveCamera>>()
const {
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onDocumentMouseWheel,
} = useDragView(camera)
</script>
