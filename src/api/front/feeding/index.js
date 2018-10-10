import request from '@/utils/request'

// 获取需投放列表
export function findNeedToReleaseWorkOrderList (query) {
  return request({
    url: '/workOrderService/findNeedToReleaseWorkOrderList',
    method: 'post',
    data: query
  })
}

// 导出投放单
export function exportNeedToReleaseWorkOrderList (query) {
  return request({
    url: '/workOrderService/exportNeedToReleaseWorkOrderList',
    method: 'post',
    data: query
  })
}

// 获取需补货列表
export function findReplenishmentOrderList (query) {
  return request({
    url: '/replenishmentOrderService/findReplenishmentOrderList',
    method: 'post',
    data: query
  })
}

// 关闭补货单
export function closeReplenishmentOrder (query) {
  return request({
    url: '/replenishmentOrderService/closeReplenishmentOrder',
    method: 'post',
    data: query
  })
}

// 导出补货单
export function exportReplenishWorkOrderList (query) {
  return request({
    url: '/replenishmentOrderService/exportReplenishWorkOrderList',
    method: 'post',
    data: query
  })
}
