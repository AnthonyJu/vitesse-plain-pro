import type { DialogProps, FormItemProps, FormProps, FormRules, ISelectProps, InputProps, TableColumnCtx, TableProps } from 'element-plus'

export {}

declare global {
  /**
   * @interface Arcgis Arcgis实例
   * @property {__esri.Map} map 地图实例
   * @property {__esri.MapView} view 视图实例
   */
  interface Arcgis {
    map: __esri.Map
    view: __esri.MapView
  }

  /**
   * @interface Writable 使对象属性可写
   */
  type Writable<T> = { -readonly [P in keyof T]: T[P] }

  /**
   * @interface JFieldEvents Input与Select事件
   * @property {Function} onInput Input输入事件
   * @property {Function} onChange 值改变事件
   * @property {Function} onBlur 失焦事件
   * @property {Function} onFocus 聚焦事件
   * @property {Function} onClear 清空事件
   * @property {Function} onVisibleChange Select下拉框出现/隐藏事件
   * @property {Function} onRemoveTag Select移除tag事件
   */
  interface JFieldEvents {
    onInput?: (value: string | number) => void
    onChange?: (value: any) => void
    onBlur?: (event: FocusEvent) => void
    onFocus?: (event: FocusEvent) => void
    onClear?: () => void
    onVisibleChange?: (value: boolean) => void
    onRemoveTag?: (value: any) => void
  }

  /**
   * @interface JFormItem FormItem渲染项
   * @property {string} prop FormItem的prop
   * @property {string} type FormItem下field类型
   * @property {number} span Dialog中el-col的span
   * @property {string | number} defaultValue FormItem下field的value
   * @property {object} options Select的options选项
   * @property {FieldEvents} fieldProps FormItem下field的props与events
   */
  interface JFormItem {
    span?: number
    prop: string
    label: string
    type: 'input' | 'textarea' | 'select' | 'dateTime' | 'slot'
    defaultValue?: string | number | string[]
    formItemProps?: Partial<Writable<FormItemProps>>
    fieldProps?: Partial<Writable<InputProps>> & Partial<ISelectProps> & JFieldEvents
    options?: {
      label: string | number
      value: string | number | boolean | Record<string, any>
      disabled?: boolean
    }[]
  }

  /**
   * @interface JFormOptions Form配置项
   * @property {RenderForm[]} renderForms FormItem渲染项
   * @property {FormRules} rules Form验证规则
   * @property {Partial<FormProps>} formProps Form其他Attributes
   */
  interface JFormOptions {
    formItems: JFormItem[]
    formProps?: Partial<Writable<FormProps>>
  }

  /**
   * @interface JTableColumn Table列配置项
   * @template T Table数据类型(data)
   * @property {boolean} slot 是否为自定义插槽列
   */
  interface JTableColumn<T> extends Partial<TableColumnCtx<T>> {
    prop: string
    slot?: boolean
  }

  /**
   * @interface JTableOptions Table配置项
   * @template T Table数据类型(data)
   * @property {TableColumn<T>[]} columns Table列
   * @property {TableProps<T>} tableProps Table其他Attributes
   */
  interface JTableOptions<T> {
    columns: JTableColumn<T>[]
    tableProps?: Partial<TableProps<T>>
  }

  /**
   * @interface JDialogOptions Dialog配置项
   * @property {FormOption} formOption Form配置项
   * @property {Partial<DialogProps>} dialogProps Dialog其他Attributes
   */
  interface JDialogOptions {
    formOption: JFormOptions
    dialogProps?: Partial<Writable<DialogProps>>
  }
}
