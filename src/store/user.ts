import { authLogin } from '@/api/login'
import { router } from '@/modules/router'

export const useUserStore = defineStore(
  'user',
  () => {
    const route = useRoute()
    const commonDataStore = useCommonDataStore()

    const isLogin = ref(false)
    const userInfo = ref<UserInfo>()

    async function handleLogin(data: LoginInfo) {
      await authLogin(data).then(async (res) => {
        isLogin.value = true
        userInfo.value = res.data
        await router.replace(route.query.redirect as string || '/')
      })
    }

    function handleLogout() {
      return new Promise((resolve, reject) => {
        try {
          commonDataStore.loading = true

          isLogin.value = false
          userInfo.value = undefined

          Session.clear()
          window.location.reload()

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
