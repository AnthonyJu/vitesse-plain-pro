import type { App } from 'vue'

/**
 * 用户权限指令
 * @directive 权限验证（v-auth="xxx"）
 */
export function authDirective(app: App) {
  // 单个权限验证（v-auth="xxx"）
  app.directive('auth', {
    mounted(el, binding) {
      const menuStore = useMenuStore()
      if (!menuStore.buttons.includes(binding.value)) el.parentNode.removeChild(el)
    },
  })
}
