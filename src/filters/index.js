import moment from 'moment'
// 日期毫秒格式化 { TIME | timeFormat('YYYY-MM-DD  HH:mm:ss') }
const timeFormat = (value, format) => {
  if (value) {
    return moment(value).format(format)
  }
  return ''
}

export {
  timeFormat
}
