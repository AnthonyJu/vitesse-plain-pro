<template>
  <div layout-default>
    <NoticeBar
      text="🎉优秀的数字滚动组件：vue-countup-v3，地址：https://github.com/jizai1125/vue-countup-v3，点击前往"
      link="https://github.com/jizai1125/vue-countup-v3"
    />
    <el-card class="mt-15px" shadow="hover" header="数字滚动：简单示例">
      <el-row :gutter="10" class="w-full flex">
        <el-col v-for="item in list" :key="item.name" :xs="24" :sm="6" :md="6" :lg="6" :xl="6">
          <div
            class="card"
            :style="{
              backgroundColor: item.bgColor,
              boxShadow: `0 0 10px ${item.bgColor}`,
              border: `1px solid ${item.bgColor}`,
            }"
          >
            <div class="w-full text-left text-12px">{{ item.name }}：</div>
            <CountUp ref="countUpRef" :end-val="item.value">
              <template v-if="item.prefix" #prefix>
                <span class="mr-10px text-14px text-#fff">{{ item.prefix }}</span>
              </template>
              <template v-if="item.suffix" #suffix>
                <span class="ml-10px text-14px text-#fff">{{ item.suffix }}</span>
              </template>
            </CountUp>
          </div>
        </el-col>
      </el-row>

      <el-button type="primary" @click="restart">重置动画</el-button>

      <div class="my-10px">代码</div>
      <CodeBlock :code="countUpStr" lang="html" />
    </el-card>

    <el-card class="mt-15px" shadow="hover" header="数字滚动：常用事件">
      <div class="card w-385px">
        <div class="w-full text-left text-12px">今日用户访问量：</div>
        <CountUp :end-val="count" @init="initFn">
          <template #prefix>
            <span class="mr-10px text-14px text-#fff">共点击</span>
          </template>
          <template #suffix>
            <span class="ml-10px text-14px text-#fff">次</span>
          </template>
        </CountUp>
      </div>
      <el-button type="primary" @click="reset">重置动画</el-button>
      <el-button type="primary" @click="pauseResume">切换暂停/恢复</el-button>
      <el-button type="primary" @click="changeFinal">变更终点值</el-button>
    </el-card>

    <el-card shadow="hover" header="数字滚动：属性（Properties）" class="mt-15px">
      <el-table :data="properties" style="width: 100%;">
        <el-table-column prop="a1" label="参数" />
        <el-table-column prop="a2" label="类型" />
        <el-table-column prop="a3" label="默认值" />
        <el-table-column prop="a4" label="说明" />
        <el-table-column prop="a5" label="版本" />
      </el-table>
    </el-card>

    <el-card shadow="hover" header="数字滚动：插槽（slots）" class="mt-15px">
      <el-table :data="slots" style="width: 100%;">
        <el-table-column prop="a1" label="参数" />
        <el-table-column prop="a2" label="说明" />
      </el-table>
    </el-card>

    <el-card shadow="hover" header="数字滚动：事件（Events）" class="mt-15px">
      <el-table :data="events" style="width: 100%;">
        <el-table-column prop="a1" label="参数" />
        <el-table-column prop="a2" label="说明" />
        <el-table-column prop="a3" label="返回" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang='ts'>
import type { ICountUp } from 'vue-countup-v3'
import CountUp from 'vue-countup-v3'
import { countUpStr } from './data/highlight'

interface refEmits {
  restart: () => void
}

const countUpRef = ref<Array<refEmits>>()
// ref的重置动画
function restart() {
  if (countUpRef.value?.length) {
    countUpRef.value?.forEach((item: refEmits) => {
      item.restart()
    })
  }
}

const list = ref([
  {
    name: '今日用户访问量',
    value: 2024,
    prefix: '',
    suffix: '次',
    bgColor: '#409eff',
  },
  {
    name: '今日气温',
    value: 27,
    prefix: '',
    suffix: '℃',
    bgColor: '#67c23a',
  },
  {
    name: '今日摸鱼',
    value: 18,
    prefix: '',
    suffix: '次',
    bgColor: '#e6a23c',
  },
  {
    name: '今日睡眠',
    value: 10,
    prefix: '',
    suffix: 'h',
    bgColor: '#f56c6c',
  },
])

const count = ref(2024)
const countUpObj = ref<ICountUp>()

function reset() {
  // 重置数字滚动
  countUpObj.value?.reset()
  countUpObj.value?.start()
}

function pauseResume() {
  // 暂停或者继续数字滚动
  countUpObj.value?.pauseResume()
}

function changeFinal() {
  // 变更终点值
  countUpObj.value?.update(4048)
}

// 初始化数字滚动实例
function initFn(e: ICountUp) {
  countUpObj.value = e
}

// 属性
const properties = reactive([
  {
    a1: 'endVal',
    a2: 'Number | String',
    a3: '',
    a4: '结束值',
    a5: '',
  },
  {
    a1: 'startVal',
    a2: 'Number | String',
    a3: '0',
    a4: '起始值',
    a5: '',
  },
  {
    a1: 'duration',
    a2: 'Number',
    a3: '2.5',
    a4: '动画时长，单位：秒',
    a5: '',
  },
  {
    a1: 'decimalPlaces',
    a2: 'Number',
    a3: '0',
    a4: '小数点位数',
    a5: '1.1.0',
  },
  {
    a1: 'autoplay',
    a2: 'Boolean',
    a3: 'true',
    a4: '是否自动计数',
    a5: '',
  },
  {
    a1: 'loop',
    a2: 'Boolean | Number',
    a3: 'false',
    a4: '循环次数，有限次数 / 无限循环',
    a5: '',
  },
  {
    a1: 'delay',
    a2: 'Number',
    a3: '0',
    a4: 'loop 循环的间隔时间，单位：秒',
    a5: '',
  },
  {
    a1: 'options',
    a2: 'Object',
    a3: '',
    a4: 'countUp.js Options',
    a5: '',
  },
])

// 插槽
const slots = reactive([
  {
    a1: 'prefix',
    a2: '前缀',
  },
  {
    a1: 'suffix',
    a2: '后缀',
  },
])

// 事件
const events = reactive([
  {
    a1: '@init',
    a2: 'CountUp 实例初始化完成触发',
    a3: 'CountUp 实例',
  },
  {
    a1: '@finished',
    a2: '计数结束时触发',
    a3: '',
  },
])
</script>

<style lang="scss" scoped>
.card {
  height: 100px;
  padding: 10px;
  margin: 10px 0;
  font-size: 40px;
  font-weight: bold;
  color: #fff;
  text-align: center;
  background-color: #409eff;
  border: 1px solid #409eff;
  border-radius: 10px;
  box-shadow: 0 0 10px #409eff;
}
</style>
