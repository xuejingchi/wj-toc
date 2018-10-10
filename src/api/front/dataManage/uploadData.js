import request from '@/utils/request'

// 上传文件
export function uploadFile (event, t) {
  let file = event.target.files[0]
  let FileType = file.name.split('.')[file.name.split('.').length - 1]
  const allowedFileTypes = ['xls', 'xlsx'] //, 'doc', 'docx', 'pdf', 'jpg', 'jpeg', 'png', 'rar', 'zip']
  if (file.size > 1024 * 1024 * 20) {
    this.$message({
      message: '请上传大小不超过20M的文件！',
      type: 'error'
    })
    return false
  }
  if (allowedFileTypes.indexOf(FileType) < 0) {
    t.$message({
      message: '请上传正确格式的文件',
      type: 'error'
    })
    return false
  }
  let formData = new window.FormData()
  formData.append('file', file, file.name)
  return request({
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    data: formData,
    url: t.FileUploadUrl
  })
}
// 销售订单
export function importSO (query) {
  return request({
    url: '/importService/importSOExcelData',
    method: 'post',
    data: query
  })
}

// 每日工单
export function importWO (query) {
  return request({
    url: '/importService/importWOExcelData',
    method: 'post',
    data: query
  })
}

// 生产工单
export function importPRO (query) {
  return request({
    url: '/importService/importPROExcelData',
    method: 'post',
    data: query
  })
}

// 每日库存
export function importStockStatus (query) {
  return request({
    url: '/importService/importStockStatusExcelData',
    method: 'post',
    data: query
  })
}

// 每日交易
export function importStockTransactions (query) {
  return request({
    url: '/importService/importStockTransactionsExcelData',
    method: 'post',
    data: query
  })
}

// SKU数据导入
export function importSku (query) {
  return request({
    url: '/importService/importSkuExcelData',
    method: 'post',
    data: query
  })
}
