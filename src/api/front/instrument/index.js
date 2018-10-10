import request from '@/utils/request'

// 订单式图标
export function getMakeToOrderChart (query) {
  return request({
    url: '/dataAnalysisChartService/getMakeToOrderChart',
    method: 'post',
    data: query
  })
}
