import { authLogin } from '@/api/login'
import { router } from '@/modules/router'

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

    function handleLogout(reload = true) {
      return new Promise((resolve, reject) => {
        try {
          menuStore.$reset()
          isLogin.value = false
          userInfo.value = undefined
          resolve(true)
          if (reload) location.href = '/' // 保证清空路由与缓存
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
