/**
 * 生成表单数据
 * @param data 表单项数据
 * @param keys 时间范围类型的key
 * @returns 表单数据
 */
export function generateForm(data: JFormItem[], keys = DATE_TIME_KEYS) {
  return data.reduce(
    (form, item) => {
      // 重置时间范围类型的值
      if (item.prop === ' datetimerange') {
        keys.forEach((key) => {
          form[key] = ''
        })
        return form
      }
      form[item.prop] = item.default ?? ''
      return form
    },
    {} as Record<string, any>,
  )
}

// loading
export const JLoading = defineComponent({
  setup() {
    return () => (
      <span class="h-18px! w-18px! text-18px!">
        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            stroke="currentColor"
            stroke-width="2"
            d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
            opacity=".5"
          />
          <path
            fill="currentColor"
            stroke="currentColor"
            stroke-width="2"
            d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"
          >
            <animateTransform
              attributeName="transform"
              dur="1s"
              from="0 12 12"
              repeatCount="indefinite"
              to="360 12 12"
              type="rotate"
            />
          </path>
        </svg>
      </span>
    )
  },
})
