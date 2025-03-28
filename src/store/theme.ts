export const useThemeStore = defineStore(
  'theme',
  () => {
    const { width } = useWindowSize()

    // 页面全屏
    const fullScreen = ref(false)

    // 侧边栏菜单
    const menu = ref({
      aside: true,
      collapse: false,
      drawer: false,
    })

    // 菜单宽度, 根据折叠状态设置
    const menuWidth = computed(() => menu.value.collapse ? '84px' : '220px')

    // 根据屏幕宽度设置菜单显示形式
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
    const header = ref({ height: 60 })

    // 标签页
    const tagsView = ref({
      height: 56,
      show: true,
    })

    // header实际高度 = header高度 + tagsView高度
    const headerHeight = computed(() => {
      return `${header.value.height + (tagsView.value.show ? tagsView.value.height : 0)}px`
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
        const tagsViewHeight = tagsView.value.show ? tagsView.value.height : 0
        const footerHeight = footer.value.show ? footer.value.height : 0
        return `calc(100vh - ${header.value.height + tagsViewHeight + footerHeight}px)`
      }
      else {
        return 'auto'
      }
    })

    return {
      fullScreen,
      menu,
      menuWidth,
      header,
      tagsView,
      headerHeight,
      footer,
      mainHeight,
    }
  },
)

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
