<template>
  <div class="main-container">
    <el-card class="mt-15px" shadow="hover" header="导入数据查看控制台">
      <el-row :gutter="10" class="flex w-full">
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
          <pre>
            <code>
              function importTem() {
                const inputElement = document.createElement('input')
                inputElement.type = 'file'
                inputElement.accept = '.xlsx' // 只接受 .xlsx 文件
                inputElement.onchange = (event) => {
                  // 文件名称
                  fileName.value = event.target.files[0].name
                  const file = event.target.files[0]
                  // 检查文件类型
                  if (file.type !==
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                    ElMessage.error('请上传一个 .xlsx 文件')
                    return
                  }

                  // 在这里处理文件
                  const reader = new FileReader()

                  reader.onload = function (e) {
                    const data = new Uint8Array(e.target?.result)
                    const workbook = XLSX.read(data, { type: 'array' })
                    const sheet_name_list = workbook.SheetNames
                    const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])
                    console.log('json,导入的数据', json)
                  }
                  reader.readAsArrayBuffer(file)
                }
                inputElement.click() // 模拟点击事件，让用户选择文件
              }
            </code>
          </pre>
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
          <pre>
            <code>
              // 导出
              function exportTem() {
                const data = [
                  { name: 'John', age: 30, city: 'New York' },
                  { name: 'Jane', age: 40, city: 'Chicago' },
                ]

                // 将 data 数组转换为一个 Excel 工作表（worksheet）
                const worksheet = XLSX.utils.json_to_sheet(data)
                // 创建一个新的 Excel 工作簿（workbook）
                const workbook = XLSX.utils.book_new()
                // 将工作表添加到工作簿，并命名为 'Sheet1'
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
                // 将工作簿转换为一个二进制字符串
                const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' })
                // Buffer 类是用于处理二进制数据的类，它是 Node.js 的一个全局类。
                const buf = new ArrayBuffer(wbout.length)
                const view = new Uint8Array(buf)
                for (let i = 0; i < wbout.length; i++) view[i] = wbout.charCodeAt(i) & 0xFF
                saveAs(new Blob([buf], { type: 'application/octet-stream' }), '导出模板.xlsx')
              }
            </code>
          </pre>
        </div>
      </el-row>
    </el-card>
    <el-card class="mt-15px" shadow="hover" header="前端手写下载模板功能，参数及示例demo">
      <el-row :gutter="10" class="">
        <div>
          <p>1. pnpm install file-saver</p>
          <p>2.在页面中引入 import { saveAs } from 'file-saver'</p>
          <p>示例代码：</p>
          <pre>
            <code>
              // 模板下载
              // saveAs(blob, '消防站导入模板.xlsx') 这行代码的作用是将从服务器获取的 Blob 对象保存为一个名为 '消防站导入模板.xlsx' 的文件。
              // 具体来说，saveAs 函数接受两个参数：
              // 第一个参数是要保存的数据，可以是 Blob 对象、File 对象或者一个包含数据的字符串。
              // 第二个参数是保存的文件名。
              function downLoadTem() {
                fetch('/fireStation.xlsx')
                  .then(res => res.blob())
                  .then((blob) => {
                    saveAs(blob, '消防站导入模板.xlsx')
                  })
                  .catch()
              }
            </code>
          </pre>
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
