import request from '@/utils/request'

// 获取动态缓冲信息列表
export function findDynamicBufferInfoList (query) {
  return request({
    url: '/bufferManagerService/findDynamicBufferInfoList',
    method: 'post',
    data: query
  })
}

// 导出动态缓冲信息列表
export function exportDynamicBufferInfoList (query) {
  return request({
    url: '/bufferManagerService/exportDynamicBufferInfoList',
    method: 'post',
    data: query
  })
}

// SKU库存每日明细列表
export function findSkuInventoryDailyDetailList (query) {
  return request({
    url: '/inventoryManageService/findSkuInventoryDailyDetailList',
    method: 'post',
    data: query
  })
}

// 导出库存每日明细列表
export function exportSkuInventoryDailyDetailList (query) {
  return request({
    url: '/inventoryManageService/exportSkuInventoryDailyDetailList',
    method: 'post',
    data: query
  })
}

// 设置目标缓冲库存
export function modifySkuBuffSize (query) {
  return request({
    url: '/tocSkuManagerService/modifySkuBuffSize',
    method: 'post',
    data: query
  })
}

// 动态缓冲管理图表
export function getDynamicBufferManagerChart (query) {
  return request({
    url: '/dataAnalysisChartService/getDynamicBufferManagerChart',
    method: 'post',
    data: query
  })
}
