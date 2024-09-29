<template>
  <div layout-default>
    <NoticeBar
      text="🎆🎆🎆打印插件print-js，地址：https://github.com/crabbly/Print.js，点击前往"
      right-icon="carbon:chevron-right"
      mode="link"
      @link="linkFn"
    />
    <el-card class="mt-15px" shadow="hover" header="打印页面：简单示例">
      <div id="demo1" class="mb-10px">
        这是一条需要打印的内容
      </div>
      <el-button type="primary" @click="print({ printable: 'demo1', type: 'html' })">打印</el-button>
      <code-block class="mt-15px" :code="printjsStr" lang="vue" />
    </el-card>
    <el-card class="mt-15px" shadow="hover" header="打印图片：简单示例">
      <div id="demo2" class="my-10px">
        <img class="h-150px w-150px" :src="PiniaImg" alt="logo">
      </div>
      <el-button type="primary" @click="print({ printable: PiniaImg, type: 'image' })">
        打印
      </el-button>
    </el-card>
    <el-card class="mt-15px" shadow="hover" header="打印JSON数据：简单示例">
      <!-- Hack：改用代码块高亮 -->
      <div class="my-10px">{{ someJSONdata }}</div>
      <el-button
        type="primary"
        @click="printJson"
      >
        打印
      </el-button>
    </el-card>
  </div>
</template>

<script setup lang='ts'>
import PiniaImg from '@/assets/pinia.svg'
import printJS from 'print-js'
import { printjsStr } from './data/highlight'

interface printConfiguration {
  printable: string
  type: 'pdf' | 'html' | 'image' | 'json' | 'raw-html'
  header?: string
  headerStyle?: string
  maxWidth?: number
  css?: string | string[]
  style?: string
  scanStyles?: boolean
  targetStyle?: string | string[]
  targetStyles?: string | string[]
  ignoreElements?: string[]
  properties?: string
  gridHeaderStyle?: string
  gridStyle?: string
  repeatTableHeader?: boolean
  showModal?: boolean
  modalMessage?: string
  documentTitle?: string
  base64?: boolean
}

const someJSONdata = [
  {
    name: 'John Doe',
    email: 'john@doe.com',
    phone: '111-111-1111',
  },
  {
    name: 'Barry Allen',
    email: 'barry@flash.com',
    phone: '222-222-2222',
  },
  {
    name: 'Cool Dude',
    email: 'cool@dude.com',
    phone: '333-333-3333',
  },
]

function printJson() {
  printJS({
    printable: someJSONdata,
    type: 'json',
    properties: ['name', 'email', 'phone'],
  })
}

function print(configuration?: printConfiguration) {
  printJS({
    printable: configuration?.printable,
    type: configuration?.type,
    ...configuration,
  })
}

function linkFn() {
  window.open('https://github.com/crabbly/Print.js')
}
</script>
