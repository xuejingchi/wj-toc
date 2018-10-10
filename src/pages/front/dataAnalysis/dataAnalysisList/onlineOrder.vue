<template>
  <div class="online-order">
    <div class="list-title clearfix">
      <span class="query-list f-l">查询搜索</span>
      <div class="f-r">
        <span class="query-result">
          <el-button @click="getecharts()" class="btn">查询</el-button>
        </span>
      </div>
    </div>
    <div class="screen-list clearfix">
      <div class="form-item">
          <div class="name">生产线:</div>
          <div class="value">
            <el-select v-model="query.productionLine" placeholder="请选择">
              <el-option
                v-for="item in query.productionLinesOption"
                :key="item.locationCode"
                :label="item.locationCode"
                :value="item.locationCode">
              </el-option>
            </el-select>
          </div>
        </div>
    </div>
    <div class="condition-title clearfix">
      <div class="f-l">报告</div>
    </div>
    <div id="myChart" :style="{width: '100%', height: '400px'}"></div>
  </div>
</template>
<script>
import { getUserInfo } from '@/utils/auth'
import moment from 'moment'

import { findLocationValueSetList } from '@/api/front/setting/index'
import { getWorkInProcessStatisticChart } from '@/api/front/dataAnalysis/index'
export default {
  name: 'onlineOrder',
  data () {
    return {
      userInfo: getUserInfo(),
      query: {
        productionLine: '',
        productionLinesOption: [],
        startDate: new Date().getTime() - 31536000000,
        endDate: new Date().getTime()
      },
      echartsList: {}
    }
  },
  mounted () {
    this.findLocationValueSetList()
    // this.getecharts()
  },
  methods: {
    findLocationValueSetList () { // 获取生产线
      let params = {
        locationTypes: [1],
        supplierId: this.userInfo.supplierId
      }
      findLocationValueSetList(params).then((res) => {
        if (res.data.code === 200) {
          this.query.productionLinesOption = res.data.data
        }
      })
    },
    onlineTable () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption(
        {
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            data: this.echartsList.xaxis[0].data
          },
          yAxis: {
            splitLine: {
              show: false
            }
          },
          // toolbox: {
          //   left: 'center',
          //   feature: {
          //     dataZoom: {
          //       yAxisIndex: 'none'
          //     },
          //     restore: {},
          //     saveAsImage: {}
          //   }
          // },
          dataZoom: [{
            startValue: moment(parseInt(moment(new Date()).format('x'), 10) - 61 * 24 * 3600 * 1000).format('YYYYMMDD')
            // startValue: this.echartsList.xaxis[0].data[0],
            // endValue: this.echartsList.xaxis[0].data[59]
          }, {
            type: 'inside'
          }],
          series: {
            type: 'line',
            data: this.echartsList.series[0].data
          }
        }
      )
    },
    getecharts () {
      let params = {
        // supplierId: this.userInfo.supplierId,
        productionLine: this.query.productionLine === '请选择' ? '' : this.query.productionLine,
        supplierId: getUserInfo().supplierId,
        beginDate: this.query.startDate,
        endDate: this.query.endDate
      }
      getWorkInProcessStatisticChart(params).then((res) => {
        if (res.data.code === 200) {
          this.echartsList = res.data.data
          console.log(this.echartsList, 555)
          this.echarts.init(document.getElementById('myChart')).dispose()
          this.onlineTable()
        }
      })
    }
  }
}
</script>
<style lang="sass">
  @import "onlineOrder"
</style>
