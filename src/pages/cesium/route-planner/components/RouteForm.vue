<script setup lang="ts">
import type { CAMERA_LIST } from '../data/route-constants'
import type { BaseSettings, PlanParams } from '../generate-mission-route'

const props = defineProps<{
  form: PlanParams
  baseSettings: BaseSettings
  cameraList: typeof CAMERA_LIST
}>()

const emit = defineEmits<{
  'update:form': [value: PlanParams]
  'update:baseSettings': [value: BaseSettings]
}>()

const activeTab = ref('basic')

const formData = computed({
  get: () => props.form,
  set: val => emit('update:form', val),
})

const settings = computed({
  get: () => props.baseSettings,
  set: val => emit('update:baseSettings', val),
})
</script>

<template>
  <el-form :model="formData" label-width="110px" class="m-10px">
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane label="基础参数" name="basic">
        <el-form-item label="航线规划类型">
          <el-select v-model="formData.flightPattern">
            <el-option label="S 形" value="s-shape" />
            <el-option label="井字形" value="grid-shape" />
          </el-select>
        </el-form-item>
        <el-form-item label="最大飞行距离">
          <el-input-number v-model.number="settings.maxFlightDistance" :step="10" :min="1" />
          <span class="ml-10px">km</span>
        </el-form-item>
        <el-form-item label="最大飞行半径">
          <el-input-number v-model.number="settings.maxFlightRadius" :step="1" :min="1" />
          <span class="ml-10px">km</span>
        </el-form-item>
        <el-form-item label="飞行高度">
          <el-input-number v-model.number="formData.altitude" :step="10" />
          <span class="ml-10px">m</span>
        </el-form-item>
        <el-form-item label="前向重叠率">
          <el-input-number v-model.number="formData.frontOverlap" :step="5" />
          <span class="ml-10px">%</span>
        </el-form-item>
        <el-form-item label="侧向重叠率">
          <el-input-number v-model.number="formData.sideOverlap" :step="5" />
          <span class="ml-10px">%</span>
        </el-form-item>
        <el-form-item label="航线方向">
          <el-input-number v-model.number="formData.flightDirectionDeg" :step="5" />
          <span class="ml-10px">°</span>
        </el-form-item>
        <el-form-item label="飞行速度">
          <el-input-number v-model.number="formData.flightSpeed" :step="5" />
          <span class="ml-10px">m/s</span>
        </el-form-item>
        <el-form-item label="延长线长度">
          <el-input-number v-model.number="formData.extensionCord" :step="10" />
          <span class="ml-10px">m</span>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="相机参数" name="camera">
        <el-form-item label="照片拍摄方式">
          <el-select v-model="formData.camera.triggerType">
            <el-option label="按飞行距离" value="CAM_TRIGG_DIST" />
          </el-select>
        </el-form-item>
        <el-form-item label="相机型号">
          <el-select v-model="formData.camera" value-key="id" placeholder="请选择相机型号">
            <el-option
              v-for="item in cameraList"
              :key="item.value.toString()"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="拍摄焦距">
          <el-input-number v-model.number="formData.camera.focalLengthMm" />
          <span class="ml-10px">mm</span>
        </el-form-item>
        <el-form-item label="传感器宽度">
          <el-input-number v-model.number="formData.camera.sensorWidthMm" />
          <span class="ml-10px">mm</span>
        </el-form-item>
        <el-form-item label="传感器高度">
          <el-input-number v-model.number="formData.camera.sensorHeightMm" />
          <span class="ml-10px">mm</span>
        </el-form-item>
        <el-form-item label="图像宽度">
          <el-input-number v-model.number="formData.camera.imageWidthPx" />
          <span class="ml-10px">px</span>
        </el-form-item>
        <el-form-item label="图像高度">
          <el-input-number v-model.number="formData.camera.imageHeightPx" />
          <span class="ml-10px">px</span>
        </el-form-item>
      </el-tab-pane>
    </el-tabs>
  </el-form>
</template>
