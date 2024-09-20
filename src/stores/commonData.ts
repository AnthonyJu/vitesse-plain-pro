import { router } from '@/modules/router'

export const useCommonDataStore = defineStore(
  'commonData',
  () => {
    // 是否加载完毕
    const loading = ref(false)
    // 是否加载失败
    const isFail = ref(false)

    const route = useRoute()
    const menuStore = useMenuStore()

    // 加载登录后需要请求的数据以及通用数据
    function loadCommonData() {
      loading.value = true
      isFail.value = false

      Promise.allSettled(
        [
          menuStore.getMenu(),
          // ...其他请求
        ],
      )
        .then(() => {
          isFail.value = false
          // 如果有重定向，则跳转到重定向页面
          if (route.query.redirect) router.replace(route.query.redirect as string)
          // 否则默认跳转到首页
          else router.replace('/home')
        })
        .catch(() => {
          isFail.value = true
        })
        .finally(() => {
          loading.value = false
        })
    }

    return {
      loading,
      isFail,
      loadCommonData,
    }
  },
  {
    persist: {
      storage: sessionStorage,
    },
  },
)
