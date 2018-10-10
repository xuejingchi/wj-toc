import request from '@/utils/request'

// 获取齐套管理信息列表
export function findFullKitInfoList (query) {
  return request({
    url: '/workOrderService/findFullKitInfoList',
    method: 'post',
    data: query
  })
}

// 获取工单齐套元素列表
export function findWorkOrderFullKitElementList (query) {
  return request({
    url: '/workOrderService/findWorkOrderFullKitElementList',
    method: 'post',
    data: query
  })
}

// 设置工单未齐套原因
export function modifyWorkOrderNotFullKitCause (query) {
  return request({
    url: '/workOrderService/modifyWorkOrderNotFullKitCause',
    method: 'post',
    data: query
  })
}

// 设置未齐套原因列表
export function findNotFullKitCauseList (query) {
  return request({
    url: '/valueSetService/findNotFullKitCauseList',
    method: 'post',
    data: query
  })
}

// 设置关闭齐套
export function setWorkOrderCloseFullKit (query) {
  return request({
    url: '/workOrderService/setWorkOrderCloseFullKit',
    method: 'post',
    data: query
  })
}

// 导出齐套信息列表
export function exportFullKitInfoList (query) {
  return request({
    url: '/workOrderService/exportFullKitInfoList',
    method: 'post',
    data: query
  })
}

// 创建工单齐套元素关联
export function createWOFullKitElementRel (query) {
  return request({
    url: '/workOrderService/createWOFullKitElementRel',
    method: 'post',
    data: query
  })
}

// 删除工单元素齐套记录
export function deleteWOFullKitElementRel (query) {
  return request({
    url: '/workOrderService/deleteWOFullKitElementRel',
    method: 'post',
    data: query
  })
}
