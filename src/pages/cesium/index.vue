<template>
  <CesiumMap>
    <VcNavigation :offset="[15, 15]" />
  </CesiumMap>
</template>

<script setup lang='ts'>
import {
  VcNavigation,
} from 'vue-cesium'
</script>
