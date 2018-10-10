import request from '@/utils/request'

// 登录
export function accountLogin (query) {
  return request({
    url: '/accountService/accountLogin',
    method: 'post',
    data: query
  })
}

// 获取图片验证码
export function getVerifyCode (query) {
  return request({
    url: '/accountService/getVerifyCode',
    method: 'post',
    data: query
  })
}

// 登出
export function logout (query) {
  return request({
    url: '/accountService/logout',
    method: 'post',
    data: query
  })
}

// 校验原密码
export function checkAccountPwd (query) {
  return request({
    url: '/accountService/checkAccountPwd',
    method: 'post',
    data: query
  })
}

// 修改密码
export function resetAccountPwd (query) {
  return request({
    url: '/accountService/resetAccountPwd',
    method: 'post',
    data: query
  })
}

// 修改管理员用户信息
export function modifyAccountInfo (query) {
  return request({
    url: '/accountService/modifyAccountInfo',
    method: 'post',
    data: query
  })
}

// 权限菜单信息
export function findMenuInfoList (data) {
  return request({
    url: '/accountService/findMenuInfoList',
    method: 'post',
    data
  })
}
