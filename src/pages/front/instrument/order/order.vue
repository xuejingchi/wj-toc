<template>
  <div class="order">
    <div class="top">
      <ul class="header">
        <li class="left">查询</li>
        <li class="right">
          <el-button class="btn" @click="search">查询</el-button>
        </li>
      </ul>
      <ul class="body">
        <li>
          <span class="label">SKU编号:</span>
          <el-input
            class="input"
            placeholder=""
            v-model="searchParams.skuCode"
            clearable>
          </el-input>
        </li>
        <li>
          <span class="label">生产线:</span>
          <el-select class="input" v-model="searchParams.productionLine" placeholder="请选择">
            <el-option
              v-for="item in lineType"
              :key="item.valueSetLineId"
              :label="item.description"
              :value="item.description">
            </el-option>
          </el-select>
        </li>
      </ul>
    </div>
    <div class="rotate-left">交货至成品库存的工单的颜色状态分布</div>
    <div class="rotate-bottom">交货日期</div>
    <div id="myChart" :style="{width: '100%', height: '400px'}"></div>
  </div>
</template>

<script>
import moment from 'moment'

import { getMakeToOrderChart } from '@/api/front/instrument'
import { findLocationInfoList } from '@/api/front/setting/index'
import { getUserInfo } from '@/utils/auth'
export default {
  name: 'order',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      // 搜索参数
      searchParams: {
        supplierId: getUserInfo().supplierId,
        productionLine: '', // 生产线
        skuCode: '', // SKU编号
        afterTargetDeliveryDate: '',
        beforeTargetDeliveryDate: '',
        status: ''
      },
      drawList: [],
      lineType: [] // 生产线
    }
  },
  created () {
    this.getLocationList(1)
    this.getTableList()
  },
  mounted () {
    // this.drawLine()
  },
  methods: {
    // 获取位置
    getLocationList (num) {
      let params = {
        locationType: num,
        supplierId: getUserInfo().supplierId
      }
      findLocationInfoList(params).then(res => {
        this.lineType = res.data.data
        // 添加查询全部选项
        this.lineType.unshift({
          currentAccountId: null,
          currentAccountName: null,
          description: '请选择',
          id: '',
          locationCode: '请选择',
          locationType: 1
        })
      })
    },
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '工单交期表现',
          x: 'center',
          align: 'right'
          // subtext: {
          //   text: '111'
          // }
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
          // startValue: this.drawList.xaxis[1][0],
          //
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
            data: this.drawList.xaxis[1]
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
            data: this.drawList.series[5]
          },
          {
            name: 'red',
            type: 'bar',
            tooltip: {trigger: 'item'},
            stack: '颜色',
            data: this.drawList.series[4]
          },
          {
            name: 'yellow',
            type: 'bar',
            tooltip: {trigger: 'item'},
            stack: '颜色',
            data: this.drawList.series[3]
          },
          {
            name: 'green',
            type: 'bar',
            tooltip: {trigger: 'item'},
            stack: '颜色',
            data: this.drawList.series[2]
          },
          {
            name: 'cyan',
            type: 'bar',
            tooltip: {trigger: 'item'},
            stack: '颜色',
            data: this.drawList.series[1]
          },
          {
            name: 'DDP',
            type: 'line',
            data: this.drawList.series[11]
          }
        ]
      })
    },
    getTableList () {
      let params = {
        supplierId: getUserInfo().supplierId,
        productionLine: this.searchParams.productionLine === '请选择' ? '' : this.searchParams.productionLine, // 生产线
        skuCode: this.searchParams.skuCode, // SKU编号
        beforeTargetDeliveryDate: new Date().getTime() - (365 * 24 * 3600 * 1000),
        afterTargetDeliveryDate: new Date().getTime()
      }
      getMakeToOrderChart(params).then(res => {
        this.drawList = res.data.data
        this.echarts.init(document.getElementById('myChart')).dispose()
        this.drawLine()
      })
    },
    getNewTableList (y) {
      let beforeTime = new Date(y + '-01-01').getTime()
      let endTime = new Date((y + 1) + '-01-01').getTime()
      let params = {
        supplierId: getUserInfo().supplierId,
        productionLine: this.searchParams.productionLine === '请选择' ? '' : this.searchParams.productionLine, // 生产线
        skuCode: this.searchParams.skuCode, // SKU编号
        beforeTargetDeliveryDate: beforeTime,
        afterTargetDeliveryDate: endTime
      }
      let invaild = 'drawList' + y
      getMakeToOrderChart(params).then(res => {
        this[invaild] = res.data.data
      })
      // console.log(this.drawList2013)
    },
    // 点击查询
    search () {
      // let myChart = this.echarts.init(document.getElementById('myChart'))
      this.echarts.init(document.getElementById('myChart')).dispose()
      this.getTableList()
    }
  }
}
</script>
