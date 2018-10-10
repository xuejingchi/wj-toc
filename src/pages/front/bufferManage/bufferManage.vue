<template>
  <div class="buffer-manage">
    <div class="title">动态缓冲管理</div>
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
          <span class="label">缓冲颜色</span>
          <span class="check-box1" @click="checkedBox(1)">
           <div :class="red ? 'check-box1-active' : ''"><i :class="red ? 'el-icon-triangle' : ''"></i><i :class="red ? 'el-icon-check' : ''"></i></div>
          </span>
          <span class="check-box2" @click="checkedBox(2)">
           <div :class="green ? 'check-box1-active' : ''"><i :class="green ? 'el-icon-triangle' : ''"></i><i :class="green ? 'el-icon-check' : ''"></i></div>
          </span>
        </li>
      </ul>
    </div>
    <div class="main">
      <ul class="header">
        <li class="left">报告</li>
        <li class="right">
          <el-button class="ghost-btn" @click="exportDynamicBufferInfoList">导出表格</el-button>
        </li>
      </ul>
      <div class="table-box">
        <ul class="table-header">
          <li class="label">SKU编号</li>
          <li class="label">仓库编号</li>
          <li class="label">来源位置编号</li>
          <li class="label">补货周期</li>
          <li class="label">建议调整库存</li>
        </ul>
        <ul class="table-list" v-for="item in bufferList" :key="item.id">
          <li>{{item.skuCode}}</li>
          <li>{{item.repositoryCode}}</li>
          <li>{{item.originLocationCode}}</li>
          <li>{{item.supplyLeadTime}}</li>
          <li>
            {{item.bufferSize}}
            <span @click="goDetail(item.skuCode,item.bufferSize)">(查看每日库存)</span>
          </li>
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
  </div>
</template>

<script>
import * as funSets from '@/api/front/bufferManage'
import { getUserInfo } from '@/utils/auth'
export default {
  name: 'bufferManage',
  data () {
    return {
      red: false,
      green: false,
      // 搜索参数
      searchParams: {
        supplierId: getUserInfo().supplierId,
        skuCode: '', // SKU编号
        bufferColor: [], // 缓冲色值数组
        pageNo: 1,
        pageSize: 50
      },
      // 动态缓冲信息列表
      bufferList: [],
      totalSize: 0
    }
  },
  beforeMount () {
    this.getBufferList()
  },
  mounted () {
    console.log(465545, getUserInfo())
  },
  methods: {
    // 复选框点击事件
    checkedBox (id) {
      if (id === 1) {
        this.red = !this.red
      } else {
        this.green = !this.green
      }
    },
    // 当前页码发生变化时
    pageChange (val) {
      this.searchParams.pageNo = val
      this.getBufferList()
    },
    // 获取动态缓冲信息列表
    getBufferList () {
      let bufferColor = []
      if (this.red) {
        bufferColor.push(4)
      }
      if (this.green) {
        bufferColor.push(2)
      }
      this.searchParams.bufferColor = bufferColor
      funSets.findDynamicBufferInfoList(this.searchParams).then(
        res => {
          if (res.data.code === 200) {
            let data = res.data.data
            this.bufferList = data.list
            this.totalSize = data.totalSize
          }
        }
      ).catch(
        err => {
          this.$message.error(err)
        }
      )
    },
    // 导出动态缓冲信息列表
    exportDynamicBufferInfoList () {
      const strObj = JSON.stringify(this.searchParams)
      const params = JSON.parse(strObj)
      params.currentAccountId = getUserInfo().accountId
      params.currentAccountName = getUserInfo().accountName
      delete params.pageNo
      funSets.exportDynamicBufferInfoList(params).then(
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
    // 点击查询
    search () {
      this.searchParams.pageNo = 1
      this.getBufferList()
    },
    // 跳转至每日明细列表
    goDetail (skuCode, bufferSize) {
      this.$router.push({
        path: '/front/repertoryDetail',
        query: {
          skuCode: skuCode,
          bufferSize: bufferSize
        }
      })
    }
  }
}
</script>

<style lang="sass">
  @import 'bufferManage'
</style>
