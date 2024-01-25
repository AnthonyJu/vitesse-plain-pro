<template>
  <div>
    <el-card class="mt-15px" shadow="hover" header="导入数据查看控制台">
      <el-row :gutter="10" class="w-full flex">
        <el-button type="primary" @click="importTem()">导入</el-button>
        <el-button type="primary" @click="exportTem(data, '导出模板.xlsx')">导出</el-button>
        <el-button
          type="primary"
          @click="downLoadTem('/fireStation.xlsx', '消防站导入模板.xlsx')"
        >
          下载模板
        </el-button>
      </el-row>
    </el-card>
    <el-card class="mt-15px" shadow="hover" header="前端手写导入功能，参数及示例demo">
      <el-row :gutter="10" class="">
        <div>
          <p>1. pnpm install xlsx</p>
          <p>2.在页面中引入 import * as XLSX from 'xlsx'</p>
          <p>示例代码：</p>
        </div>
      </el-row>
    </el-card>
    <el-card class="mt-15px" shadow="hover" header="前端手写导出功能，参数及示例demo">
      <el-row :gutter="10" class="">
        <div>
          <p>1. pnpm install xlsx</p>
          <p>2. pnpm install file-saver</p>
          <p>3.在页面中引入 import * as XLSX from 'xlsx'</p>
          <p>4.在页面中引入 import { saveAs } from 'file-saver'</p>
          <p>示例代码：</p>
        </div>
      </el-row>
    </el-card>
    <el-card class="mt-15px" shadow="hover" header="前端手写下载模板功能，参数及示例demo">
      <el-row :gutter="10" class="">
        <div>
          <p>1. pnpm install file-saver</p>
          <p>2.在页面中引入 import { saveAs } from 'file-saver'</p>
          <p>示例代码：</p>
        </div>
      </el-row>
    </el-card>
  </div>
</template>

<route lang="yaml">
  meta:
    name: 常用功能
</route>

<script setup lang='ts'>
import { downLoadTem, exportTem, importTem } from '@/utils/commonFun'

const data = [
  { name: 'John', age: 30, city: 'New York' },
  { name: 'Jane', age: 40, city: 'Chicago' },
]
</script>
