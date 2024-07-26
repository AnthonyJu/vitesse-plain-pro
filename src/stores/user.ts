import { authLogin } from '@/api/login'
import { router } from '@/modules/router'

export const useUserStore = defineStore(
  'user',
  () => {
    const isLogin = ref(false)
    const userInfo = ref<UserInfo>()

    const menuStore = useMenuStore()

    function handleLogin(data: LoginInfo) {
      return authLogin(data).then(async (res) => {
        isLogin.value = true
        userInfo.value = res.data
        await menuStore.getMenu()
        router.replace('/')
      })
    }

    function handleLogout() {
      return new Promise((resolve, reject) => {
        try {
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
