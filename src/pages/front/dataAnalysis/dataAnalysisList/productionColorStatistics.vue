<template>
  <div class="production-color-statistics">
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

import { findLocationInfoList } from '@/api/front/setting/index'
import { getProductionBufferColorStatisticChart } from '@/api/front/dataAnalysis/index'
export default {
  name: 'productionColorStatistics',
  data () {
    return {
      userInfo: getUserInfo(),
      query: {
        productionLine: '',
        productionLinesOption: [],
        startDate: new Date().getTime() - 31536000000,
        endDate: new Date().getTime()
      },
      drawList: {},
      color: {
        black: null,
        red: null,
        yellow: null,
        green: null,
        cyan: null
      }
    }
  },
  mounted () {
    this.findLocationValueSetList()
    this.getecharts()
  },
  methods: {
    findLocationValueSetList () { // 获取生产线
      let params = {
        locationTypes: [1],
        supplierId: this.userInfo.supplierId
      }
      findLocationInfoList(params).then((res) => {
        if (res.data.code === 200) {
          this.query.productionLinesOption = res.data.data
          this.query.productionLinesOption.unshift({
            currentAccountId: null,
            currentAccountName: null,
            description: '请选择',
            id: '',
            locationCode: '请选择',
            locationType: 1
          })
        }
      })
    },
    onlineTable () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '生产缓冲颜色统计',
          x: 'center',
          align: 'right'
        },
        tooltip: {
          trigger: 'axis'
        },
        toolbox: {
          show: true,
          y: 'bottom',
          feature: {
            mark: {show: true},
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        calculable: true,
        legend: {
          data: ['black', 'red', 'yellow', 'green', 'cyan', 'DDP'],
          orient: 'vertical',
          right: 0,
          top: 'middle'
        },
        dataZoom: [{
          // zoomLock: false,
          // startValue: this.drawList.xaxis.data[0],
          // endValue: this.drawList.xaxis.data[59],
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
            data: this.drawList.xaxis.data
          }
        ],
        yAxis: [
          {
            type: 'value',
            position: 'left'
          }
        ],
        // 全局调色盘。
        color: ['#1F1F1F', '#FF3939', '#FEFF3C', '#ACFF3C', 'cyan'],
        series: [
          {
            name: 'black',
            type: 'bar',
            tooltip: {trigger: 'item'},
            stack: '颜色',
            data: this.drawList.series[this.color.black].data
          },
          {
            name: 'red',
            type: 'bar',
            tooltip: {trigger: 'item'},
            stack: '颜色',
            data: this.drawList.series[this.color.red].data
          },
          {
            name: 'yellow',
            type: 'bar',
            tooltip: {trigger: 'item'},
            stack: '颜色',
            data: this.drawList.series[this.color.yellow].data
          },
          {
            name: 'green',
            type: 'bar',
            tooltip: {trigger: 'item'},
            stack: '颜色',
            data: this.drawList.series[this.color.green].data
          },
          {
            name: 'cyan',
            type: 'bar',
            tooltip: {trigger: 'item'},
            stack: '颜色',
            data: this.drawList.series[this.color.cyan].data
          }
        ]
      })
    },
    getecharts () {
      let params = {
        // supplierId: this.userInfo.supplierId,
        productionLine: this.query.productionLine === '请选择' ? '' : this.query.productionLine,
        supplierId: this.userInfo.supplierId,
        beginDate: this.query.startDate,
        endDate: this.query.endDate
      }
      getProductionBufferColorStatisticChart(params).then((res) => {
        this.echarts.init(document.getElementById('myChart')).dispose()
        if (res.data.code === 200) {
          this.drawList = res.data.data
          this.drawList.series.map((item, index) => {
            if (item.idx === 5) {
              this.color.black = index
            }
            if (item.idx === 4) {
              this.color.red = index
            }
            if (item.idx === 3) {
              this.color.yellow = index
            }
            if (item.idx === 2) {
              this.color.green = index
            }
            if (item.idx === 1) {
              this.color.cyan = index
            }
          })
          this.onlineTable()
        }
      })
    }
  }
}
</script>
<style lang="sass">
  @import "productionColorStatistics"
</style>
