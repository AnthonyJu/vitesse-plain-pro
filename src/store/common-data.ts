export const useCommonDataStore = defineStore(
  'common-data',
  () => {
    // 是否加载完毕
    const loading = ref(false)
    // 是否加载失败
    const isFail = ref(false)

    // 路由挂载后，隐藏加载中
    const router = useRouter()
    const afterEach = ref(false)
    router.beforeEach(() => {
      afterEach.value = false
    })
    router.afterEach((to) => {
      if (to.path !== '/login') {
        afterEach.value = true
        loading.value = false
      }
    })

    // 加载登录后需要请求的数据以及通用数据
    async function loadCommonData() {
      loading.value = true
      isFail.value = false

      const menuStore = useMenuStore()

      await Promise.all([
        menuStore.getMenu(),
        testReq(),
      ])
        .then(() => {
          if (afterEach.value) loading.value = false
        })
        .catch(() => {
          isFail.value = true
          loading.value = false
        })
    }

    // 进入系统
    function enterSystem() {
      isFail.value = false
    }

    function testReq() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('test')
        }, 1000)
      })
    }

    return {
      loading,
      isFail,
      loadCommonData,
      enterSystem,
    }
  },
  {
    persist: {
      storage: sessionStorage,
    },
  },
)
