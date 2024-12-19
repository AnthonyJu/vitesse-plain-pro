export function useElTableScroll(id: string, options = { immediate: true, speed: 1, delay: 3000 }) {
  let direction = 1 // 滚动方向
  let isMouseOut = true // 是否可滚动, 鼠标移入移出控制
  let animationFrameId: number | null = null // 动画帧
  let scrollWrap: HTMLDivElement | null = null // 滚动容器

  // 开始滚动
  function startScroll() {
    // 滚动动画
    function animate() {
      if (scrollWrap && isMouseOut && scrollWrap.clientHeight && scrollWrap.scrollHeight) {
        // 设置滚动
        scrollWrap.scrollTop += direction * options.speed
        // 当前滚动高度
        const scrollHeight = scrollWrap.clientHeight + scrollWrap.scrollTop

        // 到达底部，改变方向
        if (scrollHeight >= scrollWrap.scrollHeight) {
          scrollWrap.scrollTop = scrollWrap.scrollHeight
          setTimeout(() => {
            direction = -1
          }, options.delay)
        }
        // 到达顶部，改变方向
        else if (scrollWrap.scrollTop <= 0) {
          setTimeout(() => {
            direction = 1
          }, options.delay)
        }
      }
      animationFrameId = requestAnimationFrame(animate)
    }
    animationFrameId = requestAnimationFrame(animate)
  }

  onMounted(() => {
    // 获取滚动容器
    scrollWrap = document.getElementById(id)!.querySelector('.el-scrollbar__wrap') as HTMLDivElement

    // 开始滚动
    if (options.immediate) setTimeout(startScroll, options.delay)

    // 鼠标移入移出事件，控制滚动
    scrollWrap.addEventListener('mouseover', () => {
      isMouseOut = false
    })
    scrollWrap.addEventListener('mouseout', () => {
      isMouseOut = true
    })
  })

  onUnmounted(() => {
    // 取消动画
    if (animationFrameId) cancelAnimationFrame(animationFrameId)
  })

  return {
    startScroll,
  }
}
