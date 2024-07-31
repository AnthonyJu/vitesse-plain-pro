import { router } from '@/modules/router'

export const useCommonDataStore = defineStore(
  'commonData',
  () => {
    // 是否加载完毕
    const loading = ref(false)

    const menuStore = useMenuStore()

    // TODO 处理失败情况
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
          // 默认跳转到首页，可根据实际情况修改
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
