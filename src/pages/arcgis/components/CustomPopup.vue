<template>
  <div ref="popupRef" class="h-200px flex-col-center bg-#fff">
    <div mb-10>自定义子组件</div>
    <div>
      <el-button type="primary" @click="onClick">
        触发父组件事件
      </el-button>
      <el-button type="primary" @click="view.closePopup()">
        关闭弹窗
      </el-button>
    </div>
  </div>
</template>

<script setup lang='ts'>
import type MapView from '@arcgis/core/views/MapView'

const props = defineProps<{
  view: MapView
}>()
const emit = defineEmits<{
  eventEmit: [arg: string]
}>()

// eslint-disable-next-line no-console
console.log(props.view)

const popupRef = ref()
const targetIsVisible = useElementVisibility(popupRef)
watch(targetIsVisible, (visible) => {
  if (visible) document.body.style.cursor = 'default'
})

function onClick() {
  emit('eventEmit', '我是子组件传递的参数')
}
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
