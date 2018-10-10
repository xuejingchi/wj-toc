<template>
  <div class="feeding-manage">
    <div class="title">投料排程
    </div>
    <div class="router-box">
      <router-link :to="{path: '/front/feeding'}">需投放工单</router-link>
      <router-link :to="{path: '/front/replenish'}" :class="{'routerCheck': routerCheck}">需补货工单</router-link>
    </div>
    <div class="top">
      <ul class="header">
        <li class="left">查询</li>
        <li class="right">
          <el-button class="btn" @click="search">查询</el-button>
        </li>
      </ul>
      <ul class="body">
        <li>
          <span class="label">来源位置:</span>
          <el-select class="input" v-model="searchParams.originLocation" placeholder="请选择">
            <el-option
              v-for="item in lineType"
              :key="item.valueSetLineId"
              :label="item.locationCode"
              :value="item.locationCode">
            </el-option>
          </el-select>
        </li>
        <li>
          <span class="label">库存位置:</span>
          <el-select class="input" v-model="searchParams.store" placeholder="请选择">
            <el-option
              v-for="item in storeType"
              :key="item.valueSetLineId"
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
        <li>
          <span class="label">申请时间:</span>
          <div class="start-time f-l">
            <el-date-picker
              v-model="searchParams.afterApplicationDate"
              type="date"
              placeholder="开始时间"
              class="start-input"
            >
            </el-date-picker>
          </div>
          <span class="f-l" style="margin-top: 10px;padding: 0 10px;">-</span>
          <div class="f-l end-time">
            <el-date-picker
              v-model="searchParams.beforeApplicationDate"
              type="date"
              placeholder="结束时间"
              class="end-input">
            </el-date-picker>
          </div>
        </li>
        <!--<li>-->
        <!--<span class="label">库存颜色</span>-->
        <!--<span class="check-box5 f-l" @click="checkedBox(5)"><i :class="black ? 'el-icon-check' : ''"></i></span>-->
        <!--</li>-->
        <li>
          <span class="label">库存颜色</span>
          <el-checkbox-group v-model="searchParams.color">
            <div v-for="(item, index) in  colorList" :key="index">
              <el-checkbox :label="item.value" border size="medium" :class="'check-box'+ item.value">{{ item.label }}</el-checkbox>
            </div>
          </el-checkbox-group>
        </li>
      </ul>
    </div>
    <div class="main">
      <ul class="header">
        <li class="left">报告</li>
        <li class="right">
          <el-button class="ghost-btn" @click="downLoad">导出表格</el-button>
        </li>
      </ul>
      <div class="table-box">
        <template>
          <el-table
            :data="replenishList"
            border
            style="width: 100%">
            <el-table-column
              prop="originLocation"
              label="来源位置">
            </el-table-column>
            <el-table-column
              prop="destinationLocation"
              label="库存位置">
            </el-table-column>
            <el-table-column
              prop="replenishmentOrderCode"
              label="补货编号">
            </el-table-column>
            <el-table-column
              prop="skuCode"
              label="SKU编号">
            </el-table-column>
            <el-table-column
              prop="quantity"
              label="数量"
              header-align="left"
              align="right">
            </el-table-column>
            <el-table-column
              prop="applicationDate"
              label="申请时间">
              <template slot-scope="scope">
                {{ scope.row.applicationDate | timeFormat('YYYY-MM-DD') }}
              </template>
            </el-table-column>
            <el-table-column
              prop="inventoryColor"
              label="库存颜色">
              <template slot-scope="scope">
                <span class="dis-b" :class="scope.row.inventoryColor ? 'color-'+ scope.row.inventoryColor : ''"></span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <span class="item-items closeBtn" @click="remove(scope)">已补货，去关闭</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <div class="toc-pagination" v-if="1">
        <el-pagination
          background
          @size-change="sizeChange"
          @current-change="pageChange"
          :page-sizes="[5, 10, 100]"
          :page-size="searchParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalSize">
        </el-pagination>
      </div>
      <el-dialog
        title="关闭补货单"
        :visible.sync="dialogVisible"
        width="30%">
        <span>已经补货，是否关闭该条补货单？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="removeCheck">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as funSets from '@/api/front/feeding'
