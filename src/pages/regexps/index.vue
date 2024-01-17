<template>
  <div class="main-container">
    <NoticeBar text="🎉 Tips：点击表单头部区域可以复制标识，在表单输入可以验证规则，持续更新~" />
    <!-- 列表 -->
    <div v-for="item in regexpsList" :key="item.name">
      <div class="my-10px text-18px">{{ item.name }}</div>
      <el-input
        v-for="regex in item.children"
        :key="regex.name"
        v-model="regex.value"
        class="my-10px pl-28px"
        placeholder="请输入内容进行校验"
      >
        <template #prepend>
          <div class="mr-15px cursor-pointer" title="点击复制校验标识" @click="copyFn(regex.id)">
            {{ regex.name }}
          </div>
          <div class="line-height-0">
            <el-icon
              v-if="regex.value && regexTest(regex.id, regex.value)"
              color="#67C23A"
            >
              <SuccessFilled />
            </el-icon>
            <el-icon v-else-if="regex.value" color="#F56C6C">
              <CircleCloseFilled />
            </el-icon>
            <el-icon v-else color="#909399">
              <WarningFilled />
            </el-icon>
          </div>
        </template>
      </el-input>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  name: RegExps
</route>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { CircleCloseFilled, SuccessFilled, WarningFilled } from '@element-plus/icons-vue'

const regexpsList = ref([
  {
    name: '1. 信息验证',
    children: info_regex,
  },
  {
    name: '2. 数据验证',
    children: data_regex,
  },
  {
    name: '3. 特殊验证',
    children: special_regex,
  },
])

const { copy, isSupported } = useClipboard()

// 复制
function copyFn(text: string) {
  if (!isSupported.value) {
    ElMessage.warning('您的浏览器可能不支持自动复制,请手动复制~')
    return
  }
  copy(text).then(() => {
    ElMessage.success('复制成功~')
  })
}
</script>
