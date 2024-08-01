import { router } from '@/modules/router'

export const useCommonDataStore = defineStore(
  'commonData',
  () => {
    const route = useRoute()
    const menuStore = useMenuStore()

    // 是否加载完毕
    const loading = ref(false)

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
          // 如果有重定向，则跳转到重定向页面
          if (route.query.redirect) router.replace(route.query.redirect as string)
          // 否则默认跳转到首页
          else router.replace('/home')
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
