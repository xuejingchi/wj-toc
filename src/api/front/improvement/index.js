import request from '@/utils/request'

// 红黑单分析图表
export function getRedBlackOrderAnalysisChart (query) {
  return request({
    url: '/dataAnalysisChartService/getRedBlackOrderAnalysisChart',
    method: 'post',
    data: query
  })
}
