import type { Plugin } from 'vite'
import { compileScript, parse } from '@vue/compiler-sfc'
import MagicString from 'magic-string'

// 将路由名称同步到 .vue 文件的 script 标签中
export function routeNameAsComponentName(): Plugin {
  return {
    name: 'vite:route-name-as-component-name',
    enforce: 'pre',
    async transform(code, id) {
      // 只处理 /src/pages 目录下，并且不在 components 目录下的 .vue 文件
      if (/\/src\/pages\/(?!.*\/components\/).*\.vue$/.test(id)) {
        const magicString = new MagicString(code)
        const { descriptor } = parse(code)

        // 如果没有 script 标签，则添加一个，并且设置 name 属性
        if (!descriptor.script) {
          let lang = 'js'

          if (descriptor.scriptSetup) {
            const { attrs } = compileScript(descriptor, { id })
            lang = attrs.lang as string
          }

          // 获取路由名称，遵循 vue-router 的路由规则
          let routeName = /\/src\/pages(\/.+)\.vue$/.exec(id)![1]

          // 如果是 index.vue 文件，则去掉 '/index'
          if (routeName.endsWith('/index')) routeName = routeName.slice(0, -6)

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

          // 生成 source map
          const map = magicString.generateMap({ hires: true })
          const filename = /.*\/(\S*)/.exec(id)![1]

          map.file = filename
          map.sources = [filename]

          // 返回新的代码和 source map
          return {
            map,
            code: magicString.toString(),
          }
        }
        return null
      }
      return null
    },
  }
}
