import request from '@/utils/request'

// 登录接口
export const login = (data) => request({ url: '/admin/acl/index/login', method: 'post', data })
// 获取用户信息接口
export const getInfo = (token) => request({ url: '/admin/acl/index/info', method: 'get', params: { token } })
// 退出登录接口(非箭头函数写法)
export function logout() {
  return request({
    url: '/admin/acl/index/logout',
    method: 'post'
  })
}
