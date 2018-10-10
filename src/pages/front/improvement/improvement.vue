<template>
  <div class="continual-improvement">
    <div class="title">持续改进</div>
    <div class="top">
      <ul class="header">
        <li class="left">查询</li>
        <li class="right">
          <p v-if="0" class="fold" @click="foldFun">{{ this.fold ? '展开筛选' : '收起筛选' }}
            <i :class="[this.fold ? 'el-icon-arrow-down' : 'el-icon-arrow-up']"></i>
          </p>
          <el-button class="btn" @click="getChartData">查询</el-button>
        </li>
      </ul>
      <ul class="body">
        <li>
          <span class="label">生产线:</span>
          <el-select v-model="searchParams.productionLine" placeholder="请选择">
            <el-option
              v-for="item in productLineList"
              :key="item.id"
              :label="item.locationCode"
              :value="item.locationCode">
            </el-option>
          </el-select>
        </li>
        <li>
          <span class="label">SKU编号:</span>
          <el-input
            class="input"
            placeholder=""
            v-model="searchParams.skuCode"
            clearable>
          </el-input>
        </li>
        <!--<li>-->
          <!--<span class="label">建议投料时间:</span>-->
          <!--<el-date-picker-->
            <!--class="date"-->
            <!--v-model="searchParams.afterAdviseReleaseDate"-->
            <!--type="date"-->
            <!--:picker-options="startTime.startPickerOptions"-->
            <!--placeholder="选择日期">-->
          <!--</el-date-picker>-->
          <!--至-->
          <!--<el-date-picker-->
            <!--class="date"-->
            <!--v-model="searchParams.beforeAdviseReleaseDate"-->
            <!--type="date"-->
            <!--:picker-options="startTime.endPickerOptions"-->
            <!--placeholder="选择日期">-->
          <!--</el-date-picker>-->
        <!--</li>-->
        <li v-show="this.fold">
          <span class="label">实际投料时间:</span>
          <el-date-picker
            class="date"
            v-model="searchParams.afterActualReleaseDate"
            type="date"
            :picker-options="startTime.startPickerOptions2"
            placeholder="选择日期">
          </el-date-picker>
          至
          <el-date-picker
            class="date"
            v-model="searchParams.beforeActualReleaseDate"
            type="date"
            :picker-options="startTime.endPickerOptions2"
            placeholder="选择日期">
          </el-date-picker>
        </li>
        <!--<li v-show="!this.fold">-->
          <!--<span class="label">交期:</span>-->
          <!--<el-date-picker-->
            <!--class="date"-->
            <!--v-model="searchParams.afterTargetDeliveryDate"-->
            <!--type="date"-->
            <!--:picker-options="startTime.startPickerOptions3"-->
            <!--placeholder="选择日期">-->
          <!--</el-date-picker>-->
          <!--至-->
          <!--<el-date-picker-->
            <!--class="date"-->
            <!--v-model="searchParams.beforeTargetDeliveryDate"-->
            <!--type="date"-->
            <!--:picker-options="startTime.endPickerOptions3"-->
            <!--placeholder="选择日期">-->
          <!--</el-date-picker>-->
        <!--</li>-->
      </ul>
    </div>
    <div class="main">
      <ul class="header">
        <li class="left">延误的帕累托分析</li>
        <li class="right">
          <el-button class="btn">打印</el-button>
        </li>
      </ul>
      <div id="myEchart" :style="{width: '100%', minHeight: '500px'}"></div>
    </div>
  </div>
</template>

