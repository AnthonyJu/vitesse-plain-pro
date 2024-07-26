import { router } from '@/modules/router'

export const useCommonStore = defineStore(
  'common',
  () => {
    // 是否加载完毕
    const loading = ref(false)

    const menuStore = useMenuStore()

    // 加载登录后需要请求的数据以及通用数据
    function loadCommonData() {
      loading.value = true
      Promise.allSettled(
        [
          menuStore.getMenu(),
        // ...其他请求
        ],
      )
        .finally(() => {
          loading.value = false
          router.replace('/home')
        })
    }

    return {
      loading,
      loadCommonData,
    }
  },
  {
    persist: {
      storage: sessionStorage,
    },
  },
)
