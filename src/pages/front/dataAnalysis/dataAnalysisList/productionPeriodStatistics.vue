<template>
  <div class="production-period-statistics">
    <div class="list">
      <div class="list-title">
        查询
        <div class="f-r"><el-button class="search btn" @click="search">查询</el-button></div>
      </div>
      <div class="search-condition clearfix">
        <div class="item clearfix">
          <div class="name">生产线:</div>
          <div class="value">
            <el-select v-model="productionLine" placeholder="生产线">
              <el-option
                v-for="item in productionLineType"
                :key="item.valueSetLineId"
                :label="item.locationCode"
                :value="item.locationCode">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="item clearfix">
          <div class="name">生产周期:</div>
          <div class="value">
            <el-select v-model="productionLeadTime" placeholder="生产周期">
              <el-option
                v-for="item in productionLeadType"
                :key="item.valueSetLineId"
                :label="item.valueName"
                :value="item.valueName">
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
import { findProductionLeadTimeList, findLocationInfoList } from '@/api/front/setting/index'
import { getProductionLeadTimeStatisticChart } from '@/api/front/dataAnalysis/index'
import { getUserInfo } from '@/utils/auth'
export default {
  name: 'productionPeriodStatistics',
  data () {
    return {
      loading: false,
      productionLine: '',
      productionLineType: [],
      productionLeadTime: '5天',
      productionLeadType: []
    }
  },
  mounted () {
    const locationData = {
      currentAccountId: getUserInfo().accountId,
      currentAccountName: getUserInfo().accountName,
      supplierId: getUserInfo().supplierId
    }
    this.findLocationInfoList(locationData)
    const leadTimeData = {
      supplierId: getUserInfo().supplierId
    }
    this.findProductionLeadTimeList(leadTimeData)
    const chartsData = {
      supplierId: getUserInfo().supplierId,
      productionLine: this.productionLine === '请选择' ? '' : this.productionLine,
      productionLeadTime: this.productionLeadTime === '请选择' ? '' : this.productionLeadTime,
      beforeActualReleaseDate: parseInt(moment(new Date()).format('x'), 10) - 365 * 24 * 3600 * 1000,
      afterActualReleaseDate: parseInt(moment(new Date()).format('x'), 10)
    }
    this.fetchCharts(chartsData)
  },
  methods: {
    // 生产线位置信息
    findLocationInfoList (data) {
      findLocationInfoList(data).then(res => {
        if (res.data.code === 200) {
          this.productionLineType = res.data.data
        } else {
          this.$message({
            message: res.data.data,
            type: 'error'
          })
        }
      })
    },
    // 获取生产周期列表
    findProductionLeadTimeList (data) {
      findProductionLeadTimeList(data).then(res => {
        if (res.data.code === 200) {
          this.productionLeadType = res.data.data
          this.productionLeadType.unshift({
            valueName: '请选择',
            valueSetLineId: ''
          })
        } else {
          this.$message({
            message: res.data.data,
            type: 'error'
          })
        }
      })
    },
    search () {
      const searchaData = {
        supplierId: getUserInfo().supplierId,
        productionLine: this.productionLine,
        productionLeadTime: this.productionLeadTime === '请选择' ? '' : this.productionLeadTime,
        beforeActualReleaseDate: parseInt(moment(new Date()).format('x'), 10) - 365 * 24 * 3600 * 1000,
        afterActualReleaseDate: parseInt(moment(new Date()).format('x'), 10)
      }
      this.fetchCharts(searchaData)
    },
    fetchCharts (data) {
      this.echarts.init(document.getElementById('myChart')).dispose()
      getProductionLeadTimeStatisticChart(data).then(res => {
        if (res.data.code === 200) {
          const data = res.data.data
          const legendData = []
          const colorData = []
          const seriesData = []
          for (let i = 0; i < data.series.length; i++) {
            if (data.series[i].idx === 71) {
              legendData.push('min')
              colorData.push('#4AC0C0')
              seriesData.push({
                name: 'min',
                type: 'bar',
                tooltip: {trigger: 'item'},
                data: data.series[i].data
              })
            } else if (data.series[i].idx === 72) {
              legendData.push('max')
              colorData.push('#FC9542')
              seriesData.push({
                name: 'max',
                type: 'bar',
                tooltip: {trigger: 'item'},
                data: data.series[i].data
              })
            } else {
              legendData.push('avg')
              colorData.push('#4AA6FC')
              seriesData.push({
                name: 'avg',
                type: 'bar',
                tooltip: {trigger: 'item'},
                data: data.series[i].data
              })
            }
          }
          // 基于准备好的dom，初始化echarts实例
          let myChart = this.echarts.init(document.getElementById('myChart'))
          // 绘制图表
          myChart.setOption({
            title: {
              text: '生产周期统计',
              subtext: `family:${this.productionLeadTime}`,
              x: 'center',
              align: 'right'
            },
            tooltip: {
              trigger: 'axis'
            },
            dataZoom: [{
              startValue: moment(parseInt(moment(new Date()).format('x'), 10) - 61 * 24 * 3600 * 1000).format('YYYYMMDD')
            }, {
              type: 'inside'
            }],
            calculable: true,
            legend: {
              data: legendData,
              orient: 'vertical',
              right: 0,
              top: 'middle'
            },
            xAxis: [
              {
                type: 'category',
                splitLine: { show: false },
                width: '50px',
                data: data.xaxis.data
              }
            ],
            yAxis: [
              {
                type: 'value',
                position: 'left'
              }
            ],
            // 全局调色盘
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
    }
  }
}
</script>
<style lang="sass">
  @import "productionPeriodStatistics"
</style>
