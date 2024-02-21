export function generateForm(data: JFormItem[]) {
  return data.reduce(
    (form, item) => {
      form[item.prop] = item.defaultValue || (item.type === 'dateTime' ? ['', ''] : '')
      return form
    },
    {} as any,
  )
}
