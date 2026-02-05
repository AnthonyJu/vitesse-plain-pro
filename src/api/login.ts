/// <reference path="./login.d.ts" />

// 默认两个用户
const users = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    role: 'admin',
  },
  {
    id: 2,
    username: 'user',
    password: '123456',
    role: 'user',
  },
]

export function authLogin(data: LoginInfo) {
  return new Promise<Res<UserInfo>>((resolve, reject) => {
    // 模拟登录
    const user = users.find(user =>
      user.username === data.username && user.password === data.password,
    )
    setTimeout(() => {
      if (user) {
        resolve({
          status: 200,
          message: '登录成功',
          data: {
            id: user.id,
            username: user.username,
            nikeName: user.username,
            avatar: '',
            role: user.role,
            access_token: '1234567890',
          },
        })
      }
      else {
        ElMessage.error('用户名或密码错误')
        reject(new Error('用户名或密码错误'))
      }
    }, 600)
  })
}