<script>
import { getRedBlackOrderAnalysisChart } from '@/api/front/improvement'
import { findLocationValueSetList } from '@/api/front/skuInfo/skuInfo'
import { getUserInfo } from '@/utils/auth'
import moment from 'moment'
export default {
  name: 'bufferManage',
  data () {
    return {
      fold: true, // 是否折叠
      // 生产线列表
      productLineList: [],
      // 搜索参数
      searchParams: {
        supplierId: getUserInfo().supplierId,
        productionLine: null, // 生产线
        skuCode: '', // SKU编号
        // beforeAdviseReleaseDate: null, // 建议投料日期之前
        // afterAdviseReleaseDate: null, // 建议投料日期之后
        beforeActualReleaseDate: null, // 实际投料日期之前
        afterActualReleaseDate: null // 实际投料日期之后
        // beforeTargetDeliveryDate: null, // 目标交期之前
        // afterTargetDeliveryDate: null // 目标交期之后
      },
      // 时间处理
      startTime: {
        startPickerOptions: {
          disabledDate: (val) => {
            if (this.searchParams.beforeAdviseReleaseDate !== null && this.searchParams.beforeAdviseReleaseDate !== '' && this.searchParams.beforeAdviseReleaseDate !== undefined) {
              return val.getTime() > this.searchParams.beforeAdviseReleaseDate
            }
          }
        },
        endPickerOptions: {
          disabledDate: (val) => {
            if (this.searchParams.afterAdviseReleaseDate !== null) {
              return val.getTime() < this.searchParams.afterAdviseReleaseDate
            }
          }
        },
        startPickerOptions2: {
          disabledDate: (val) => {
            if (this.searchParams.beforeActualReleaseDate !== null && this.searchParams.beforeActualReleaseDate !== '' && this.searchParams.beforeActualReleaseDate !== undefined) {
              return val.getTime() > this.searchParams.beforeActualReleaseDate
            }
          }
        },
        endPickerOptions2: {
          disabledDate: (val) => {
            if (this.searchParams.afterActualReleaseDate !== null) {
              return val.getTime() < this.searchParams.afterActualReleaseDate
            }
          }
        },
        startPickerOptions3: {
          disabledDate: (val) => {
            if (this.searchParams.beforeTargetDeliveryDate !== null && this.searchParams.beforeTargetDeliveryDate !== '' && this.searchParams.beforeTargetDeliveryDate !== undefined) {
              return val.getTime() > this.searchParams.beforeTargetDeliveryDate
            }
          }
        },
        endPickerOptions3: {
          disabledDate: (val) => {
            if (this.searchParams.afterTargetDeliveryDate !== null) {
              return val.getTime() < this.searchParams.afterTargetDeliveryDate
            }
          }
        }
      },
      // 请求的 echarts 数据
      echartsData: {},
      // 左Y轴最大值(原因总和 + x  凑成10倍数)
      maxNum: null
    }
  },
  created () {
    const params = {
      currentAccountId: getUserInfo().accountId,
      currentAccountName: getUserInfo().accountName,
      supplierId: getUserInfo().supplierId,
      locationTypes: [1]
    }
    // 获取生产线列表
    findLocationValueSetList(params).then(
      res => {
        if (res.data.code === 200) {
          this.productLineList = res.data.data
          // 添加查询全部选项
          this.productLineList.unshift({
            currentAccountId: null,
            currentAccountName: null,
            description: '请选择',
            id: '',
            locationCode: '请选择',
            locationType: 1
          })
        }
      }
    ).catch(
      err => {
        this.$message.error(err)
      }
    )
  },
  beforeMount () {
  },
  mounted () {
    console.log(465545, getUserInfo())
    this.getChartData()
  },
  methods: {
    // 筛选按钮点击函数
    foldFun () {
      this.fold = !this.fold
    },
    // 加载 echarts 图标
    loadEcharts () {
      let myEchart = this.echarts.init(document.getElementById('myEchart'))
      myEchart.setOption(
        {
          color: ['#03befd', 'red'],
          // 提示框组件
          tooltip: {
            // 是否显示提示框
            show: true,
            // 触发类型
            trigger: 'axis',
            // 坐标轴指示器，坐标轴触发有效
            axisPointer: {
              type: '' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '10%', // 离容器左侧距离
            bottom: '25%'
          },
          series: [
            {
              // x坐标对应的值
              name: '延误工单数量',
              type: 'bar',
              yAxisIndex: 1,
              smooth: true,
              data: this.echartsData.series[0].data
            },
            {
              name: '原因百分比',
              type: 'line',
              yAxisIndex: 1, // 使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用。
              data: (() => {
                let arr = []
                const data = this.echartsData.series[1].data
                for (var i = 0; i < data.length; i++) {
                  let n = 0
                  for (var j = i; j >= 0; j--) {
                    n += data[j]
                  }
                  arr.push(n)
                }
                return arr
              })()
            }
          ],
          xAxis: [
            {
              type: 'category',
              data: this.echartsData.xaxis.data,
              axisLabel: {
                interval: 0,
                rotate: -45
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              scale: true,
              name: '延误工单数量',
              max: this.maxNum,
              min: 0,
              boundaryGap: [0.2, 0.2]
            },
            {
              type: 'value',
              scale: true,
              name: '原因百分比',
              max: 100,
              min: 0,
              boundaryGap: [0.2, 0.2],
              axisLabel: {
                formatter: '{value}%'
              }
            }
          ]
        }
      )
    },
    // 获取红黑单分析图表数据
    getChartData () {
      let { beforeActualReleaseDate, afterActualReleaseDate } = this.searchParams
      // this.searchParams.beforeAdviseReleaseDate = parseInt(moment(beforeAdviseReleaseDate).format('x'))
      // this.searchParams.afterAdviseReleaseDate = parseInt(moment(afterAdviseReleaseDate).format('x'))
      this.searchParams.beforeActualReleaseDate = parseInt(moment(beforeActualReleaseDate).format('x'))
      this.searchParams.afterActualReleaseDate = parseInt(moment(afterActualReleaseDate).format('x'))
      // this.searchParams.beforeTargetDeliveryDate = parseInt(moment(beforeTargetDeliveryDate).format('x'))
      // this.searchParams.afterTargetDeliveryDate = parseInt(moment(afterTargetDeliveryDate).format('x'))
      if (this.searchParams.productionLine === '请选择') {
        this.searchParams.productionLine = ''
      }
      getRedBlackOrderAnalysisChart(this.searchParams).then(
        res => {
          if (res.data.code === 200) {
            this.echartsData = null
            let data = res.data.data
            this.echartsData = data
            let arr = data.series[0].data
            let sum = 0
            for (var i = arr.length - 1; i >= 0; i--) {
              sum += arr[i]
            }
            this.maxNum = Math.ceil(sum / 10) * 10
            this.echarts.init(document.getElementById('myEchart')).dispose()
            this.loadEcharts()
          }
        }
      ).catch(
        err => {
          this.$message.error(err)
        }
      )
    }
  }
}
</script>

<style lang="sass">
  @import 'improvement'
</style>
