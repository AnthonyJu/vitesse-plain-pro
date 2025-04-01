<template>
  <el-dropdown>
    <div class="tool-btn" title="测量">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32">
        <path
          fill="currentColor"
          d="M29.41
          21.67L10.34
          2.58a2
          2
          0
          0
          0-2.83
          0L2.59
          7.51a2
          2
          0
          0
          0
          0
          2.82l19.07
          19.09a2
          2
          0
          0
          0
          1.42.58a2
          2
          0
          0
          0
          1.41-.58l4.92-4.93a2
          2
          0
          0
          0
          0-2.82M23.08
          28L4
          8.92L8.92
          4l3.79
          3.79L10.46
          10l1.41
          1.41l2.25-2.21l4.13
          4.13L16
          15.58L17.42
          17l2.25-2.25l4.13
          4.13l-2.25
          2.25L23
          22.54l2.25-2.25L28
          23.08Z"
        />
      </svg>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <!--        <el-dropdown-item @click="measure('distance')">距离测量</el-dropdown-item> -->
        <!--        <el-dropdown-item @click="measure('area')">面积测量</el-dropdown-item> -->
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
// import type { Viewer } from 'cesium'
// import type { ShallowRef } from 'vue'

// const viewer = inject('viewer') as ShallowRef<Viewer | null>
//
// function measure(type: string) {
// if (type === 'distance') {
// }
// else if (type === 'area') {
// }
// }
</script>
