import type { RouteLocationNormalizedLoadedTyped } from 'vue-router'

export const useTagsViewStore = defineStore('tags-view', () => {
  // 所有标签
  const allTags = ref<RouteItem[]>([])

  // 缓存组件名称
  const keepAliveNames = computed(() => {
    return allTags.value.filter(item => item.meta.isKeepAlive).map(item => item.keepAliveName!)
  })

  // 添加固定标签
  function addAffixTag(tag: RouteItem) {
    allTags.value.push({
      ...tag,
      name: tag.path,
      fullPath: tag.path,
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
        // 找到name相同的标签，将改项替换
        const index = allTags.value.findIndex(tag => tag.name === route.name)

        if (index !== -1) {
          allTags.value[index] = tag
          return
        }
      }

      // 添加标签
      allTags.value.push(tag)
    }
  }

  return {
    allTags,
    keepAliveNames,
    addAffixTag,
    addTag,
  }
})
