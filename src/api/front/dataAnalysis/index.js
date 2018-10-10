import request from '@/utils/request'

// 获取已完成工单列表
export function findFinishedWorkOrderList (query) {
  return request({
    url: '/workOrderService/findFinishedWorkOrderList',
    method: 'post',
    data: query
  })
}

// 获取库存状态明细列表
export function findInventoryStatusDetailList (query) {
  return request({
    url: '/inventoryManageService/findInventoryStatusDetailList',
    method: 'post',
    data: query
  })
}

// 获取库存状态明细列表
export function findInventoryTransactionDetailList (query) {
  return request({
    url: '/inventoryManageService/findInventoryTransactionDetailList',
    method: 'post',
    data: query
  })
}

// 导出库存交易明细列表
export function exportInventoryTransactionDetailList (query) {
  return request({
    url: '/inventoryManageService/exportInventoryTransactionDetailList',
    method: 'post',
    data: query
  })
}

// 导出库存状态明细列表
export function exportInventoryStatusDetailList (query) {
  return request({
    url: '/inventoryManageService/exportInventoryStatusDetailList',
    method: 'post',
    data: query
  })
}

// 导出已完成工单列表
export function exportFinishedWorkOrderList (query) {
  return request({
    url: '/workOrderService/exportFinishedWorkOrderList',
    method: 'post',
    data: query
  })
}

// 获取补货单信息列表
export function findReplenishmentOrderList (query) {
  return request({
    url: '/replenishmentOrderService/findReplenishmentOrderList',
    method: 'post',
    data: query
  })
}

// 导出补货单信息列表
export function exportReplenishWorkOrderList (query) {
  return request({
    url: '/replenishmentOrderService/exportReplenishWorkOrderList',
    method: 'post',
    data: query
  })
}

// 获取违反绳规则列表
export function findViolationRopeRuleList (query) {
  return request({
    url: '/workOrderService/findViolationRopeRuleList',
    method: 'post',
    data: query
  })
}

// 导出违反绳规则列表
export function exportViolationRopeRuleList (query) {
  return request({
    url: '/workOrderService/exportViolationRopeRuleList',
    method: 'post',
    data: query
  })
}

// 设置提前投料原因
export function modifyBeforehandFeedingCause (query) {
  return request({
    url: '/workOrderService/modifyBeforehandFeedingCause',
    method: 'post',
    data: query
  })
}

// 生产周期统计
export function getProductionLeadTimeStatisticChart (query) {
  return request({
    url: '/dataAnalysisChartService/getProductionLeadTimeStatisticChart',
    method: 'post',
    data: query
  })
}

// 在制品工单图表
export function getWorkInProcessStatisticChart (query) {
  return request({
    url: '/dataAnalysisChartService/getWorkInProcessStatisticChart',
    method: 'post',
    data: query
  })
}

// 库存缓冲颜色统计列表
export function getInventoryBufferColorStatisticChart (query) {
  return request({
    url: '/dataAnalysisChartService/getInventoryBufferColorStatisticChart',
    method: 'post',
    data: query
  })
}

// 生产缓冲颜色统计图表
export function getProductionBufferColorStatisticChart (query) {
  return request({
    url: '/dataAnalysisChartService/getProductionBufferColorStatisticChart',
    method: 'post',
    data: query
  })
}
