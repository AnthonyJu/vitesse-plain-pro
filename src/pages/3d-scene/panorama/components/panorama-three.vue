<template>
  <TresCanvas clear-color="#000000">
    <!-- 相机置于球体中心 -->
    <TresPerspectiveCamera :fov="90" :position="[0, 0, 0.1]" />

    <!-- 控制器：允许鼠标拖动查看 -->
    <OrbitControls :enable-zoom="false" :enable-pan="false" :enable-damping="true" :rotate-speed="-0.25" />

    <!-- 立方体贴图展示 -->
    <TresMesh :geometry="geometry" :material="materials" />
  </TresCanvas>
</template>

<script setup lang="ts">
import { OrbitControls } from '@tresjs/cientos'
import { TresCanvas } from '@tresjs/core'
import * as THREE from 'three'
import { onMounted, ref } from 'vue'

const { urls } = defineProps<{ urls: string[] }>()

const geometry = new THREE.BoxGeometry(1, 1, 1)
geometry.scale(1, 1, -1)

const materials = ref<THREE.Material[]>([])

onMounted(() => {
  const loader = new THREE.TextureLoader()
  const textures = urls.map(url => loader.load(url))
  materials.value = textures.map(texture => new THREE.MeshBasicMaterial({ map: texture }))
})
</script>
