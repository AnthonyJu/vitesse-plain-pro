export const useThemeStore = defineStore(
  'theme',
  () => {
    const { width } = useWindowSize()

    // 侧边栏菜单
    const menu = ref({
      aside: true,
      collapse: false,
      drawer: false,
    })

    watch(width, (w) => {
      if (w >= 1440) {
        menu.value = {
          aside: true,
          drawer: false,
          collapse: false,
        }
      }
      else if (w >= 1024) {
        menu.value = {
          aside: false,
          drawer: false,
          collapse: false,
        }
      }
      else {
        menu.value = {
          aside: true,
          drawer: true,
          collapse: false,
        }
      }
    }, {
      immediate: true,
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
    persist: true,
  },
)

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
