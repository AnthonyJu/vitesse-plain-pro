import type { RouteMeta } from 'vue-router'

// 基础元信息，用于合并路由元信息
export const baseMeta: RouteMeta = {
  title: '',
  icon: '',
  isDynamic: false,
  roles: [],
  isHide: false,
  isKeepAlive: false,
  isOpenMore: false,
  isAffix: false,
  isLeaf: false,
  noRedirect: false,
}

// 静态路由
export const staticRoutes = ['/', '/login', '/401', '/:all(.*)']

// 系统菜单结构，也作为路由meta信息
export const routes: RouteItem[] = [
  {
    path: '/home',
    meta: {
      title: '首页',
      icon: 'carbon-home',
      isAffix: true,
    },
  },
  {
    path: '/regexps',
    meta: {
      title: '正则合集',
      icon: 'carbon-test-tool',
      isAffix: true,
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
          noRedirect: true,
        },
        children: [
          {
            path: '/menu/menu-0/:id',
            meta: {
              title: '动态路由',
              isHide: true,
              isDynamic: true,
              isKeepAlive: true,
              isOpenMore: true,
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
      {
        path: '/comp/upload-files',
        meta: {
          title: '上传文件',
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
