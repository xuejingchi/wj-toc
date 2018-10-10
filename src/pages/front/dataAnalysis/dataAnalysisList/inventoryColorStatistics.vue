<template>
  <div class="inventory-color-statistics">
    <div class="list">
      <div class="list-title">
        查询
        <div class="f-r"><el-button class="search btn" @click="search">查询</el-button></div>
      </div>
      <div class="search-condition clearfix">
        <div class="item clearfix">
          <div class="name">库存位置:</div>
          <div class="value">
            <el-select v-model="storeState" placeholder="库存位置">
              <el-option
                v-for="item in storeType"
                :key="item.valueSetLineId"
                :label="item.locationCode"
                :value="item.locationCode">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <div class="list">
      <div class="list-title">
        报告
      </div>
      <div class="search-condition list-bottom" v-loading="loading">
        <div id="myChart" :style="{width: '100%', height: '400px'}"></div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { findLocationInfoList } from '@/api/front/setting/index'
import { getInventoryBufferColorStatisticChart } from '@/api/front/dataAnalysis/index'
import { getUserInfo } from '@/utils/auth'
export default {
  name: 'inventoryColorStatistics',
  data () {
    return {
      loading: false,
      storeState: '',
      storeType: []
    }
  },
  mounted () {
    // 获取库存位置信息列表
    const data = {
      supplierId: getUserInfo().supplierId,
      locationType: 4
    }
    this.getLocationList(data)
    //  获取图表信息
    const chartParams = {
      supplierId: getUserInfo().supplierId,
      beginDate: parseInt(moment(new Date()).format('x'), 10) - 365 * 24 * 3600 * 1000,
      endDate: parseInt(moment(new Date()).format('x'), 10)
    }
    this.fetchChartList(chartParams)
  },
  methods: {
    search () {
      const data = {
        supplierId: getUserInfo().supplierId,
        destinationLocation: this.storeState === '请选择' ? '' : this.storeState,
        beginDate: parseInt(moment(new Date()).format('x'), 10) - 365 * 24 * 3600 * 1000,
        endDate: parseInt(moment(new Date()).format('x'), 10)
      }
      this.fetchChartList(data)
    },
    fetchChartList (data) {
      this.echarts.init(document.getElementById('myChart')).dispose()
      getInventoryBufferColorStatisticChart(data).then(res => {
        if (res.data.code === 200) {
          let myChart = this.echarts.init(document.getElementById('myChart'))
          const data = res.data.data
          const legendData = []
          const colorData = []
          const seriesData = []
          for (let i = 0; i < data.series.length; i++) {
            if (data.series[i].idx === 1) {
              legendData.push('Cyan')
              colorData.push('#00FFFF')
              seriesData.push({
                name: 'Cyan',
                type: 'bar',
                tooltip: {trigger: 'item'},
                stack: '颜色',
                data: data.series[i].data
              })
            } else if (data.series[i].idx === 2) {
              legendData.push('Green')
              colorData.push('#ACFF3C')
              seriesData.push({
                name: 'Green',
                type: 'bar',
                tooltip: {trigger: 'item'},
                stack: '颜色',
                data: data.series[i].data
              })
            } else if (data.series[i].idx === 3) {
              legendData.push('Yellow')
              colorData.push('#FEFF3C')
              seriesData.push({
                name: 'Yellow',
                type: 'bar',
                tooltip: {trigger: 'item'},
                stack: '颜色',
                data: data.series[i].data
              })
            } else if (data.series[i].idx === 4) {
              legendData.push('Red')
              colorData.push('#FF3939')
              seriesData.push({
                name: 'Red',
                type: 'bar',
                tooltip: {trigger: 'item'},
                stack: '颜色',
                data: data.series[i].data
              })
            } else {
              legendData.push('Black')
              colorData.push('#1F1F1F')
              seriesData.push({
                name: 'Black',
                type: 'bar',
                tooltip: {trigger: 'item'},
                stack: '颜色',
                data: data.series[i].data
              })
            }
          }
          // 绘制图表
          myChart.setOption({
            title: {
              text: '库存缓冲颜色统计',
              x: 'center',
              align: 'right'
            },
            tooltip: {
              trigger: 'axis'
            },
            calculable: true,
            legend: {
              data: legendData,
              orient: 'vertical',
              right: 0,
              top: 'middle'
            },
            dataZoom: [{
              // zoomLock: false,
              startValue: moment(parseInt(moment(new Date()).format('x'), 10) - 61 * 24 * 3600 * 1000).format('YYYYMMDD'),
              bottom: 60
            }, {
              type: 'inside'
            }],
            grid: {
              bottom: 120
            },
            xAxis: [
              {
                type: 'category',
                splitLine: {show: false},
                splitNumber: 1,
                data: data.xaxis[0].data
              }
            ],
            yAxis: [
              {
                type: 'value',
                position: 'left'
              }
            ],
            // 全局调色盘。
            color: colorData,
            series: seriesData
          })
        } else {
          this.$message({
            message: res.data.data,
            type: 'error'
          })
        }
      })
    },
    getLocationList (data) {
      findLocationInfoList(data).then(res => {
        if (res.data.code === 200) {
          this.storeType = res.data.data
          this.storeType.unshift({
            currentAccountId: null,
            currentAccountName: null,
            description: '请选择',
            id: '',
            locationCode: '请选择',
            locationType: 4
          })
        } else {
          this.$message({
            message: res.data.data,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>
<style lang="sass">
  @import "inventoryColorStatistics"
</style>
