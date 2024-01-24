import ElementPlus from 'unplugin-element-plus/vite'

// https://github.com/element-plus/unplugin-element-plus
export function elementPlus() {
  return ElementPlus({
    useSource: true,
  })
}
