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
