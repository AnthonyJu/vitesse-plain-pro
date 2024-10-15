/**
 * @description: 路由模块
 * @param {string} title 菜单栏及 tagsView 栏、菜单搜索名称
 * @param {string} icon 菜单、tagsView 图标
 * @param {boolean} isDynamic 是否为动态路由
 * @param {string[]} roles 当前路由权限标识，由前端控制时可用
 * @param {boolean} isHide 是否在菜单中隐藏此路由
 * @param {boolean} isKeepAlive 是否缓存组件状态
 * @param {boolean} isOpenMore // 是否可以多开，用于详情页等
 * @param {boolean} isAffix 是否固定在 tagsView 栏上
 * @param {boolean} isLeaf 是否为叶子节点，面包屑导航使用
 * @param {boolean} noRedirect 当有子路由时，不重定向第一个子路由(动态添加路由时会默认重定向第一个子路由)
 */
interface Meta {
  title?: string
  icon?: string
  isDynamic?: boolean
  roles?: string[]
  isHide?: boolean
  isKeepAlive?: boolean
  isOpenMore?: boolean
  isAffix?: boolean
  isLeaf?: boolean
  noRedirect?: boolean
}

interface RouteItem {
  path: string
  meta: Meta
  name?: string
  keepAliveName?: string
  fullPath?: string
  children?: RouteItem[]
}
