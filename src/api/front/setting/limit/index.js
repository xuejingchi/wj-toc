import request from '@/utils/request'

// 供应商账号角色列表
export function findSupplierAccountRoleList (data) {
  return request({
    url: '/accountService/findSupplierAccountRoleList',
    method: 'post',
    data
  })
}

// 创建供应商子账号
export function createSupplierSubAccount (data) {
  return request({
    url: '/supplierService/createSupplierSubAccount',
    method: 'post',
    data
  })
}

// 修改供应商子账号
export function modifyAccountRole (data) {
  return request({
    url: '/accountService/modifyAccountRole',
    method: 'post',
    data
  })
}

// 供应商子账号列表
export function findSupplierList (data) {
  return request({
    url: '/supplierService/findSupplierList',
    method: 'post',
    data
  })
}

// 供应商账号信息列表
export function findSupplierAccountInfoList (data) {
  return request({
    url: '/accountService/findSupplierAccountInfoList',
    method: 'post',
    data
  })
}
