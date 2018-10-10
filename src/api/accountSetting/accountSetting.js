import request from '@/utils/request'
// 获取管理员信息列表
export function findAdminAccountInfoList (data) {
  return request({
    url: '/accountService/findAdminAccountInfoList',
    method: 'post',
    data
  })
}

// 新建管理员账号
export function createAdminAccout (data) {
  return request({
    url: '/accountService/createAdminAccount',
    method: 'post',
    data
  })
}

// 关闭管理员账号
export function closeAccount (data) {
  return request({
    url: '/accountService/closeAccount',
    method: 'post',
    data
  })
}

// 开启管理员账号
export function openAccount (data) {
  return request({
    url: '/accountService/openAccount',
    method: 'post',
    data
  })
}

// 修改管理员账号信息
export function modifyAccountInfo (data) {
  return request({
    url: '/accountService/modifyAccountInfo',
    method: 'post',
    data
  })
}

// 重置账号密码
export function resetAccountPwd (data) {
  return request({
    url: '/accountService/resetAccountPwd',
    method: 'post',
    data
  })
}
