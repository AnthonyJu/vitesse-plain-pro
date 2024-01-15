<template>
  <div class="regexp">
    <div class="content">
      <!-- 在线测试 -->
      <div>
        <div class="my-10px text-18px">在线测试</div>
        <el-form :model="form" label-width="120px">
          <el-form-item label="正则表达式">
            <el-input v-model="form.regex" />
          </el-form-item>
          <el-form-item label="测试字符串">
            <el-input v-model="form.testStr" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="testFn">测试</el-button>
            <el-button type="primary" @click="clearFn">清除</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 列表 -->
      <div v-for="item in regexpsList" :key="item.name">
        <div class="my-10px text-18px">{{ item.name }}</div>
        <div v-for="child in item.children" :key="child.name" class="my-10px pl-28px">
          <div>
            <el-input v-model="child.regex" readonly>
              <template #prepend>
                <el-tooltip
                  effect="dark"
                  :content="child.name"
                  placement="top"
                >
                  <div class="w-100px truncate">
                    {{ child.name }}
                  </div>
                </el-tooltip>
              </template>
              <template #append>
                <el-button
                  type="default"
                  :icon="CopyDocument"
                  @click="copyFn(child.regex.toString())"
                />
              </template>
            </el-input>
          </div>
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
import { CopyDocument } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useClipboard } from '@vueuse/core'

const form = reactive({
  regex: '',
  testStr: '',
})

function testFn() {
  const { regex, testStr } = form
  if (!regex) {
    ElMessage.warning('请输入正则表达式~')
    return
  }
  // 如果regex 第一位是 / 最后一位是 / 则去掉
  const regexStr = new RegExp(
    regex.startsWith('/') && regex.endsWith('/')
      ? regex.slice(1, regex.length - 1)
      : regex,
  )
  const result = regexStr.test(testStr)

  if (result) ElMessage.success('匹配成功~')
  else ElMessage.error('匹配失败~')
}

function clearFn() {
  form.regex = ''
  form.testStr = ''
}

const regexpsList = ref([
  {
    name: '1.信息验证',
    children: [
      {
        name: '1.1 手机号',
        regex: /^1[3456789]\d{9}$/,
      },
      {
        name: '1.2 身份证号',
        regex: /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/,
      },
      {
        name: '1.3 邮箱',
        regex: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
      },
      {
        name: '1.4 密码 (8-12位由数字、字母、特殊字符组成)',
        regex: /^(?=.*[a-z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/]).{8,12}$/,
      },
      {
        name: '1.4 密码 (8-12位由数字、字母、特殊字符组成)',
        regex: /^(?=.*[a-z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/]).{8,12}$/,
      },
    ],
  },
  {
    name: '2.数据验证',
    children: [],
  },
  {
    name: '3.特殊验证',
    children: [],
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

onMounted(() => {
  if (!isSupported.value) {
    ElMessage.warning('您的浏览器可能不支持自动复制,请手动复制~')
  }
})
</script>

<style lang="scss" scoped>
.regexp {
  background-color: #fff;

  .content {
    padding: 20px;
  }
}
</style>
