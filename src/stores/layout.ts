export const useLayoutStore = defineStore(
  'layout',
  () => {
    // const { width } = useWindowSize()
    // const isSmallScreen = computed(() => width.value <= 1000)

    // 侧边栏菜单
    const menu = ref({
      aside: true,
      collapse: true,
    })

    // 顶部栏
    const header = ref({
      // show: true,
      // fixed: true,
      height: 60,
    })

    // 标签页
    const tagsview = ref({
      height: 40,
      show: true,
      fixed: true,
      max: 10,
      KeepAlive: true,
    })

    // 底部栏
    const footer = ref({
      show: true,
      fixed: true,
      height: 30,
    })

    // 主内容区域高度
    const mainHeight = computed(() => {
      if (footer.value.fixed) {
        const tagsViewHeight = tagsview.value.show ? tagsview.value.height : 0
        const footerHeight = footer.value.show ? footer.value.height : 0
        return `calc(100vh - ${header.value.height + tagsViewHeight + footerHeight}px)`
      }
      else {
        return 'auto'
      }
    })

    return {
      menu,
      header,
      tagsview,
      footer,
      mainHeight,
    }
  },
  {
    persist: {
      storage: localStorage,
    },
  },
)

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
