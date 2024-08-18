import { authLogin } from '@/api/login'
import { router } from '@/modules/router'

export const useUserStore = defineStore(
  'user',
  () => {
    const route = useRoute()
    const menuStore = useMenuStore()

    const isLogin = ref(false)
    const userInfo = ref<UserInfo>()

    function handleLogin(data: LoginInfo) {
      return authLogin(data).then(async (res) => {
        isLogin.value = true
        userInfo.value = res.data
        router.replace(`/loading${route.query.redirect ? `?redirect=${route.query.redirect}` : ''}`)
      })
    }

    function handleLogout() {
      return new Promise((resolve, reject) => {
        try {
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
