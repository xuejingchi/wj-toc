<template>
  <div class="account-setting">
    <div class="title"><span></span>PRO</div>
    <el-button class="btn" @click="$router.back()">返回上一页</el-button>
    <div style="margin-top: 20px;" class="main-list">
      <ul class="header">
        <li class="left">PRO</li>
      </ul>
    </div>
    <div class="table-list">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="skuCode"
          label="SKU编号">
        </el-table-column>
        <el-table-column
          prop="productionOrderCode"
          label="生产订单编号">
        </el-table-column>
        <el-table-column
          prop="serialNumber"
          label="序列号">
        </el-table-column>
        <el-table-column
          prop="quantity"
          label="数量">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 30, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalSize"
      style="text-align:right;margin-top:20px;margin-bottom:20px">
    </el-pagination>
  </div>
</template>

<script>
import { getUserInfo } from '@/utils/auth'
import { findProductionOrderList } from '@/api/front/bufferReport'
export default {
  name: 'accountSetting',
  data () {
    return {
      tableData: [],
      userInfo: getUserInfo(),
      currentInfo: {},
      reasonOptions: [],
      pageSize: 15,
      pageNo: 1,
      totalSize: 1
    }
  },
  computed: {
    queryParams () {
      let params = {
        supplierId: this.userInfo.supplierId,
        workOrderCode: this.$route.query.workOrderCode,
        pageSize: this.pageSize || 15,
        pageNo: this.pageNo || 1
      }
      return params
    }
  },
  created () {
    this.loadData()
  },
  mounted () {
  },
  methods: {
    /*
    * 获取列表数据
    * */
    loadData () {
      findProductionOrderList(this.queryParams).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.tableData = res.data.data.list
          this.totalSize = res.data.data.totalSize
        }
      }, err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="sass">
  @import "index"
</style>
