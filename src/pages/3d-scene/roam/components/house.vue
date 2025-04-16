<template>
  <primitive :object="scene" />
</template>

<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos'
import { onMounted } from 'vue'

const { scene } = await useGLTF('/models/house/scene.gltf')
// const { camera } = useTresContext()

onMounted(() => {
  // // 设置相机初始位置（示例坐标，可根据需要调整）
  // const startPosition = new Vector3(10, 8, 12)
  // camera.value!.position.copy(startPosition)

  // 使用GSAP创建动画
  // const targetPosition = new Vector3(1280, 350, 480)
  // gsap.to(camera.value!.position, {
  //   x: targetPosition.x,
  //   y: targetPosition.y,
  //   z: targetPosition.z,
  //   duration: 3,
  //   ease: 'power2.inOut',
  // })
})
</script>
