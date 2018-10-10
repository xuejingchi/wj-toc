import request from '@/utils/request'

// 缓冲报表列表
export function findBufferReportList (data) {
  return request({
    url: '/bufferManagerService/findBufferReportList',
    method: 'post',
    data
  })
}

// 生产单列表
export function findProductionOrderList (data) {
  return request({
    url: '/productionOrderService/findProductionOrderList',
    method: 'post',
    data
  })
}

// 位置信息列表
export function findLocationInfoList (data) {
  return request({
    url: '/locationInfoService/findLocationInfoList',
    method: 'post',
    data
  })
}

// 红黑单原因列表
export function findRedBlackOrderCauseList (data) {
  return request({
    url: '/valueSetService/findRedBlackOrderCauseList',
    method: 'post',
    data
  })
}

// 设置红黑单原因
export function modifyRedBlackOrderCause (data) {
  return request({
    url: '/bufferManagerService/modifyRedBlackOrderCause',
    method: 'post',
    data
  })
}

// 导出报表
export function exportBufferReportList (query) {
  return request({
    url: '/bufferManagerService/exportBufferReportList',
    method: 'post',
    data: query
  })
}
