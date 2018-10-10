import request from '@/utils/request'

// 未同步工单列表
export function findNotSyncWorkOrderList (data) {
  return request({
    url: '/notSyncDataService/findNotSyncWorkOrderList',
    method: 'post',
    data
  })
}
// 导出未同步工单列表
export function exportNotSyncWorkOrderList (data) {
  return request({
    url: '/notSyncDataService/exportNotSyncWorkOrderList',
    method: 'post',
    data
  })
}
// 未同步库存交易列表
export function findNotSyncInventoryTransactionList (data) {
  return request({
    url: '/notSyncDataService/findNotSyncInventoryTransactionList',
    method: 'post',
    data
  })
}
// 导出未同步库存交易列表
export function exportNotSyncInventoryTransactionList (data) {
  return request({
    url: '/notSyncDataService/exportNotSyncInventoryTransactionList',
    method: 'post',
    data
  })
}
// 未同步库存状态列表
export function findNotSyncInventoryStatusList (data) {
  return request({
    url: '/notSyncDataService/findNotSyncInventoryStatusList',
    method: 'post',
    data
  })
}
// 导出未同步库存状态列表
export function exportNotSyncInventoryStatusList (data) {
  return request({
    url: '/notSyncDataService/exportNotSyncInventoryStatusList',
    method: 'post',
    data
  })
}
