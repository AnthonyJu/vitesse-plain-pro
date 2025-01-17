import type {
  DialogProps,
  FormItemProps,
  FormProps,
  InputProps,
  ISelectProps,
  TableColumnCtx,
  TableProps,
} from 'element-plus'

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
   * @interface SelectOptionItem select option 选项
   * @property {string | number} label 展示字段
   * @property {string | number | boolean | Record<string, any>} value 字段对应的值
   * @property {boolean} disabled 是否禁用
   */
  interface SelectOptionItem {
    label: string | number
    value: string | number | boolean | Record<string, any>
    disabled?: boolean
  }

  /**
   * @interface JFormItem FormItem渲染项
   * @property {string} prop FormItem的prop
   * @property {string} type FormItem下field类型
   * @property {number} span Dialog中el-col的span
   * @property {string | number} defaultValue FormItem下field的value
   * @property {object} options Select的options选项
   * @property fieldProps FormItem下field的props与events
   */
  interface JFormItem {
    span?: number
    prop: string
    label: string
    type?: 'input' | 'textarea' | 'select' | 'slot'
    default?: string | number | string[]
    formItemProps?: Partial<Writable<FormItemProps>>
    fieldProps?: Partial<Writable<InputProps>> & Partial<ISelectProps> & JFieldEvents
    options?: SelectOptionItem[]
  }

  /**
   * @interface JFormProps Form配置项
   */
  interface JFormProps extends Partial<Writable<FormProps>> {
    dateTimeKeys?: [string, string]
  }

  /**
   * @interface JFormOptions Form配置项
   * @property {JFormItem[]} formItems FormItem渲染项
   * @property {JFormProps} formProps Form其他Attributes
   */
  interface JFormOptions {
    formItems: JFormItem[]
    formProps?: JFormProps
  }

  /**
   * @Type JTableProps Table配置项
   */
  type JTableProps = Partial<Writable<TableProps<T>>>

  /**
   * @interface JTableColumn Table列配置项
   * @template T Table数据类型(data)
   * @property {boolean} slot 是否为自定义插槽列
   */
  interface JTableColumn extends Partial<TableColumnCtx<T>> {
    prop?: string
    slot?: boolean
  }

  /**
   * @interface JTableOptions Table配置项
   * @template T Table数据类型(data)
   * @property {TableColumn<T>[]} columns Table列
   * @property {TableProps<T>} tableProps Table其他Attributes
   */
  interface JTableOptions {
    columns: JTableColumn[]
    tableProps?: JTableProps
  }

  /**
   * @Type JDialogProps Dialog配置项
   */
  type JDialogProps = Partial<Writable<DialogProps>>

  /**
   * @interface JDialogOptions Dialog配置项
   * @property dialogProps Dialog其他Attributes
   */
  interface JDialogOptions extends JFormOptions {
    dialogProps?: JDialogProps
  }

  /**
   * @interface JPaginationOptions 分页配置项
   * @property {number[]} pageSizes 每页数量选项
   * @property {string} layout 组件布局
   */
  interface JPaginationOptions {
    layout?: string // 组件布局
    pageSizes?: number[] // 每页数量选项
  }
}
