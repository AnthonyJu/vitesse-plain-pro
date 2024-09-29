interface RouteMeta {
  title?: string // 菜单栏及 tagsView 栏、菜单搜索名称
  icon?: string // 菜单、tagsView 图标
  isDynamic?: boolean // 是否为动态路由
  roles?: string[] // 当前路由权限标识，由前端控制时可用
  isHide?: boolean // 是否在菜单中隐藏此路由
  isDestroy?: boolean // 是否不缓存组件状态，切换时销毁组件
  isAffix?: boolean // 是否固定在 tagsView 栏上
  isLeaf?: boolean // 是否为叶子节点，面包屑导航使用
}

export interface RouteItem {
  path: string
  meta: RouteMeta
  children?: RouteItem[]
}

// 静态路由
export const staticRoutes = ['/', '/login', '/401', '/:all(.*)']

// 与后端约定好，后端返回的数据结构与此一致，并保持与系统菜单栏一致
export const routes: RouteItem[] = [
  {
    path: '/home',
    meta: {
      title: '首页',
      icon: 'carbon-home',
    },
  },
  {
    path: '/regexps',
    meta: {
      title: '正则合集',
      icon: 'carbon-test-tool',
    },
  },
  {
    path: '/unity-in-web',
    meta: {
      title: 'Unity 交互',
      icon: 'carbon-3d-mpr-toggle',
    },
  },
  {
    path: '/i18n',
    meta: {
      title: 'i18n 国际化',
      icon: 'carbon-ibm-watson-language-translator',
    },
  },
  {
    path: '/menu',
    meta: {
      title: '菜单权限',
      icon: 'carbon-menu',
    },
    children: [
      {
        path: '/menu/menu-0',
        meta: {
          title: '路由参数',
          isLeaf: true,
        },
        children: [
          {
            path: '/menu/menu-0/:id',
            meta: {
              title: '动态路由',
              isHide: true,
              isDynamic: true,
            },
          },
          {
            path: '/menu/menu-0/detail',
            meta: {
              title: '普通路由',
              isHide: true,
            },
          },
        ],
      },
      {
        path: '/menu/menu-1',
        meta: {
          title: 'Admin 权限',
          roles: ['admin'],
        },
      },
      {
        path: '/menu/menu-2',
        meta: {
          title: 'User 权限',
          roles: ['user'],
        },
      },
      {
        path: '/menu/menu-3',
        meta: {
          title: '多级菜单',
        },
        children: [
          {
            path: '/menu/menu-3/menu-3-1',
            meta: {
              title: '子菜单',
            },
          },
        ],
      },
    ],
  },
  {
    path: '/j-components',
    meta: {
      title: 'J 组件',
      icon: 'carbon-dicom-overlay',
    },
    children: [
      {
        path: '/j-components/j-dialog-demo',
        meta: {
          title: 'JDialog',
        },
      },
      {
        path: '/j-components/j-form-demo',
        meta: {
          title: 'JForm',
        },
      },
      {
        path: '/j-components/j-list-demo',
        meta: {
          title: 'JList',
        },
      },
      {
        path: '/j-components/j-pagination-demo',
        meta: {
          title: 'JPagination',
        },
      },
      {
        path: '/j-components/j-table-demo',
        meta: {
          title: 'JTable',
        },
      },
      {
        path: '/j-components/j-table-pro-demo',
        meta: {
          title: 'JTablePro',
        },
      },
    ],
  },
  {
    path: '/comp',
    meta: {
      title: '组件封装',
      icon: 'carbon-cics-system-group',
    },
    children: [
      {
        path: '/comp/code-blocks',
        meta: {
          title: '代码高亮块',
        },
      },
      {
        path: '/comp/notice-bars',
        meta: {
          title: '滚动通知栏',
        },
      },
    ],
  },
  {
    path: '/feat',
    meta: {
      title: '功能示例',
      icon: 'carbon-layers',
    },
    children: [
      {
        path: '/feat/charts-roll',
        meta: {
          title: '无限滚动',
        },
      },
      {
        path: '/feat/count-up',
        meta: {
          title: '数字滚动',
        },
      },
      {
        path: '/feat/cropper-js',
        meta: {
          title: '图片剪裁',
        },
      },
      {
        path: '/feat/drag-layout',
        meta: {
          title: '拖拽布局',
        },
      },
      {
        path: '/feat/import-and-export',
        meta: {
          title: '常用功能',
        },
      },
      {
        path: '/feat/konva-canvas',
        meta: {
          title: 'Konva 画布',
        },
      },
      {
        path: '/feat/music-player',
        meta: {
          title: '音频播放器',
        },
      },
      {
        path: '/feat/print-js',
        meta: {
          title: '打印',
        },
      },
      {
        path: '/feat/qrcode',
        meta: {
          title: '二维码',
        },
      },
      {
        path: '/feat/syntax-highlighter',
        meta: {
          title: '语法高亮',
        },
      },
      {
        path: '/feat/tour',
        meta: {
          title: '漫游式引导',
        },
      },
    ],
  },
  {
    path: '/arcgis',
    meta: {
      title: 'ArcGIS',
      icon: 'carbon-map',
    },
    children: [
      {
        path: '/arcgis/1_create-map',
        meta: {
          title: '创建地图',
        },
      },
      {
        path: '/arcgis/2_costom-popup',
        meta: {
          title: '自定义弹窗',
        },
      },
      {
        path: '/arcgis/3_draw-arc-by-circle',
        meta: {
          title: '通过 Circle 绘制圆弧',
        },
      },
      {
        path: '/arcgis/4_draw-arc-custom',
        meta: {
          title: '自定义方法 绘制圆弧',
        },
      },
      {
        path: '/arcgis/5_feature-reduction',
        meta: {
          title: '特征缩减（点聚合）',
        },
      },
    ],
  },
  {
    path: '/vue-echarts',
    meta: {
      title: 'Vue-ECharts',
      icon: 'carbon-chart-multitype',
    },
    children: [
      {
        path: '/vue-echarts/pie-chart',
        meta: {
          title: 'Basic usage',
        },
      },
      {
        path: '/vue-echarts/water-liquid-fill',
        meta: {
          title: 'Water liquid fill',
        },
      },
      {
        path: '/vue-echarts/word-cloud-chart',
        meta: {
          title: 'WordCloud Chart',
        },
      },
    ],
  },
]

// 扁平化路由
export const flatRoutes = getFlatRoutes()

// 获取扁平化路由
function getFlatRoutes(_routes = routes): RouteItem[] {
  const result: RouteItem[] = []
  _routes.forEach((route) => {
    result.push(route)
    if (route.children) {
      result.push(...getFlatRoutes(route.children))
    }
  })
  return result
}
