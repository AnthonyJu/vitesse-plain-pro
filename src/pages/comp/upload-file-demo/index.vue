<template>
  <div layout-default>
    <el-card shadow="hover" header="文件上传组件">
      <UploadFile :upload-props="uploadProps" @file-submit="submitResult" />
    </el-card>
  </div>
</template>

<script setup lang='ts'>
const uploadProps = {
  action: '',
  headers: {},
  multiple: true,
  autoUpload: false,
  showFileList: false,
}

function submitResult(file: any) {
  // eslint-disable-next-line no-console
  console.log('🚀 ~ file:', file)
}
</script>
