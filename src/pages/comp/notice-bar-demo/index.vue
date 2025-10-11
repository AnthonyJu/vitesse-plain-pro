<template>
  <div layout-default>
    <el-card shadow="hover" header="滚动通知栏：默认">
      <NoticeBar
        text="😎孩儿立志出乡关,👨‍💻学不成名誓不还。🌳埋骨何须桑梓地,🏕人生无处不青山。"
      />
      <div class="my-10px">代码:</div>
      <CodeBlock :code="noticeBarSimpleStr" lang="vue" />
    </el-card>

    <el-card shadow="hover" header="滚动通知栏：设置样式" class="mt-15px">
      <NoticeBar
        :text="state.textStr"
        left-icon="carbon:user-speaker"
        background="#ecf5ff"
        link="www.baidu.com"
        color="#409eff"
        :speed="100"
      />
      <div class="my-10px">代码:</div>
      <CodeBlock :code="noticeBarIconStr" lang="vue" />
    </el-card>

    <el-card
      shadow="hover"
      header="滚动通知栏：搭配 NoticeBar 和 Carousel 走马灯 组件可以实现垂直滚动的效果"
      class="mt-15px"
    >
      <NoticeBar :scrollable="true">
        <el-carousel
          height="40px"
          direction="vertical"
          :autoplay="true"
          indicator-position="none"
          :interval="3000"
        >
          <el-carousel-item v-for="v in state.noticeList" :key="v">{{ v }} </el-carousel-item>
        </el-carousel>
      </NoticeBar>
      <div class="my-10px">代码:</div>
      <CodeBlock :code="noticeBarScrollStr" lang="html" />
    </el-card>

    <el-card shadow="hover" header="滚动通知栏：参数" class="mt-15px">
      <el-table :data="state.tableData" style="width: 100%;">
        <el-table-column prop="a1" label="参数" />
        <el-table-column prop="a2" label="说明" />
        <el-table-column prop="a3" label="类型" />
        <el-table-column prop="a4" label="可选值" />
        <el-table-column prop="a5" label="默认值" />
      </el-table>
    </el-card>

    <!--    <el-card shadow="hover" header="图标选择器(宽度自动)：事件" class="mt-15px"> -->
    <!--      <el-table :data="state.tableData1" style="width: 100%;"> -->
    <!--        <el-table-column prop="a1" label="事件名称" /> -->
    <!--        <el-table-column prop="a2" label="说明" /> -->
    <!--        <el-table-column prop="a3" label="类型" /> -->
    <!--        <el-table-column prop="a4" label="回调参数" /> -->
    <!--      </el-table> -->
    <!--    </el-card> -->
  </div>
</template>

<script setup lang='ts'>
import { noticeBarIconStr, noticeBarScrollStr, noticeBarSimpleStr } from '../data/highlight'

// 定义变量内容
const state = reactive({
  textStr: '🎼我肯定在几百年前就说过爱你👩‍💼只是你忘了我也没记起🚶‍♀️走过 路过 没遇过🚶‍♂️回头 转头 还是错🎈你我不曾感受过 相撞在街口🎶相撞在街口...',
  noticeList: [
    '如果有一天我变得很有钱 我会买下所有难得一见的笑脸',
    '让所有可怜的孩子不再胆怯 所有邪恶的人不再掌握话语权',
    '如果有一天我变得很有钱 我会想尽一切办法倒流时间',
    '不是为了人类理想做贡献 只是想和她说一句我很抱歉',
  ],
  tableData: [
    {
      a1: 'link',
      a2: '点击通知栏时的跳转链接',
      a3: 'string',
      a4: '',
      a5: '',
    },
    {
      a1: 'text',
      a2: '通知文本内容，scrollable 为 false 时生效',
      a3: 'string',
      a4: '',
      a5: '',
    },
    {
      a1: 'color',
      a2: '通知文本颜色',
      a3: 'string',
      a4: '',
      a5: '#e6a23c',
    },
    {
      a1: 'background',
      a2: '通知背景色',
      a3: 'string',
      a4: '',
      a5: '#fdf6ec',
    },
    {
      a1: 'size',
      a2: '字体大小，单位px',
      a3: 'number / string',
      a4: '',
      a5: '14',
    },
    {
      a1: 'height',
      a2: '通知栏高度，单位px',
      a3: 'number / string',
      a4: '',
      a5: '40',
    },
    {
      a1: 'delay',
      a2: '动画延迟时间 (s)',
      a3: 'number / string',
      a4: '',
      a5: '1',
    },
    {
      a1: 'speed',
      a2: '滚动速率 (px/s)',
      a3: 'number / string',
      a4: '',
      a5: '100',
    },
    {
      a1: 'scrollable',
      a2: '是否开启垂直滚动',
      a3: 'boolean',
      a4: 'true',
      a5: 'false',
    },
    {
      a1: 'leftIcon',
      a2: '自定义左侧图标',
      a3: 'string',
      a4: '',
      a5: '',
    },
    // {
    //   a1: 'rightIcon',
    //   a2: '自定义右侧图标',
    //   a3: 'string',
    //   a4: '',
    //   a5: '',
    // },
  ],
  // tableData1: [
  //   {
  //     a1: 'close',
  //     a2: '通知栏模式（mode）closeable 时回调事件',
  //     a3: 'function',
  //     a4: '',
  //   },
  //   {
  //     a1: 'link',
  //     a2: '通知栏模式（mode）link 时回调事件',
  //     a3: 'function',
  //     a4: '',
  //   },
  // ],
})
</script>
