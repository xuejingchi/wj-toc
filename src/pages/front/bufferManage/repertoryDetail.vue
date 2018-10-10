<template>
  <div class="repertory-detail">
    <div class="title">库存明细表</div>
    <div class="main">
      <ul class="header">
        <li class="left">库存明细</li>
        <li class="center" v-if="detailList[0].permissions.dynamicbuffer_stock_adjust !== '1'">
          <span class="label">建议调整库存:</span>
          <el-input v-if="editInventory" class="input" v-model="bufferSize"></el-input>
          <span class="text" v-if="!editInventory" @click="modifySkuBuffSize(1)">{{bufferSize}}</span>
          <el-button v-if="editInventory" class="btn" type="primary" @click="modifySkuBuffSize(2)">确认调整</el-button>
        </li>
        <li class="right">
          <el-button class="ghost-btn" @click="exportSkuDetailList">导出表格</el-button>
        </li>
      </ul>
      <div class="table-box">
        <ul class="table-header">
          <li class="label">SKU编号</li>
          <li class="label">位置编号</li>
          <li class="label">在库库存</li>
          <!--<li class="label">管道库存</li>-->
          <li class="label">报告时间</li>
        </ul>
        <ul class="table-list" v-for="item in detailList" :key="item.id">
          <li>{{item.skuCode}}</li>
          <li>{{item.locationCode}}</li>
          <li>{{item.currentInventory}}</li>
          <!--<li>{{item.pipelineInventory}}</li>-->
          <li>{{item.reportDate | timeFormat('YYYY/MM/DD')}}</li>
        </ul>
      </div>
      <div class="toc-pagination" v-if="1">
        <el-pagination
          background
          @current-change="pageChange"
          :page-size="searchParams.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="totalSize">
        </el-pagination>
      </div>
    </div>
    <div class="charts">
      <ul class="header">
        <li class="left">库存每日明细</li>
        <li class="right">
          <el-button class="btn">打印</el-button>
        </li>
      </ul>
      <div id="myEchart" :style="{width: '100%', minHeight: '500px'}"></div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import * as funSets from '@/api/front/bufferManage'
import { getUserInfo } from '@/utils/auth'
export default {
  name: 'bufferManage',
  data () {
    return {
      editInventory: true, // 当前库存是否可编辑状态
      // 搜索参数
      searchParams: {
        supplierId: getUserInfo().supplierId,
        skuCode: null, // SKU编号
        pageNo: 1,
        pageSize: 50,
        currentAccountId: getUserInfo().accountId
      },
      bufferSize: null, // 建议调整库存
      // SKU库存每日明细列表
      detailList: [{
        permissions: '0'
      }],
      totalSize: 0
    }
  },
  beforeMount () {
    this.bufferSize = this.$route.query.bufferSize
    this.searchParams.skuCode = this.$route.query.skuCode
    this.getSkuDetailList()
  },
  mounted () {
    const data = {
      supplierId: getUserInfo().supplierId,
      skuCode: this.$route.query.skuCode,
      beginDate: parseInt(moment(new Date()).format('x'), 10) - 365 * 24 * 3600 * 1000,
      endDate: parseInt(moment(new Date()).format('x'), 10)
    }
    this.loadEcharts(data)
  },
  methods: {
    // 获取SKU库存每日明细列表
    getSkuDetailList () {
      funSets.findSkuInventoryDailyDetailList(this.searchParams).then(
        res => {
          if (res.data.code === 200) {
            let data = res.data.data
            this.detailList = data.inventorySkuList
            this.totalSize = data.totalSize
          }
        }
      ).catch(
        err => {
          this.$message.error(err)
        }
      )
    },
    // 导出库存每日明细列表
    exportSkuDetailList () {
      let params = {
        currentAccountId: getUserInfo().accountId,
        currentAccountName: getUserInfo().accountName,
        supplierId: getUserInfo().supplierId,
        skuCode: this.searchParams.skuCode
      }
      funSets.exportSkuInventoryDailyDetailList(params).then(
        res => {
          if (res.data.code === 200) {
            let data = res.data.data
            this.DownloadFile(data.fileUrl, data.fileName)
          }
        }
      ).catch(
        err => {
          this.$message.error(err)
        }
      )
    },
    // 当前页码发生变化时
    pageChange (val) {
      this.searchParams.pageNo = val
    },
    // 设置目标缓冲库存
    modifySkuBuffSize (n) {
      if (n === 1) {
        this.editInventory = true
      } else {
        this.editInventory = false
        let params = {
          currentAccountId: getUserInfo().accountId,
          currentAccountName: getUserInfo().accountName,
          supplierId: getUserInfo().supplierId,
          skuCode: this.searchParams.skuCode,
          bufferSize: this.bufferSize
        }
        funSets.modifySkuBuffSize(params).then(
          res => {
            if (res.data.code === 200) {
              this.editInventory = false
              this.$router.push({
                path: '/front/repertoryDetail',
                query: {
                  skuCode: this.searchParams.skuCode,
                  bufferSize: this.bufferSize
                }
              })
            }
          }
        ).catch(
          err => {
            this.$message.error(err)
          }
        )
      }
    },
    // 加载 echarts 图标
    loadEcharts (data) {
      funSets.getDynamicBufferManagerChart(data).then(res => {
        let myEchart = this.echarts.init(document.getElementById('myEchart'))
        const data = res.data.data
        const legendData = []
        const seriesData = []
        for (let i = 0; i < data.series.length; i++) {
          if (data.series[i].idx === 2) {
            legendData.push('缓冲太多')
            seriesData.push({
              name: '缓冲太多',
              color: 'green',
              type: 'line',
              stack: '总量',
              areaStyle: { normal: {} },
              data: data.series[i].data
            })
          } else if (data.series[i].idx === 3) {
            legendData.push('缓冲正常')
            seriesData.push({
              name: '缓冲正常',
              color: 'yellow',
              type: 'line',
              stack: '总量',
              areaStyle: { normal: {} },
              data: data.series[i].data
            })
          } else if (data.series[i].idx === 4) {
            legendData.push('缓冲太少')
            seriesData.push({
              name: '缓冲太少',
              color: 'red',
              type: 'line',
              stack: '总量',
              areaStyle: { normal: {} },
              data: data.series[i].data
            })
          } else if (data.series[i].idx === 21) {
            legendData.push('发货量')
            seriesData.push(
              {
                name: '发货量',
                type: 'line',
                data: data.series[i].data
              })
          } else if (data.series[i].idx === 22) {
            legendData.push('管道库存')
            seriesData.push(
              {
                name: '管道库存',
                type: 'line',
                data: data.series[i].data
              })
          } else if (data.series[i].idx === 23) {
            legendData.push('在库库存')
            seriesData.push(
              {
                name: '在库库存',
                type: 'line',
                data: data.series[i].data
              })
          }
        }
        myEchart.setOption(
          {
            title: {
              text: '动态缓冲管理图表'
            },
            dataZoom: [{
              // zoomLock: false,
              startValue: moment(parseInt(moment(new Date()).format('x'), 10) - 61 * 24 * 3600 * 1000).format('YYYYMMDD'),
              bottom: 60
            }, {
              type: 'inside'
            }],
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross',
                label: {
                  backgroundColor: '#6a7985'
                }
              }
            },
            legend: {
              data: legendData
            },
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            grid: {
              bottom: 120
            },
            xAxis: [
              {
                type: 'category',
                boundaryGap: false,
                data: data.xaxis.data
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: seriesData
          }
        )
      })
    }
  }
}
</script>

<style lang="sass">
  @import 'repertoryDetail'
</style>
