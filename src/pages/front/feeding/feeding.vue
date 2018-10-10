<template>
  <div class="feeding-manage">
    <div class="title">投料排程
    </div>
    <div class="router-box">
      <router-link :to="{path: '/front/feeding'}" :class="{'routerCheck': routerCheck}">需投放工单</router-link>
      <router-link :to="{path: '/front/replenish'}">需补货工单</router-link>
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
          <span class="label">生产线:</span>
          <el-select class="input" v-model="searchParams.productionLine" placeholder="请选择">
            <el-option
              v-for="item in lineType"
              :key="item.valueSetLineId"
              :label="item.locationCode"
              :value="item.locationCode">
            </el-option>
          </el-select>
        </li>
        <li>
          <span class="label">工单号:</span>
          <el-input
            class="input"
            placeholder=""
            v-model="searchParams.workOrderCode"
            clearable>
          </el-input>
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
          <span class="label">建议投料日期:</span>
          <div class="start-time f-l">
            <el-date-picker
              v-model="searchParams.afterAdviseReleaseDate"
              type="date"
              placeholder="开始时间"
              class="start-input"
            >
            </el-date-picker>
          </div>
          <span class="f-l" style="margin-top: 10px;padding: 0 10px;">-</span>
          <div class="f-l end-time">
            <el-date-picker
              v-model="searchParams.beforeAdviseReleaseDate"
              type="date"
              placeholder="结束时间"
              class="end-input">
            </el-date-picker>
          </div>
        </li>
        <li>
          <span class="label">是否齐套:</span>
          <el-select class="input" v-model="searchParams.status" placeholder="请选择">
            <el-option
              v-for="item in isFinish"
              :key="item.valueSetLineId"
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
          <el-button class="ghost-btn" @click="downLoad">导出表格</el-button>
        </li>
      </ul>
      <div class="table-box">
        <template>
          <el-table
            :data="feedingList"
            border
            style="width: 100%">
            <el-table-column
              prop="originLocation"
              label="生产线">
            </el-table-column>
            <el-table-column
              prop="workOrderCode"
              label="工单号">
            </el-table-column>
            <el-table-column
              prop="skuCode"
              label="sku编号">
            </el-table-column>
            <el-table-column
              prop="skuDesc"
              label="sku描述">
            </el-table-column>
            <el-table-column
              prop="quantity"
              label="工单数量"
              header-align="left"
              align="center">
            </el-table-column>
            <el-table-column
              prop="skuUnit"
              label="单位">
            </el-table-column>
            <el-table-column
              prop="workStatus"
              label="齐套状态">
            </el-table-column>
            <el-table-column
              prop="adviseReleaseDates"
              label="建议投料日期">
            </el-table-column>
            <el-table-column
              prop="customerCode"
              label="客户号">
            </el-table-column>
            <el-table-column
              prop="supplierOrderCode"
              label="So编号">
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
      red: false,
      green: false,
      skuTypeSearch: [],
      lineType: [], // 生产线
      isFinish: [
        {
          value: '',
          label: '请选择'
        }, {
          value: 1,
          label: '是'
        }, {
          value: 2,
          label: '否'
        }
      ], // 是否齐套
      dateValue: {
        txt: '',
        startTime: '',
        endTime: ''
      },
      // 搜索参数
      searchParams: {
        supplierId: getUserInfo().supplierId,
        productionLine: '', // 生产线
        workOrderCode: '', // 工单号
        skuCode: '', // SKU编号
        pageNo: 1,
        pageSize: 10,
        afterAdviseReleaseDate: '',
        beforeAdviseReleaseDate: '',
        status: ''
      },
      // 需投放信息列表
      feedingList: [],
      totalSize: 0,
      routerCheck: false
    }
  },
  created () {
    let flag = this.$route.path.split('/')
    if (flag[2] === 'feeding') {
      this.routerCheck = true
    }
    this.getLocationList(1)
    this.getFeedingList()
  },
  mounted () {
    // console.log(465545, getUserInfo())
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
    // 页数变化函数
    sizeChange (val) {
      this.searchParams.pageSize = val
      this.getFeedingList()
    },
    // 当前页码发生变化时
    pageChange (val) {
      this.searchParams.pageNo = val
      this.getFeedingList()
    },
    // 获取需投放信息列表
    getFeedingList () {
      let params = {
        supplierId: getUserInfo().supplierId,
        productionLine: this.searchParams.productionLine === '请选择' ? '' : this.searchParams.productionLine, // 生产线
        workOrderCode: this.searchParams.workOrderCode, // 工单号
        skuCode: this.searchParams.skuCode, // SKU编号
        pageNo: this.searchParams.pageNo,
        pageSize: this.searchParams.pageSize,
        afterAdviseReleaseDate: new Date(this.searchParams.afterAdviseReleaseDate).getTime(),
        beforeAdviseReleaseDate: new Date(this.searchParams.beforeAdviseReleaseDate).getTime(),
        status: this.searchParams.status || null
      }
      funSets.findNeedToReleaseWorkOrderList(params).then(
        res => {
          console.log(999, res)
          if (res.data.code === 200) {
            let data = res.data.data
            this.feedingList = data.needWorkOrderList
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
        productionLine: this.searchParams.productionLine === '请选择' ? '' : this.searchParams.productionLine, // 生产线
        workOrderCode: this.searchParams.workOrderCode, // 工单号
        skuCode: this.searchParams.skuCode, // SKU编号
        pageNo: this.searchParams.pageNo,
        pageSize: this.searchParams.pageSize,
        afterAdviseReleaseDate: new Date(this.searchParams.afterAdviseReleaseDate).getTime(),
        beforeAdviseReleaseDate: new Date(this.searchParams.beforeAdviseReleaseDate).getTime(),
        status: this.searchParams.status || null,
        currentAccountId: getUserInfo().accountId,
        currentAccountName: getUserInfo().accountName
      }
      funSets.exportNeedToReleaseWorkOrderList(params).then(
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
      this.getFeedingList()
    }
  }
}
</script>

<style lang="sass">
  @import 'feeding'
</style>
