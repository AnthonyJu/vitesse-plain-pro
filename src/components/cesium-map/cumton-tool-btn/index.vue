<template>
  <div class="h-30px flex-center gap-10px">
    <div v-show="showTools" class="flex-center gap-10px">
      <el-button class="cursor-pointer border-none m-0!" type="danger" circle @click="clear">
        <VcIcon name="vc-icons-clear" size="20px" />
      </el-button>
      <el-button
        v-for="instance in instances"
        :key="instance.name"
        :color="instance.isActive ? '#0ff' : '#1b76d3'"
        class="flex-center cursor-pointer m-0! p-0!"
        circle
        @click="toggle(instance)"
      >
        <VcIcon :name="instance.actionOpts.icon" size="20px" color="#fff" />
      </el-button>
    </div>
    <div class="cesium-tool-btn" @click="showTools = !showTools">
      <Iconify size="25px" :icon="icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-expect-error no exported
import { VcIcon } from 'vue-cesium'

const { parent } = defineProps<{
  instances: any[]
  parent: any
  icon: string
}>()

const showTools = ref(false)

function toggle(ins: any) {
  parent.toggleAction(ins.name)
}
function clear() {
  parent.clearAll()
}
</script>
