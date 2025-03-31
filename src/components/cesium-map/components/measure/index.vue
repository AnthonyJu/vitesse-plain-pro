<template>
  <el-dropdown>
    <div class="h-30px w-30px flex-center rounded-5px bg-#0006 text-22px text-#fff" title="测量">
      <Iconify icon="carbon-ruler-alt" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="measure('distance')">距离测量</el-dropdown-item>
        <el-dropdown-item @click="measure('area')">面积测量</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import type { Viewer } from 'cesium'
import type { ShallowRef } from 'vue'
import { AreaSurfaceMeasure, DistanceSurfaceMeasure } from './utils'

const viewer = inject('viewer') as ShallowRef<Viewer | null>

let areaSurfaceMeasure: AreaSurfaceMeasure | null = null
let distanceSurfaceMeasure: DistanceSurfaceMeasure | null = null

watchOnce(viewer, () => {
  areaSurfaceMeasure = new AreaSurfaceMeasure(viewer.value!)
  distanceSurfaceMeasure = new DistanceSurfaceMeasure(viewer.value!)
})

function measure(type: string) {
  if (type === 'distance') {
    distanceSurfaceMeasure?.start()
  }
  else if (type === 'area') {
    areaSurfaceMeasure?.start()
  }
}
</script>

<style scoped>

</style>
