import type { Plugin } from 'vite'
import path from 'node:path'
import { compileScript, parse } from '@vue/compiler-sfc'
import MagicString from 'magic-string'

// 生成组件名称，最终路由名称将会与组件名称同步
export function generateComponentName(): Plugin {
  return {
    name: 'vite:generate-component-name',
    enforce: 'pre',
    async transform(code, id) {
      if (!/\.vue$/.test(id)) return null
      return generateName.call(this, code, id)
    },
  }
}

function generateName(code: string, id: string) {
  const magicString = new MagicString(code)
  const { descriptor } = parse(code)
  const filename = /.*\/(\S*)/.exec(id)![1]

  if (descriptor.scriptSetup && !descriptor.script) {
    // 获取 scriptSetup 的 attrs 属性
    const { attrs } = compileScript(descriptor, { id })
    const { name, lang } = attrs

    // 将路由名称同步到 .vue 文件的 script 标签中, 遵循 vue-router 的路由规则
    if (/\/src\/pages\/(?!.*\/components\/).*\.vue$/.test(id)) {
      // 获取路由名称，遵循 vue-router 的路由规则
      let routeName = /\/src\/pages(\/.+)\.vue$/.exec(id)![1]

      // 如果是 index.vue 文件，则去掉 'index'
      if (routeName.endsWith('index')) routeName = routeName.slice(0, -5)

      // 给 script 标签添加 name 属性
      magicString.appendLeft(
        0,
        `<script ${lang ? `lang="${lang}"` : ''}>
          import { defineComponent } from 'vue'
          export default defineComponent({
            name: "${routeName}"
          })
        </script>\n`,
      )
    }
    // 除了路由 vue 文件外，将其他 vue 文件的文件名作为组件名
    else {
      let componentName: string
      if (name) componentName = name as string
      else if (filename === 'index.vue')componentName = `${path.basename(path.dirname(id))}-index`
      else componentName = filename.split('.')[0]

      magicString.appendLeft(
        0,
        `<script ${lang ? `lang="${lang}"` : ''}>
          import { defineComponent } from 'vue'
          export default defineComponent({
            name: "${componentName}"
          })
        </script>\n`,
      )
    }

    const map = magicString.generateMap({ hires: true })

    map.file = filename
    map.sources = [filename]

    return {
      map,
      code: magicString.toString(),
    }
  }
  return null
}
