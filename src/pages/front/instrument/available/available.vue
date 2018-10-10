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
          <span class="label">库存位置:</span>
          <el-input
            class="input"
            placeholder=""
            v-model="searchParams.skuCode"
            clearable>
          </el-input>
        </li>
      </ul>
    </div>
    <div id="myChart" :style="{width: '100%', height: '400px'}"></div>
  </div>
</template>
<script>
import { getUserInfo } from '@/utils/auth'
export default {
  name: 'available',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      // 搜索参数
      searchParams: {
        supplierId: getUserInfo().supplierId,
        productionLine: '', // 生产线
        skuCode: '', // SKU编号
        afterAdviseReleaseDate: '',
        beforeAdviseReleaseDate: '',
        status: ''
      }
    }
  },
  mounted () {
    this.drawLine()
  },
  methods: {
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
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
          data: ['邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        xAxis: [
          {
            type: 'category',
            splitLine: {show: false},
            width: '50px',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }
        ],
        yAxis: [
          {
            type: 'value',
            position: 'left'
          }
        ],
        // 全局调色盘。
        color: ['#1F1F1F', '#FF3939', '#FEFF3C', '#ACFF3C'],
        series: [
          {
            name: '邮件营销',
            type: 'bar',
            tooltip: {trigger: 'item'},
            stack: '广告',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '联盟广告',
            type: 'bar',
            tooltip: {trigger: 'item'},
            stack: '广告',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '视频广告',
            type: 'bar',
            tooltip: {trigger: 'item'},
            stack: '广告',
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: '搜索引擎',
            type: 'line',
            data: [100, 110, 80, 120, 200, 230, 310]
          }
        ]
      })
    }
  }
}
</script>
