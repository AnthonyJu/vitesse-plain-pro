export function generateRestfulApi(url: string) {
  return {
    one: (id: string | number) => request({
      url: `${url}/${id}`,
      method: 'get',
    }),
    get: (params?: any) => request({
      url,
      method: 'get',
      params,
    }),
    create: (data: any) => request({
      url,
      method: 'post',
      data,
    }),
    update: (id: string | number, data: any) => request({
      url: `${url}/${id}`,
      method: 'patch',
      data,
    }),
    delete: (id: string | number) => request({
      url: `${url}/${id}`,
      method: 'delete',
    }),
  }
}
