<template>
  <div class="unsynchronized">
    <div class="list">
      <div class="list-title">
        查询
        <div class="f-r"><el-button class="search btn" @click="search">查询</el-button></div>
      </div>
      <div class="search-condition clearfix">
        <div class="item clearfix">
          <div class="name">SKU编号:</div>
          <div class="value">
            <el-input v-model="skuCode" placeholder="SKU编号" clearable></el-input>
          </div>
        </div>
        <div class="item clearfix">
          <div class="name">合同开始时间:</div>
          <div class="value">
            <div class="start-time f-l">
              <el-date-picker
                v-model="startParams.contractStartDate"
                type="date"
                placeholder="开始时间"
                class="start-input"
                :picker-options="startTime.startPickerOptions"
              >
              </el-date-picker>
            </div>
            <i class="f-l line">-</i>
            <div class="f-l end-time">
              <el-date-picker
                v-model="startParams.contractEndDate"
                type="date"
                placeholder="结束时间"
                class="end-input"
                :picker-options="startTime.endPickerOptions"
              >
              </el-date-picker>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="list">
      <div class="list-title">
        异常数据
        <span class="warning">*请完善一下数据记录，完善之后在数据上传模块进行重新上传</span>
        <div class="f-r"><el-button class="ghost-btn" @click="exportData">导出表格</el-button></div>
      </div>
      <div class="content">
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="reportDate"
            label="时间"
            width="180">
          </el-table-column>
          <el-table-column
            prop="locationCode"
            label="库存位置"
            width="180">
          </el-table-column>
          <el-table-column
            prop="skuType"
            label="SKU类型">
          </el-table-column>
          <el-table-column
            prop="skuCode"
            label="SKU编号">
          </el-table-column>
          <el-table-column
            prop="skuName"
            label="SKU名称">
          </el-table-column>
        </el-table>
        <el-pagination
          class="f-r"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[50]"
          :page-size="50"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalSize">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getUserInfo } from '@/utils/auth'
import { findNotSyncInventoryStatusList, exportNotSyncInventoryStatusList } from '@/api/front/unsynchronized'
export default {
  name: 'unsynchronizedStock',
  data () {
    return {
      skuCode: '',
      totalSize: 8,
      startParams: {
        contractStartDate: '',
        contractEndDate: ''
      },
      startTime: {
        startPickerOptions: {
          disabledDate: (val) => {
            if (this.startParams.contractEndDate !== null && this.startParams.contractEndDate !== '' && this.startParams.contractEndDate !== undefined) {
              return val.getTime() > this.startParams.contractEndDate
            }
          }
        },
        endPickerOptions: {
          disabledDate: (val) => {
            if (this.startParams.contractStartDate !== null) {
              return val.getTime() < this.startParams.contractStartDate
            }
          }
        }
      },
      tableData: [{
        reportDate: '2016-05-02',
        workOrderType: '123',
        workOrderCode: '1231231231',
        skuCode: '3131412412',
        skuName: '上海'
      }],
      currentPage: 4
    }
  },
  mounted () {
    const data = {
      pageNo: 1,
      pageSize: 50,
      currentAccountId: getUserInfo().accountId,
      supplierId: getUserInfo().supplierId
    }
    this.fetchDataList(data)
  },
  methods: {
    exportData () {
      const data = {
        supplierId: getUserInfo().supplierId,
        currentAccountId: getUserInfo().accountId,
        currentAccountName: getUserInfo().accountName,
        skuCode: this.skuCode,
        afterReportDate: parseInt(moment(this.startParams.contractStartDate).format('x')),
        beforeReportDate: parseInt(moment(this.startParams.contractEndDate).format('x')),
        pageNo: 1,
        pageSize: 50
      }
      exportNotSyncInventoryStatusList(data).then(res => {
        if (res.data.code === 200) {
          const data = res.data.data
          this.DownloadFile(data.fileUrl, data.fileName)
        } else {
          this.$message({
            message: res.data.data,
            type: 'error'
          })
        }
      })
    },
    search () {
      const data = {
        supplierId: getUserInfo().supplierId,
        pageNo: 1,
        pageSize: 50,
        skuCode: this.skuCode,
        currentAccountId: getUserInfo().accountId,
        afterReportDate: parseInt(moment(this.startParams.contractStartDate).format('x')),
        beforeReportDate: parseInt(moment(this.startParams.contractEndDate).format('x'))
      }
      this.fetchDataList(data)
    },
    fetchDataList (data) {
      findNotSyncInventoryStatusList(data).then(res => {
        if (res.data.code === 200) {
          const data = res.data.data
          this.totalSize = data.totalSize
          this.tableData = data.notSyncInventoryStatusVOList
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].reportDate = moment(this.tableData[i].reportDate).format('YYYY-MM-DD')
          }
        } else {
          this.$message({
            message: res.data.data,
            type: 'error'
          })
        }
      })
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      const data = {
        pageSize: 50,
        pageNo: val,
        supplierId: getUserInfo().supplierId,
        skuCode: this.skuCode,
        currentAccountId: getUserInfo().accountId,
        afterReportDate: parseInt(moment(this.startParams.contractStartDate).format('x')),
        beforeReportDate: parseInt(moment(this.startParams.contractEndDate).format('x'))
      }
      this.fetchDataList(data)
    }
  }
}
</script>
<style lang="sass">
  @import "unsynchronized"
</style>
