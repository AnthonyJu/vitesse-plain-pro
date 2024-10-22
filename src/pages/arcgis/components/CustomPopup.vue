<template>
  <div class="relative h-200px w-400px flex-col-center bg-#fff">
    <div mb-10 text-blue>{{ attributes.name }}</div>
    <ElButton type="primary" @click="emit('closePopup')">
      关闭
    </ElButton>
    <div class="absolute left-0 right-0 m-auto h-6px w-6px bg-blue -bottom-6px" />
  </div>
</template>

<script setup lang='ts'>
import type MapView from '@arcgis/core/views/MapView'
import { ElButton } from 'element-plus'

interface Props {
  view: MapView
  attributes: Record<string, any>
}
interface Emits {
  closePopup: []
  (key: string): any[]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// eslint-disable-next-line no-console
console.log(props.view)
</script>

<style lang="scss">
.esri-popup {
  box-shadow: none;

  .esri-popup__main-container {
    background-color: transparent;

    .esri-popup__header,
    .esri-popup__footer {
      display: none;
    }

    .esri-popup__content {
      margin: 0;

      --calcite-ui-background: transparent;
      --calcite-ui-foreground-1: transparent;

      .esri-widget {
        background-color: transparent;
      }
    }
  }
}
</style>
