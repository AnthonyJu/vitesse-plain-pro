import { useDebounceFn, useElementSize, watchOnce } from '@vueuse/core'
import { defineComponent, ref } from 'vue'
import './index.scss'

const EllipsisText = defineComponent({
  name: 'EllipsisText',
  props: {
    text: {
      type: String,
      required: true,
    },
    lineClamp: {
      type: Number,
      required: true,
    },
    lineHeight: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const initHeight = props.lineHeight * props.lineClamp!
    const textHeight = ref('auto')

    const ellipsis = ref(true)
    const isEllipsis = ref(false)
    const showOpen = ref(true)

    const handleClick = () => {
      showOpen.value = !showOpen.value
      isEllipsis.value = !isEllipsis.value
      textHeight.value = showOpen.value ? `${initHeight}px` : 'auto'
    }

    const contentRef = ref<HTMLElement | null>(null)
    const { height } = useElementSize(contentRef)

    watchOnce(height, setHeight)

    function setHeight() {
      if (height.value > initHeight) {
        ellipsis.value = true
        isEllipsis.value = true
        textHeight.value = showOpen.value ? `${initHeight}px` : 'auto'
      }
      else {
        ellipsis.value = false
        showOpen.value = false
        textHeight.value = 'auto'
      }
    }

    return () => (
      <div ref={contentRef} class="ellipsis-text-container">
        <div
          class={{
            text: true,
            active: isEllipsis.value,
          }}
          style={{
            height: textHeight.value,
            lineHeight: `${props.lineHeight}px`,
            WebkitLineClamp: props.lineClamp,
          }}
        >
          {ellipsis.value && (
            <span class="btn" onClick={handleClick}>
              {showOpen.value ? '展开' : '收起'}
            </span>
          )}
          {props.text}
        </div>
      </div>
    )
  },
})

export default defineComponent({
  name: 'TextEllipsis',
  props: {
    text: {
      type: String,
      default: '',
    },
    lineClamp: {
      type: Number,
      default: 2,
    },
    lineHeight: {
      type: Number,
      default: 22,
    },
  },
  setup(props) {
    const key = ref(0)

    const debouncedFn = useDebounceFn(() => {
      key.value++
    }, 1000)

    // 宽度变化时重新计算
    onMounted(() => {
      window.addEventListener('resize', debouncedFn, false)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', debouncedFn)
    })

    return () => (
      <EllipsisText
        key={key.value}
        text={props.text}
        lineClamp={props.lineClamp}
        lineHeight={props.lineHeight}
      />
    )
  },
})
