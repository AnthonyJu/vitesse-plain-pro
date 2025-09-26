import type { Router } from 'vue-router'
import { addRoutes } from '@/router/add-routes'
import { staticRoutes } from '@/router/routes'

// 路由守卫
export function routerBeforeEach(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()

    // 未登录，跳转到登录页面
    if (!userStore.isLogin) {
      // 未登录，去login页面，则直接进入
      if (to.path === '/login') {
        next()
      }
      // 未登录，去根路由，要跳转到登录页面
      else if (to.path === '/') {
        next('/login')
      }
      // 未登录，去非白名单页面，则跳转到登录页面
      else if (staticRoutes.includes(to.path)) {
        next('/login')
      }
      // 未登录，去非白名单页面，则跳转到登录页面
      else {
        next('/login')
      }
    }
    // 已登录，再去login页面，则还是进入当前页面
    else if (to.path === '/login') {
      next(from.path)
    }
    // 已登录，去白名单页面，则直接进入
    else if (staticRoutes.includes(to.path)) {
      next()
    }
    // 菜单权限判断
    else {
      const menuStore = useMenuStore()
      if (menuStore.menus.length === 0) {
        // 加载通用数据
        const commonDataStore = useCommonDataStore()
        await commonDataStore.loadCommonData()

        // 将有权限的路由动态添加到路由表
        addRoutes(router, menuStore.permissionPaths)

        // 无权限路径，则跳转到 401 页面
        if (menuStore.menus.length === 0) {
          next('/401')
        }
        // 防止第一次进入页面时，404 问题
        else {
          next({ path: to.path, query: to.query })
        }
      }
      else {
        next()
      }
    }
  })
}
