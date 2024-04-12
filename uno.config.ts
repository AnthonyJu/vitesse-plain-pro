import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: {
    'full': 'w-full h-full',
    'flex-col': 'flex flex-col',
    'flex-items': 'flex items-center',
    'flex-b-c': 'flex justify-between items-center',
    'flex-center': 'flex justify-center items-center',
    'flex-col-center': 'flex flex-col justify-center items-center',
    'turn-dark': 'invert-93 hue-rotate-180',
    'bg-default': 'bg-$el-layout-bg-color dark:bg-$el-layout-bg-color-dark',
  },
  presets: [
    // 启用 uno 预设
    presetUno(),
    // 启用 属性 预设
    presetAttributify(),
    // 启用 icons 预设
    presetIcons({
      scale: 1.2,
      warn: true,
      cdn: 'https://esm.sh/',
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
