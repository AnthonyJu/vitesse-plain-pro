import type { LoginInfo, UserInfo } from '../types/login'
import type { Res } from '@/types/res'

export function authLogin(data: LoginInfo) {
  return new Promise<Res<UserInfo>>((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          status: 200,
          message: '登录成功',
          data: {
            id: 1,
            username: data.username,
            nikeName: 'admin',
            avatar: '',
            role: 'admin',
            access_token: '1234567890',
          },
        },
      })
    }, 1000)
  })
}
