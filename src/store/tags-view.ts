import type { RouteLocationNormalizedLoadedTyped } from 'vue-router'

export const useTagsViewStore = defineStore('tags-view', () => {
  // 所有标签
  const allTags = ref<RouteItem[]>([])

  // 缓存组件名称
  const keepAliveNames = computed(() => {
    return allTags.value.filter(item => item.meta.isKeepAlive).map(item => item.keepAliveName!)
  })

  // 当前激活的标签
  const activeTag = ref<RouteItem | null>(null)

  // component 组件key，用于刷新组件
  const componentKey = ref('')
  // 暂时取消缓存的组件名称，利用exclude优先级高于include的特性，进行刷新
  const excludeKeepAliveNames = ref<string[]>([])

  // 添加固定标签
  function addAffixTag(tag: RouteItem) {
    // 防止刷新重复添加
    if (allTags.value.some(item => item.fullPath === tag.path)) return
    allTags.value.push({
      ...tag,
      name: tag.path,
      fullPath: tag.path,
      keepAliveName: tag.path,
    })
  }

  // 添加标签
  function addTag(route: RouteLocationNormalizedLoadedTyped<any, any>) {
    if (allTags.value.every(tag => tag.fullPath !== route.fullPath)) {
      // query中的tag-name作为标签拼接名称
      const tagTitle = route.query[QUERY_TAG_NAME]
      const title = tagTitle ? `${route.meta.title}-${tagTitle}` : route.meta.title

      // params中的id作为组件keepAliveName拼接
      const tag = {
        keepAliveName: route.params.id ? `${route.name}_${route.params.id}` : route.name,
        name: route.name,
        path: route.path,
        fullPath: route.fullPath,
        meta: { ...route.meta, title },
      }

      // 非多开标签，需要特殊处理，只保留一个
      if (!route.meta.isOpenMore) {
        const index = allTags.value.findIndex(tag => tag.name === route.name)
        if (index !== -1) {
          allTags.value[index] = tag
          return
        }
      }

      // 添加标签
      allTags.value.push(tag)
    }

    // 设置激活标签
    const acTag = allTags.value.find(tag => tag.fullPath === route.fullPath)
    setActiveTag(acTag!)
  }

  // 设置激活标签
  function setActiveTag(tag: RouteItem) {
    activeTag.value = tag
    componentKey.value = decodeURI(tag.fullPath!)
  }

  const router = useRouter()
  // 删除标签
  function closeTag(fullPath: string) {
    const index = allTags.value.findIndex(tag => tag.fullPath === fullPath)
    allTags.value = allTags.value.filter(tag => tag.fullPath !== fullPath)

    // 删除的是当前激活的，跳转到下一个
    if (fullPath === activeTag.value?.fullPath) {
      const nextPath = allTags.value[index + 1]?.fullPath || allTags.value[index - 1]?.fullPath
      router.push(nextPath || '/')
    }
  }

  // 刷新标签
  function refreshTag() {
    componentKey.value = 'componentKey'
    excludeKeepAliveNames.value = [activeTag.value!.keepAliveName!]
    // 等待刷新后，清空
    nextTick(() => {
      excludeKeepAliveNames.value = []
      componentKey.value = decodeURI(activeTag.value!.fullPath!)
    })
  }

  // 关闭右侧
  function closeRightTags(fullPath: string) {
    // 保留固定标签
    const index = allTags.value.findIndex(tag => tag.fullPath === fullPath)
    allTags.value = allTags.value.filter((tag, i) => tag.meta.isAffix || i <= index)
    // 如果当前激活的标签在右侧，则跳转到当前右键标签
    if (!allTags.value.includes(activeTag.value!)) router.push(fullPath)
  }

  // 关闭其他
  function closeOtherTags(fullPath: string) {
    // 保留固定标签
    allTags.value = allTags.value.filter(tag => tag.meta.isAffix || tag.fullPath === fullPath)
    router.push(fullPath)
  }

  // 关闭所有
  function closeAllTags() {
    // 保留固定标签
    allTags.value = allTags.value.filter(tag => tag.meta.isAffix)
    router.push('/')
  }

  return {
    allTags,
    keepAliveNames,
    componentKey,
    excludeKeepAliveNames,
    addAffixTag,
    addTag,
    closeTag,
    refreshTag,
    closeAllTags,
    closeOtherTags,
    closeRightTags,
  }
}, {
  persist: {
    storage: window.sessionStorage,
  },
})
