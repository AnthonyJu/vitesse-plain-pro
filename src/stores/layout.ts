export const useLayoutStore = defineStore(
  'layout',
  () => {
    const header = ref({
      // show: true,
      // fixed: true,
      height: 60,
    })

    const tagsview = ref({
      height: 40,
      show: true,
      fixed: true,
      max: 10,
      KeepAlive: true,
    })
    const footer = ref({
      show: true,
      fixed: true,
      height: 30,
    })

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
