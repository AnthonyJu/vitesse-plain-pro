export interface AnyObject {
  [key: string]: unknown
}

interface Res<T> {
  status: number
  message?: string
  data: T
}
