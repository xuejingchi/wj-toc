import request from '@/utils/request'

// 获取生产周期列表
export function findProductionLeadTimeList (data) {
  return request({
    url: '/valueSetService/findProductionLeadTimeList',
    method: 'post',
    data
  })
}

// 未齐套原因列表
export function findNotFullKitCauseList (data) {
  return request({
    url: '/valueSetService/findNotFullKitCauseList',
    method: 'post',
    data
  })
}

// 提前投料原因列表
export function findBeforehandFeedingCauseList (data) {
  return request({
    url: '/valueSetService/findBeforehandFeedingCauseList',
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

// 销售单位列表
export function findSaleUnitList (data) {
  return request({
    url: '/valueSetService/findSaleUnitList',
    method: 'post',
    data
  })
}

// 新增值级行
export function addValueSetLine (data) {
  return request({
    url: '/valueSetService/createValueSetLine',
    method: 'post',
    data
  })
}

// 修改值级行
export function modifyValueSetLine (data) {
  return request({
    url: '/valueSetService/modifyValueSetLine',
    method: 'post',
    data
  })
}

// 删除值级行
export function deleteValueSetLine (data) {
  return request({
    url: '/valueSetService/deleteValueSetLine',
    method: 'post',
    data
  })
}

// 新增齐套元素
export function createFullKitElement (data) {
  return request({
    url: '/fullKitService/createFullKitElement',
    method: 'post',
    data
  })
}

// 删除齐套元素
export function deleteFullKitElement (data) {
  return request({
    url: '/fullKitService/deleteFullKitElement',
    method: 'post',
    data
  })
}

// 编辑齐套元素
export function modifyFullKitElement (data) {
  return request({
    url: '/fullKitService/modifyFullKitElement',
    method: 'post',
    data
  })
}

// 齐套元素列表
export function findFullKitElementList (data) {
  return request({
    url: '/fullKitService/findFullKitElementList',
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

// 位置信息列表
export function findLocationValueSetList (data) {
  return request({
    url: '/locationInfoService/findLocationValueSetList',
    method: 'post',
    data
  })
}

// 修改位置信息
export function modifyLocationInfo (data) {
  return request({
    url: '/locationInfoService/modifyLocationInfo',
    method: 'post',
    data
  })
}

// 删除位置信息
export function deleteLocationInfo (data) {
  return request({
    url: '/locationInfoService/deleteLocationInfo',
    method: 'post',
    data
  })
}

// 新增位置信息
export function createLocationInfo (data) {
  return request({
    url: '/locationInfoService/createLocationInfo',
    method: 'post',
    data
  })
}
