<template>
  <div layout-default>
    <el-card shadow="hover" header="文件上传组件">
      <UploadFile :upload-props="uploadProps" @file-submit="submitResult" />
    </el-card>
  </div>
</template>

<script setup lang='ts'>
import axios from 'axios'

const uploadProps = {
  action: '',
  headers: {},
  multiple: true,
  autoUpload: false,
  showFileList: false,
}

function submitResult(file: any) {
  // 上传文件 模拟
  axios.post({
    url: 'xxx',
    data: file,
    responseType: 'blob', // 关键配置，指定响应类型为 Blob
  }).then((res) => {
    // eslint-disable-next-line no-console
    console.log('🚀 ~ res:', res)
  }).catch((err) => {
    console.error('🚀 ~ err:', err)
  })
}
</script>
