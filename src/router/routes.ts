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
export const staticRoutes = ['/login', '/401', '/:all(.*)']

// 系统菜单结构，也作为路由meta信息
export const routes: RouteItem[] = [
  {
    path: '/home',
    meta: {
      title: '首页',
      icon: 'i-carbon-home',
      isAffix: true,
    },
  },
  {
    path: '/regexps',
    meta: {
      title: '正则合集',
      icon: 'i-carbon-test-tool',
      isAffix: true,
    },
  },
  {
    path: '/unity-in-web',
    meta: {
      title: 'Unity 交互',
      icon: 'i-carbon-3d-mpr-toggle',
    },
  },
  {
    path: '/i18n',
    meta: {
      title: 'i18n 国际化',
      icon: 'i-carbon-ibm-watson-language-translator',
    },
  },
  {
    path: '/menu',
    meta: {
      title: '菜单权限',
      icon: 'i-carbon-menu',
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
      icon: 'i-carbon-dicom-overlay',
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
      icon: 'i-carbon-cics-system-group',
    },
    children: [
      {
        path: '/comp/image-comparison',
        meta: {
          title: '图片对比',
        },
      },
      {
        path: '/comp/code-block-demo',
        meta: {
          title: '代码高亮块',
        },
      },
      {
        path: '/comp/notice-bar-demo',
        meta: {
          title: '滚动通知栏',
        },
      },
      {
        path: '/comp/upload-file-demo',
        meta: {
          title: '文件切片上传（todo）',
        },
      },
      {
        path: '/comp/leafer-draw',
        meta: {
          title: 'Leafer图片标注（todo）',
        },
      },
      {
        path: '/comp/konva-draw',
        meta: {
          title: 'Konva图片标注（todo）',
        },
      },
    ],
  },
  {
    path: '/feat',
    meta: {
      title: '功能示例',
      icon: 'i-carbon-layers',
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
        path: '/feat/music-player',
        meta: {
          title: '音频播放器',
        },
      },
      {
        path: '/feat/video-player',
        meta: {
          title: '视频播放器',
        },
        children: [
          {
            path: '/feat/video-player/xg-player',
            meta: {
              title: 'XgPlayer',
            },
          },
          {
            path: '/feat/video-player/easy-player',
            meta: {
              title: 'EasyPlayer',
            },
          },
        ],
      },
      {
        path: '/feat/print-js',
        meta: {
          title: '页面打印',
        },
      },
      {
        path: '/feat/qrcode',
        meta: {
          title: '二维码生成',
        },
      },
    ],
  },
  {
    path: '/3d-scene',
    meta: {
      title: '3D 场景',
      icon: 'i-carbon-3d-cursor',
    },
    children: [
      {
        path: '/3d-scene/roam',
        meta: {
          title: '漫游',
        },
      },
      {
        path: '/3d-scene/panorama',
        meta: {
          title: '全景',
        },
      },
      {
        path: '/3d-scene/tile-panorama',
        meta: {
          title: '瓦片全景',
        },
      },
      {
        path: '/3d-scene/photo-sphere-viewer',
        meta: {
          title: '全景标注',
        },
      },
    ],
  },
  {
    path: '/cesium',
    meta: {
      title: 'Cesium',
      icon: 'i-carbon-3d-print-mesh',
    },
    children: [
      {
        path: '/cesium/basic-use',
        meta: {
          title: '基础展示',
        },
      },
      {
        path: '/cesium/load-geojson',
        meta: {
          title: '加载geojson',
        },
      },
      {
        path: '/cesium/load-model',
        meta: {
          title: '模型加载',
        },
      },
      {
        path: '/cesium/drawing-route',
        meta: {
          title: '航线绘制（todo）',
        },
      },
      {
        path: '/cesium/route-planner',
        meta: {
          title: '航线规划',
        },
      },
    ],
  },
  {
    path: '/arcgis',
    meta: {
      title: 'ArcGIS',
      icon: 'i-carbon-map',
    },
    children: [
      {
        path: '/arcgis/1_create-map',
        meta: {
          title: '创建地图',
        },
      },
      {
        path: '/arcgis/2_custom-popup',
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
      {
        path: '/arcgis/6_search-address',
        meta: {
          title: '搜索地址',
        },
      },
      {
        path: '/arcgis/7_3d_viewshed',
        meta: {
          title: '3D 可视域分析',
        },
      },
      {
        path: '/arcgis/8_camera_view',
        meta: {
          title: '相机视角控制',
        },
      },
    ],
  },
  {
    path: '/vue-echarts',
    meta: {
      title: 'Vue-ECharts',
      icon: 'i-carbon-chart-multitype',
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
