<template>
  <div>
    <NoticeBar
      text="✨✨✨ 使用@vueuse/integrations/useQRCode生成的二维码"
    />
    <el-card shadow="hover" header="二维码生成" class="mt-15px">
      <div class="qrcode-img">
        <img
          style="width: 200px; height: 200px;border: 1px solid #eee;border-radius: 4px;"
          :src="qrcode"
          alt="QR Code"
        >
      </div>
      <div class="text-center">
        <input v-model="text" type="text" class="px-10px py-4px">
      </div>
      <code-block class="my-10px" :code="qrcodeStr" lang="vue" />
      <div>
        <p>注意：</p>
        <p class="text-12px">1. 依赖qrcode插件: https://github.com/soldair/node-qrcode</p>
        <p class="text-12px">2. Available in the @vueuse/integrations add-on.</p>
        <p class="text-12px">更多详细内容转到官网：<a href="https://vueuse.org/integrations/useQRCode/">https://vueuse.org/integrations/useQRCode/</a></p>
      </div>
    </el-card>
  </div>
</template>

<route lang="yaml">
  meta:
    name: 二维码
</route>

<script setup lang='ts'>
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { qrcodeStr } from './data/highlight'

// qrcode插件: https://github.com/soldair/node-qrcode
// AND Available in the @vueuse/integrations add-on.
const text = ref('https://www.baidu.com/')
const qrcode = useQRCode(text)
</script>

<style lang="scss" scoped>
.qrcode-img {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
</style>
