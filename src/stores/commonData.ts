export const useCommonDataStore = defineStore(
  'commonData',
  () => {
    // 是否加载完毕
    const loading = ref(false)
    // 是否加载失败
    const isFail = ref(false)

    const router = useRouter()

    // 加载登录后需要请求的数据以及通用数据
    function loadCommonData(to?: string) {
      loading.value = true
      isFail.value = false

      return Promise.all(
        [
          useMenuStore().getMenu(),
          // ...其他请求
        ],
      )
        .then(() => {
          isFail.value = false
          if (to) router.replace(to)
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
