<template>
  <div class="gridDrag layout-default">
    <div class="dragResizable h-600px w-800px">
      <VueDraggableResizable
        :min-width="250"
        :min-height="100"
        :w="300"
        :h="200"
        :parent="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/style.css'
</script>

<style lang="scss" scoped>
.dragResizable {
  border: 1px solid #2fc8fc;
  border-radius: 5px;
}
</style>
