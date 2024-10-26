<template>
  <div>
    <el-upload
      ref="uploadRef"
      class="upload-demo"
      v-bind="uploadProps"
      @change="fileChange"
    >
      <template #trigger>
        <el-button type="primary">上传文件</el-button>
      </template>

      <el-button class="ml-3" type="success" @click="submitUpload">
        上传
      </el-button>

      <el-button class="ml-3" type="danger" @click="cancelUpload">
        清空列表
      </el-button>

      <template #tip>
        <div class="el-upload__tip">
          <span v-if="!uploadFileNum">选择你的文件</span>
          <span v-else>已选择 {{ uploadFileNum }} 个文件</span>
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script setup lang='ts'>
import type { UploadFile, UploadFiles } from 'element-plus'

interface Props {
  uploadProps?: object
}

defineProps<Props>()
const emit = defineEmits(['fileSubmit'])

const uploadRef = useTemplateRef('uploadRef')
// 上传文件列表
const uploadFileList = ref<UploadFiles>([])
// 上传文件数量
const uploadFileNum = ref(0)

// 文件上传前的钩子函数
function fileChange(_file: UploadFile, files: UploadFiles) {
  uploadFileList.value = files
  uploadFileNum.value = files.length
}

/**
 * 上传文件
 * 使用 FormData 上传文件
 */
function submitUpload() {
  if (!uploadFileList.value.length) {
    ElMessage.warning('请选择文件')
    return
  }

  const formData = new FormData()
  const files = uploadFileList.value.map(file => file)
  for (const file of files) {
    formData.append(file.name, file.raw as File)
  }

  emit('fileSubmit', formData)
}

// 清空上传列表
function cancelUpload() {
  uploadRef.value!.clearFiles()
  uploadFileList.value = []
  uploadFileNum.value = 0
}

defineExpose({
  uploadRef,
  uploadFileList,
  uploadFileNum,
})
</script>
