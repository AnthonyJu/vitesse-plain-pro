import { saveAs } from 'file-saver'
import * as XLSX from 'xlsx'

interface TreeItem {
  id?: number
  parentId?: string
  [key: string]: any
  children?: TreeItem[]
}

/**
 * 包含parentId的数组转成树形结构数组
 * @param data 原始数据数组
 * @param idName ID属性名称, 默认为id
 * @param parentIdName 父ID属性名称, 默认为parentId
 * @returns 树形结构数组
 */
export function listToTree(data: TreeItem[], idName = 'id', parentIdName = 'parentId') {
  // * 先生成parent建立父子关系
  const obj: TreeItem = {}
  data.forEach((item) => {
    obj[item[idName]] = item
  })

  const parentList: any[] = []
  data.forEach((item) => {
    const parent = obj[item[parentIdName]]
    if (parent) {
      // * 当前项有父节点
      parent.children = parent.children || []
      parent.children.push(item)
    }
    else {
      // * 当前项没有父节点 -> 顶层
      parentList.push(item)
    }
  })
  return parentList
}

/**
 * 扁平化树形结构数据
 * @param arr 要进行扁平化的数据
 * @param key 子节点的key
 * @returns 扁平化后的数据
 */
export function flatArr<T extends { [key: string]: any }>(arr: T[], key = 'children'): T[] {
  const result: T[] = []
  const _arr = JSON.parse(JSON.stringify(arr)) as T[]
  _arr.forEach((item) => {
    if (item[key]?.length) {
      const child = item[key]
      result.push(...flatArr(child as T[], key))
    }
    delete item[key]
    result.push(item)
  })
  return result
}

/**
 * JSON数据导出为Excel
 * @param data 数据
 * @param fileName 导出文件名称
 */
export function jsonToXlsx(data: Record<string, string | number>[], fileName: string) {
  // 将 data 数组转换为一个 Excel 工作表（worksheet）
  const worksheet = XLSX.utils.json_to_sheet(data)

  // 创建一个新的 Excel 工作簿（workbook）
  const workbook = XLSX.utils.book_new()

  // 将工作表添加到工作簿，并命名为 'Sheet1'
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  // 将工作簿转换为一个二进制字符串
  const workbookStr = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' })

  // Buffer 类是用于处理二进制数据的类，它是 Node.js 的一个全局类。
  const buffer = new ArrayBuffer(workbookStr.length)
  const view = new Uint8Array(buffer)

  // 将二进制字符串转换为二进制数组,0xFF是16进制的255
  for (let i = 0; i < workbookStr.length; i++) {
    view[i] = workbookStr.charCodeAt(i) & 0xFF
  }
  saveAs(new Blob([buffer], { type: 'application/octet-stream' }), fileName)
}

/**
 * 保存文件到本地
 * @param url 文件地址
 * @param fileName 文件名称,需要带后缀,默认取url最后一段
 */
export async function saveFile(url: string, fileName?: string) {
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    saveAs(blob, fileName || url.split('/').pop())
  }
  catch (error) {
    console.error(error)
  }
}
