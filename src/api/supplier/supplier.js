import request from '@/utils/request'

// 获取供应商信息列表
export function findSupplierList (query) {
  return request({
    url: '/supplierService/findSupplierList',
    method: 'post',
    data: query
  })
}
// 获取管理员信息列表
export function findAdministratorList (query) {
  return request({
    url: '/accountService/findAdminAccountInfoList',
    method: 'post',
    data: query
  })
}
// 供应商主账号开通
export function createSupplierMasterAccount (query) {
  return request({
    url: '/supplierService/createSupplierMasterAccount',
    method: 'post',
    data: query
  })
}
// 关闭供应商所有账号
export function closeSupplierAllAccount (query) {
  return request({
    url: '/supplierService/closeSupplierAllAccount',
    method: 'post',
    data: query
  })
}
// 供应商主账号开通
export function createSupplier (query) {
  return request({
    url: '/supplierService/createSupplier',
    method: 'post',
    data: query
  })
}
// 重置账户密码
export function resetAccountPwd (query) {
  return request({
    url: '/accountService/resetAccountPwd',
    method: 'post',
    data: query
  })
}
// 重置账户
export function modifySupplier (query) {
  return request({
    url: '/supplierService/modifySupplier',
    method: 'post',
    data: query
  })
}
// 开启账户
export function openSupplierAllAccount (query) {
  return request({
    url: '/supplierService/openSupplierAllAccount',
    method: 'post',
    data: query
  })
}
// 获取省市区
export function getAreaInfo (query) {
  return request({
    url: '/systemInfoService/getAreaInfo',
    method: 'post',
    data: query
  })
}
