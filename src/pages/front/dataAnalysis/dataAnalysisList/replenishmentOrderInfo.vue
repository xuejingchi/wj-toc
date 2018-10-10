<template>
  <div class="replenishment-order-info">
    <div class="top">
      <ul class="header">
        <li class="left">查询</li>
        <li class="right">
          <el-button class="btn" @click="findInfoList">查询</el-button>
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
          <span class="label">申请日期:</span>
          <el-date-picker
            class="date"
            v-model="searchParams.afterApplicationDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
          至
          <el-date-picker
            class="date"
            v-model="searchParams.beforeApplicationDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </li>
        <li>
          <span class="label">库存颜色:</span>
          <span class="check-box1" @click="checkedBox(5)">
            <div :class="black ? 'check-box1-active' : ''"><i :class="black ? 'el-icon-triangle' : ''"></i><i :class="black ? 'el-icon-check' : ''"></i></div>
          </span>
          <span class="check-box2" @click="checkedBox(4)">
            <div :class="red ? 'check-box1-active' : ''"><i :class="red ? 'el-icon-triangle' : ''"></i><i :class="red ? 'el-icon-check' : ''"></i></div>
          </span>
          <span class="check-box3" @click="checkedBox(3)">
            <div :class="yellow ? 'check-box1-active' : ''"><i :class="yellow ? 'el-icon-triangle' : ''"></i><i :class="yellow ? 'el-icon-check' : ''"></i></div>
          </span>
          <span class="check-box4" @click="checkedBox(2)">
            <div :class="green ? 'check-box1-active' : ''"><i :class="green ? 'el-icon-triangle' : ''"></i><i :class="green ? 'el-icon-check' : ''"></i></div>
          </span>
          <span class="check-box5" @click="checkedBox(1)">
            <div :class="cyan ? 'check-box1-active' : ''"><i :class="cyan ? 'el-icon-triangle' : ''"></i><i :class="cyan ? 'el-icon-check' : ''"></i></div>
          </span>
        </li>
        <li>
          <span class="label">状态:</span>
          <el-select v-model="searchParams.replenishmentOrderStatus" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </li>
      </ul>
    </div>
    <div class="main">
      <ul class="header">
        <li class="left">报告</li>
        <li class="right">
          <el-button class="ghost-btn" @click="exportInfoList">导出表格</el-button>
        </li>
      </ul>
      <div class="table-box">
        <ul class="table-header">
          <li class="label">补货单号</li>
          <li class="label">SKU编号</li>
          <li class="label">来源位置编号</li>
          <li class="label">目标位置编号</li>
          <li class="label">数量</li>
          <li class="label">申请时间</li>
          <li class="label">库存颜色</li>
          <li class="label">状态</li>
        </ul>
        <ul class="table-list" v-for="item in infoList" :key="item.id">
          <li>{{item.replenishmentOrderCode}}</li>
          <li>{{item.skuCode}}</li>
          <li>{{item.originLocation}}</li>
          <li>{{item.destinationLocation}}</li>
          <li>{{item.quantity}}</li>
          <li>{{item.applicationDate | timeFormat('YYYY-MM-DD')}}</li>
          <li class="color">
            <p class="color-5" v-if="item.inventoryColor === 5">Black</p>
            <p class="color-4" v-if="item.inventoryColor === 4">Red</p>
            <p class="color-3" v-if="item.inventoryColor === 3">Yellow</p>
            <p class="color-2" v-if="item.inventoryColor === 2">Green</p>
            <p class="color-1" v-if="item.inventoryColor === 1">Cyan</p>
          </li>
          <li>
            <p class="status" v-if="item.status === 1">未补货</p>
            <p class="status" v-if="item.status === 2">已补货</p>
          </li>
        </ul>
      </div>
      <div class="toc-pagination" v-if="totalSize">
        <el-pagination
          background
          :page-size="searchParams.pageSize"
          @current-change="pageChange"
          layout="total, prev, pager, next, jumper"
          :total="totalSize">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserInfo } from '@/utils/auth'
import * as funSets from '@/api/front/dataAnalysis'
export default {
  name: 'replenishmentOrderInfo',
  data () {
    return {
      black: false,
      red: false,
      yellow: false,
      green: false,
      cyan: false,
      // 补货单状态
      options: [{
        value: null,
        label: '全部'
      }, {
        value: '1',
        label: '未补货'
      }, {
        value: '2',
        label: '已补货'
      }],
      // 搜索参数
      searchParams: {
        supplierId: getUserInfo().supplierId,
        skuCode: '', // SKU编号
        inventoryColor: [], // 库存颜色
        afterApplicationDate: null, // 开始日期
        beforeApplicationDate: null, // 结束日期
        pageNo: 1,
        pageSize: 50,
        replenishmentOrderStatus: null
      },
      // 补货单信息列表
      infoList: [
        // {
        //   id: '0',
        //   replenishmentOrderCode: '补货单号',
        //   skuCode: 'SKU 编号',
        //   originLocation: '来源位置',
        //   destinationLocation: '目标位置 库存位置',
        //   quantity: 1000,
        //   applicationDate: '2018-06-06',
        //   inventoryColor: 5,
        //   status: 1
        // }
      ],
      totalSize: 0
    }
  },
  beforeMount () {
    this.findInfoList()
  },
  mounted () {
  },
  methods: {
    // 复选框点击事件
    checkedBox (num) {
      switch (num) {
        case 5:
          this.black = !this.black
          break
        case 4:
          this.red = !this.red
          break
        case 3:
          this.yellow = !this.yellow
          break
        case 2:
          this.green = !this.green
          break
        case 1:
          this.cyan = !this.cyan
          break
      }
    },
    // 获取补货单信息列表
    findInfoList () {
      this.searchParams.inventoryColor = []
      if (this.black) {
        this.searchParams.inventoryColor.push(5)
      }
      if (this.red) {
        this.searchParams.inventoryColor.push(4)
      }
      if (this.yellow) {
        this.searchParams.inventoryColor.push(3)
      }
      if (this.green) {
        this.searchParams.inventoryColor.push(2)
      }
      if (this.cyan) {
        this.searchParams.inventoryColor.push(1)
      }
      let startTime = new Date(this.searchParams.afterApplicationDate).getTime()
      let endTime = new Date(this.searchParams.beforeApplicationDate).getTime()
      if (!startTime) {
        startTime = null
      }
      if (!endTime) {
        endTime = null
      }
      this.searchParams.afterApplicationDate = startTime
      this.searchParams.beforeApplicationDate = endTime
      funSets.findReplenishmentOrderList(this.searchParams).then(
        res => {
          if (res.data.code === 200) {
            let data = res.data.data
            this.totalSize = data.totalSize
            this.infoList = data.list
          }
        }
      ).catch(
        err => {
          this.$message.error(err)
        }
      )
    },
    // 导出补货单信息列表
    exportInfoList () {
      const strObj = JSON.stringify(this.searchParams)
      let params = JSON.parse(strObj)
      params.currentAccountId = getUserInfo().accountId
      params.currentAccountName = getUserInfo().accountName
      funSets.exportReplenishWorkOrderList(params).then(
        res => {
          if (res.data.code === 200) {
            console.log(999, res)
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
      this.findInfoList()
    }
  }
}
</script>
<style lang="sass">
  @import "replenishmentOrderInfo"
</style>