import { findLocationInfoList } from '@/api/front/setting/index'
import { getUserInfo } from '@/utils/auth'
export default {
  name: 'feeding',
  data () {
    return {
      black: false,
      red: false,
      yellow: false,
      green: false,
      cyan: false,
      skuTypeSearch: [],
      lineType: [], // 生产线
      storeType: [], // 仓库
      colorList: [
        {
          value: 5,
          label: ''
        }, {
          value: 4,
          label: ''
        }, {
          value: 3,
          label: ''
        }, {
          value: 2,
          label: ''
        }, {
          value: 1,
          label: ''
        }
      ], // 颜色
      dateValue: {
        txt: '',
        startTime: '',
        endTime: ''
      },
      // 搜索参数
      searchParams: {
        supplierId: getUserInfo().supplierId,
        originLocation: '', // 来源位置
        store: '', // 仓库位置
        skuCode: '', // SKU编号
        pageNo: 1,
        pageSize: 10,
        afterApplicationDate: '',
        beforeApplicationDate: '',
        color: []
      },
      // 需补货信息列表
      replenishList: [],
      totalSize: 0,
      routerCheck: false,
      dialogVisible: false,
      removeParams: []
    }
  },
  created () {
    let flag = this.$route.path.split('/')
    if (flag[2] === 'replenish') {
      this.routerCheck = true
    }
    this.getLocationList(1)
    this.getStoreList(4)
    this.getReplenishList()
  },
  mounted () {
    // console.log(111111111, getUserInfo())
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
      })
    },
    getStoreList (num) {
      let params = {
        locationType: num,
        supplierId: getUserInfo().supplierId
      }
      findLocationInfoList(params).then(res => {
        this.storeType = res.data.data
      })
    },
    // 复选框点击事件
    checkedBox (id) {
      if (id === 5) {
        this.black = !this.black
      } else if (id === 4) {
        this.red = !this.red
      } else if (id === 3) {
        this.yellow = !this.yellow
      } else if (id === 2) {
        this.green = !this.green
      } else if (id === 1) {
        this.cyan = !this.cyan
      }
    },
    // 页数变化函数
    sizeChange (val) {
      this.searchParams.pageSize = val
      this.getReplenishList()
    },
    // 当前页码发生变化时
    pageChange (val) {
      this.searchParams.pageNo = val
      this.getReplenishList()
    },
    // 获取需补货信息列表
    getReplenishList () {
      let params = {
        supplierId: getUserInfo().supplierId,
        originLocation: this.searchParams.originLocation, // 生产线
        destinationLocation: this.searchParams.store, // 库存位置
        skuCode: this.searchParams.skuCode, // SKU编号
        pageNo: this.searchParams.pageNo,
        pageSize: this.searchParams.pageSize,
        afterApplicationDate: new Date(this.searchParams.afterApplicationDate).getTime(),
        beforeApplicationDate: new Date(this.searchParams.beforeApplicationDate).getTime(),
        inventoryColor: this.searchParams.color,
        replenishmentOrderStatus: 1
      }
      funSets.findReplenishmentOrderList(params).then(
        res => {
          console.log(999, res)
          if (res.data.code === 200) {
            let data = res.data.data
            this.replenishList = data.list
            this.totalSize = data.totalSize
          }
        }
      ).catch(
        err => {
          this.$message.error(err)
        }
      )
    },
    // 导出列表
    downLoad () {
      let params = {
        supplierId: getUserInfo().supplierId,
        originLocation: this.searchParams.originLocation, // 生产线
        destinationLocation: this.searchParams.store, // 库存位置
        skuCode: this.searchParams.skuCode, // SKU编号
        pageNo: this.searchParams.pageNo,
        pageSize: this.searchParams.pageSize,
        afterApplicationDate: new Date(this.searchParams.afterApplicationDate).getTime(),
        beforeApplicationDate: new Date(this.searchParams.beforeApplicationDate).getTime(),
        inventoryColor: this.searchParams.color,
        replenishmentOrderStatus: 1,
        currentAccountId: getUserInfo().accountId,
        currentAccountName: getUserInfo().accountName
      }
      funSets.exportReplenishWorkOrderList(params).then(
        res => {
          if (res.data.code === 200) {
            let data = res.data.data
            window.open(this.ServerHttp + data.fileUrl, '_blank')
          }
        }
      )
    },
    // 点击查询
    search () {
      // this.searchParams.pageNo = 1
      this.getReplenishList()
      console.log(this.searchParams.color)
    },
    // 操作订单
    remove (scope) {
      this.removeParams = {
        currentAccountId: getUserInfo().accountId,
        currentAccountName: getUserInfo().accountName,
        replenishmentOrderId: scope.row.replenishmentOrderCode,
        supplierId: getUserInfo().supplierId
      }
      this.dialogVisible = true
    },
    // 确认删除订单
    removeCheck () {
      funSets.closeReplenishmentOrder(this.removeParams).then((res) => {
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getReplenishList()
        }
      })
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="sass">
  @import 'feeding'
</style>
