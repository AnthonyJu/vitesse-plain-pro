<template>
  <div ref="scrollbar" class="scrollbar full overflow-auto">
    <slot />
    <div
      class="fixed right-4.5px h-full w-6px"
      :style="{ height: verticalHeight, top: verticalTop }"
    >
      <div
        class="relative rounded-6px bg-light bg-opacity-80"
        :style="{ height: thumbHeight, top: thumbTop }"
      />
    </div>
  </div>
</template>

<script setup lang='ts'>
const scrollbar = ref<HTMLElement>()

const verticalTop = ref('0px')
const verticalHeight = ref('0px')
const thumbTop = ref('0px')
const thumbHeight = ref('0px')

const route = useRoute()

watchPostEffect(() => {
  if (route.path) {
    // TODO 延时
    setTimeout(() => {
      const { clientHeight, scrollHeight, scrollTop, offsetTop, offsetHeight } = scrollbar.value

      verticalTop.value = `${offsetTop}px`
      verticalHeight.value = `${offsetHeight}px`

      thumbTop.value = `${scrollTop}px`
      thumbHeight.value = `${(clientHeight / scrollHeight) * clientHeight}px`
    }, 600)
  }
})

function onScroll() {
  // TODO 滚动
  // eslint-disable-next-line no-console
  console.log('onScroll')
}

// TODO 鼠标移入移出

onMounted(() => {
  scrollbar.value.addEventListener('scroll', onScroll)
})

onUnmounted(() => {
  scrollbar.value.removeEventListener('scroll', onScroll)
})
</script>

<style lang='scss' scoped>
.scrollbar {
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
