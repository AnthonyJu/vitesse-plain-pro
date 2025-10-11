import { presetWind3 } from '@unocss/preset-wind3'

import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  // class 白名单 预处理
  // safelist: [],

  // class 提取
  content: {
    pipeline: {
      include: [
        // 基础
        /\.(vue|[jt]sx)($|\?)/,
        // 包括 routes.ts 文件，读取路由元信息icon
        'src/router/routes.ts',
      ],
    },
  },

  rules: [
    [
      // 使用：bd-1px-red
      // eslint-disable-next-line regexp/no-misleading-capturing-group,regexp/no-super-linear-backtracking
      /^bd-(\d+)(\D+)-(\S+)$/,
      ([, width, unit, color]) => {
        return {
          border: `${width + unit} solid ${color}`,
        }
      },
    ],
    // 使用方式：grid-fit-200px / grid-fill-150px
    [
      /^grid-(\D+)-(\d+)(\D+)$/,
      ([,type, size, unit]) => {
        return {
          'display': 'grid',
          'grid-template-columns': `repeat(auto-${type}, minmax(min(${size + unit}, 100%), 1fr))`,
        }
      },
    ],
  ],

  shortcuts: {
    'full': 'w-full h-full',
    'flex-col': 'flex flex-col',
    'flex-items': 'flex items-center',
    'flex-bc': 'flex justify-between items-center',
    'flex-center': 'flex justify-center items-center',
    'flex-col-center': 'flex flex-col justify-center items-center',
    'turn-dark': 'invert-88.8 hue-rotate-180',
    'turn-light': 'brightness-98 contrast-98',
    'bg-default': 'bg-$el-layout-bg-color dark:bg-$el-layout-bg-color-dark',
    'layout-default': 'bg-default p-15px rounded-$el-border-radius-base',
    'rounded-default': 'rounded-$el-border-radius-base',
  },

  presets: [
    // 启用 基础 预设
    presetWind3(),
    // 启用 属性 预设
    presetAttributify(),
    // 启用 icons 预设
    presetIcons({
      scale: 1.2,
      warn: true,
      // 图标的默认行为 style
      // extraProperties: {
      //   'display': 'inline-block',
      //   'vertical-align': 'middle',
      // },
      // 打包成异步 chunk，并按需加载
      collections: {
        carbon: () => import('@iconify-json/carbon/icons.json').then(i => i.default),
      },
    }),
    // 启用 排版 预设
    presetTypography(),
  ],

  transformers: [
    // 启用 @apply 功能
    transformerDirectives(),
    // 启用 () 分组功能，hover:(bg-blue-500 font-large) font-(dark 900)
    transformerVariantGroup(),
  ],
})
