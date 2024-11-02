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
  rules: [
    [
      /^shadow-(\D+)$/,
      ([, type]) => {
        const color = '2px var(--el-border-color)'
        switch (type) {
          case 'b':
            return { 'box-shadow': `0px 1px ${color}` }
          case 'r':
            return { 'box-shadow': `1px 0px ${color}` }
          case 't':
            return { 'box-shadow': `0px -1px ${color}` }
          case 'l':
            return { 'box-shadow': `-1px 0px ${color}` }
        }
      },
    ],
    [
      // eslint-disable-next-line regexp/no-misleading-capturing-group,regexp/no-super-linear-backtracking
      /^bd-(\d+)(\D+)-(\S+)$/,
      ([, width, unit, color]) => {
        return {
          border: `${width + unit} solid ${color}`,
        }
      },
    ],
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
    'layout-default': 'bg-default p-15px rounded-4px',
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
