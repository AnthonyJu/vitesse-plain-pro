<template>
  <div v-loading="loading" class="relative full">
    <TresCanvas @render="render">
      <!-- 透视相机 -->
      <TresPerspectiveCamera ref="camera" :args="[90, 1, 0.1, 1000]" :position="[0, 0, 0]" />
      <!-- 全景立方体 -->
      <TresMesh
        :material="boxMaterials"
        @pointer-down="onPointerDown"
        @pointer-move="onPointerMove"
        @pointer-up="onPointerUp"
        @wheel="onDocumentMouseWheel"
      >
        <TresBoxGeometry :scale="[1, 1, -1]" :args="[1, 1, 1]" />
      </TresMesh>
    </TresCanvas>

    <el-button class="absolute bottom-10px right-10px z-10" type="primary" @click="stopRotate = !stopRotate">
      {{ stopRotate ? '自动游览' : '暂停游览' }}
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import * as THREE from 'three'
import { useDragView } from './composables/drag-view'

const { url } = defineProps<{
  url: string
}>()

const loading = ref(true)

// 纹理贴图
const textures = await getTexturesFromAtlasFile(url, 6)
// 立方体材质
const boxMaterials = textures.map(t => new THREE.MeshBasicMaterial({ map: t }))

// 获取纹理
function getTexturesFromAtlasFile(atlasImgUrl: string, length: number): Promise<THREE.Texture[]> {
  return new Promise((resolve) => {
    const textures: THREE.Texture[] = Array.from({ length }).fill(null).map(() => new THREE.Texture())

    new THREE.ImageLoader().load(atlasImgUrl, (image) => {
      const tileSize = image.height
      for (let i = 0; i < length; i++) {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')!
        canvas.height = tileSize
        canvas.width = tileSize
        context.drawImage(image, tileSize * i, 0, tileSize, tileSize, 0, 0, tileSize, tileSize)

        textures[i].image = canvas
        textures[i].needsUpdate = true
        textures[i].colorSpace = THREE.SRGBColorSpace

        loading.value = false
      }
      resolve(textures)
    })
  })
}

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
