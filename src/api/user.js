// 有关于用户的接口
import request from '@/utils/request'

// 注册请求
export const userRegisterService = ({ userName, password }) =>
  request.post('/api/auth/register', {
    userName,
    password,
  })

// 登录请求
export const userLoginService = ({ account, password }) =>
  request.post('/api/auth/login', {
    account,
    password,
  })

// 获取用户信息请求
export const userInfoService = (userId) =>
  request.get('/api/user/', {
    params: { userId },
  })
