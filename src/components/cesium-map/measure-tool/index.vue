<template>
  <VcMeasurements
    position="bottom-right"
    :offset="[10, 110]"
    :editable="false"
    :main-fab-opts=" {
      modelValue: false,
      direction: 'left',
      tooltip: {
        delay: 999999999,
      },
    }"
    :clamp-to-ground="true"
    :measurements="['circle', 'area', 'polyline', 'vertical']"
    active-color="#1BCBEA"
    :area-action-opts="{
      tooltip: {
        offset: [0, 10],
      },
    }"
    :polyline-action-opts="{
      tooltip: {
        offset: [0, 10],
      },
    }"
  />
</template>

<script setup lang="ts">
// @ts-expect-error no exported
import { VcMeasurements } from 'vue-cesium'
</script>

<style lang="scss">
.vc-drawings-container {
  .vc-btn--fab {
    width: 30px;
    min-width: 30px;
    height: 30px;
    min-height: 30px;
    padding: 0 !important;
    color: #fff;
    cursor: pointer;
    background-color: rgb(0 0 0 / 60%) !important;
    border-radius: 5px;

    &:hover {
      background-color: rgb(0 0 0 / 80%) !important;
    }

    .vc-icon {
      font-size: 18px !important;
    }
  }

  .vc-fab__actions {
    .vc-btn {
      min-width: 32px;
      min-height: 32px;

      .vc-icon {
        font-size: 18px !important;
      }
    }
  }
}
</style>
