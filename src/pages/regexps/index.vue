<template>
  <div class="main-container">
    <NoticeBar text="Tips：点击表单头部区域可以复制标识，在表单输入可以验证规则，持续更新~" />
    <!-- 列表 -->
    <div v-for="item in regexpsList" :key="item.name">
      <div class="my-10px text-18px">{{ item.name }}</div>
      <div v-for="child in item.children" :key="child.name" class="my-10px pl-28px">
        <div>
          <el-input v-model="child.value" :title="child.id">
            <template #prepend>
              <div class="cursor-pointer" title="点击复制标识" @click="copyFn(child.id)">
                {{ child.name }} | {{ child.id }}
              </div>
              <div class="mx-10px h-20px w-2px bg-gray-300" />
              <div class="line-height-0">
                <el-icon
                  v-if="regexTest(child.id!, child.value)"
                  color="#67C23A"
                  title="符合校验规则"
                >
                  <SuccessFilled />
                </el-icon>
                <el-icon
                  v-else-if="child.value"
                  color="#F56C6C"
                  title="不符合校验规则"
                >
                  <CircleCloseFilled />
                </el-icon>
                <el-icon v-else color="#909399" title="未填写校验内容"><WarningFilled /></el-icon>
              </div>
            </template>
          </el-input>
        </div>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
  meta:
    name: RegExps
</route>

<script setup lang="ts">
import { CircleCloseFilled, SuccessFilled, WarningFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import { info_regex, regexTest } from '@/utils/validate'

const regexpsList = ref([
  {
    name: '1.信息验证',
    children: info_regex,
  },
  {
    name: '2.数据验证',
    children: data_regex,
  },
  {
    name: '3.特殊验证',
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
  copy(text)
}

onMounted(() => {
  if (!isSupported.value) {
    ElMessage.warning('您的浏览器可能不支持自动复制,请手动复制~')
  }
})
</script>
