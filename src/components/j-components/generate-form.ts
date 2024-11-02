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
      form[item.prop] = item.default || ''
      return form
    },
    {} as Record<string, any>,
  )
}
