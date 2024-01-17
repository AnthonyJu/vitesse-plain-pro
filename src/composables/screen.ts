const { width } = useWindowSize()
export const isSmallScreen = computed(() => width.value <= 1000)
