export const useCommonDataStore = defineStore(
  'commonData',
  () => {
    // 是否加载完毕
    const loading = ref(false)
    // 是否加载失败
    const isFail = ref(false)

    // 加载登录后需要请求的数据以及通用数据
    function loadCommonData() {
      loading.value = true
      isFail.value = false

      Promise.allSettled(
        [
          useMenuStore().getMenu(),
          // ...其他请求
        ],
      )
        .then(() => {
          isFail.value = false
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
