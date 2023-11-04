export interface Res<T> {
  data: {
    status: number
    message?: string
    data: T
  }
}
