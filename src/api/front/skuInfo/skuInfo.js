import request from '@/utils/request'

// sku信息列表
export function findSkuInfoList (query) {
  return request({
    url: '/tocSkuManagerService/findSkuInfoList',
    method: 'post',
    data: query
  })
}

// sku创建
export function createSkuInfo (query) {
  return request({
    url: '/tocSkuManagerService/createSkuInfo',
    method: 'post',
    data: query
  })
}

// sku创建
export function getSkuInfoById (query) {
  return request({
    url: '/tocSkuManagerService/getSkuInfoById',
    method: 'post',
    data: query
  })
}

// sku创建
export function modifySkuInfo (query) {
  return request({
    url: '/tocSkuManagerService/modifySkuInfo',
    method: 'post',
    data: query
  })
}

// sku类型
export function findSkuTypeList (query) {
  return request({
    url: '/valueSetService/findSkuTypeList',
    method: 'post',
    data: query
  })
}

// 获取SKU齐套元素列表 modifySkuFullKitElemen
export function findSkuFullKitElementList (query) {
  return request({
    url: '/tocSkuManagerService/findSkuFullKitElementList',
    method: 'post',
    data: query
  })
}

// 设置SKU齐套元素
export function modifySkuFullKitElement (query) {
  return request({
    url: '/tocSkuManagerService/modifySkuFullKitElement',
    method: 'post',
    data: query
  })
}

// 位置来源
export function findLocationValueSetList (query) {
  return request({
    url: '/locationInfoService/findLocationValueSetList',
    method: 'post',
    data: query
  })
}
