<template>
  <div class="main-container">
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
          <!-- TODO：类型报错 -->
          <el-input v-model="child.regex" readonly>
            <template #prepend>
              <el-tooltip
                effect="dark"
                :content="child.name"
                placement="top"
              >
                <div class="w-150px truncate">
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
        name: '1.1 密码 (8-12位由数字、字母、特殊字符组成)',
        regex: /^(?=.*[a-z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.\/]).{8,12}$/,
      },
      {
        name: '1.2 手机号',
        regex: /^1[3456789]\d{9}$/,
      },
      // 国内座机电话
      // 1、区号：前面一个0，后面跟2-3位数字 ：0\d{2,3}
      // 2、电话号码：7-8位数字：\d{7,8}
      // 3、分机号：一般都是3-4位数字：\d{3,4}
      // 4、总结起来就是：区号+电话号码+分机号（分机号可有可无）
      // 5、如有空格，空格前后的数字个数之和应该是 8-12 位
      // 6、如有分机号，分机号前面要有 - 符号
      {
        name: '1.3 国内座机号',
        regex: /^0\d{2,3}-?\d{7,8}$/,
      },
      // 是否电话格式(手机和座机)
      {
        name: '1.4 电话格式(手机和座机)',
        regex: /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/,
      },
      {
        name: '1.5 身份证号',
        regex: /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/,
      },
      {
        name: '1.6 邮箱',
        regex: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
      },
      {
        name: '1.7 邮政编码',
        regex: /^[1-9]\d{5}(?!\d)$/,
      },
      {
        name: '1.8 QQ号',
        regex: /^[1-9][0-9]{4,10}$/,
      },
      // 微信官方定义的微信号规则
      // 1、可使用6-20个字母、数字、下划线和减号；
      // 2、必须以字母开头（字母不区分大小写）；
      // 3、不支持设置中文。
      {
        name: '1.9 微信号',
        regex: /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/,
      },
      {
        name: '1.10 车牌号',
        regex: /^[\u4E00-\u9FA5]{1}[A-Z]{1}[A-Z_0-9]{5}$/,
      },
      {
        name: '1.11 银行卡号',
        regex: /^([1-9]{1})(\d{14}|\d{18})$/,
      },
      // https://www.cods.org.cn/c/2018-10-22/702.html
      {
        name: '1.12 统一社会信用代码',
        regex: /^[0-9A-Z]{18}$/,
      },
    ],
  },
  {
    name: '2.数据验证',
    children: [
      {
        name: '2.1 数字',
        regex: /^\d+$/,
      },
      {
        name: '2.2 中文',
        regex: /^[\u4E00-\u9FA5]+$/,
      },
      {
        name: '2.3 英文',
        regex: /^[a-zA-Z]+$/,
      },
      {
        name: '2.4 大写英文',
        regex: /^[A-Z]+$/,
      },
      {
        name: '2.5 小写英文',
        regex: /^[a-z]+$/,
      },
      {
        name: '2.6 整数',
        regex: /^-?\d+$/,
      },
      {
        name: '2.7 小数',
        regex: /^-?\d+\.\d+$/,
      },
      {
        name: '2.8 浮点数',
        regex: /^(-?\d+)(\.\d+)?$/,
      },
      {
        name: '2.9 正整数',
        regex: /^[1-9]\d*$/,
      },
      {
        name: '2.10 正小数',
        regex: /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/,
      },
      {
        name: '2.11 负整数',
        regex: /^-[1-9]\d*$/,
      },
      {
        name: '2.12 负小数',
        regex: /^-([1-9]\d*\.\d*|0\.\d*[1-9]\d*)$/,
      },
    ],
  },
  {
    name: '3.特殊验证',
    children: [
      {
        name: '3.1 日期格式',
        regex: /^\d{4}-\d{1,2}-\d{1,2}$/,
      },
      {
        name: '3.2 日期时间格式',
        regex: /^\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}$/,
      },
      {
        name: '3.3 URL',
        regex: /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/,
      },
      {
        name: '3.4 IP',
        regex: /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/,
      },
      {
        name: '3.5 MAC地址',
        regex: /^([0-9a-fA-F]{2})(([/\s:-][0-9a-fA-F]{2}){5})$/,
      },
      {
        name: '3.6 HTML标签',
        regex: /^<(.*)>.*<\/\1>|<(.*) \/>$/,
      },
      {
        name: '3.7 16进制颜色',
        regex: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
      },
    ],
  },
])

const { copy, isSupported } = useClipboard()

// 复制
function copyFn(text: string) {
  if (!isSupported.value) {
    ElMessage.warning('您的浏览器可能不支持自动复制,请手动复制~')
    return
  }
  form.regex = text
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
