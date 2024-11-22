import { authLogin } from '@/api/login'
import { router } from '@/modules/router'
import { addStaticRoutes } from '@/router/add-routes'

export const useUserStore = defineStore(
  'user',
  () => {
    const route = useRoute()
    const menuStore = useMenuStore()

    const isLogin = ref(false)
    const userInfo = ref<UserInfo>()

    async function handleLogin(data: LoginInfo) {
      await authLogin(data).then(async (res) => {
        isLogin.value = true
        userInfo.value = res.data
        router.replace(route.query.redirect as string || '/')
      })
    }

    function handleLogout() {
      return new Promise((resolve, reject) => {
        try {
          // 清除所有路由
          router.clearRoutes()
          // 添加静态路由
          addStaticRoutes(router)

          menuStore.$reset()
          isLogin.value = false
          userInfo.value = undefined

          router.replace('/login')

          resolve(true)
        }
        catch (error) {
          reject(error)
        }
      })
    }

    return {
      isLogin,
      userInfo,
      handleLogin,
      handleLogout,
    }
  },
  {
    persist: {
      storage: sessionStorage,
    },
  },
)

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
