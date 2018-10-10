<template>
  <div class="violate-rule">
    <div class="list">
      <div class="list-title">
        查询
        <div class="f-r"><el-button class="btn" @click="search">查询</el-button></div>
      </div>
      <div class="search-condition clearfix">
        <div class="item clearfix">
          <div class="name">工单号:</div>
          <div class="value">
            <el-input v-model="workOrderCode" placeholder="工单编号" clearable></el-input>
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
        <div class="item">
          <div class="name">合同结束时间:</div>
          <div class="value">
            <div class="start-time f-l">
              <el-date-picker
                v-model="endParams.contractStartDate"
                type="date"
                placeholder="开始时间"
                class="start-input"
                :picker-options="endTime.startPickerOptions"
              >
              </el-date-picker>
            </div>
            <i class="f-l line">-</i>
            <div class="f-l end-time">
              <el-date-picker
                v-model="endParams.contractEndDate"
                type="date"
                placeholder="结束时间"
                class="end-input"
                :picker-options="endTime.endPickerOptions"
              >
              </el-date-picker>
            </div>
          </div>
        </div>
        <div class="item clearfix">
          <div class="name">违反原因:</div>
          <div class="value">
            <el-select v-model="violationCause" placeholder="违反原因">
              <el-option
                v-for="item in options"
                :key="item.valueSetLineId"
                :label="item.valueName"
                :value="item.valueName">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <div class="list">
      <div class="list-title">
        报告
        <div class="f-r ghost-btn open-btn"><span class="search" @click="exportData">导出表格</span></div>
      </div>
      <div class="search-condition list-bottom" v-loading="loading">
        <el-table
          :data="tableData"
          style="width: 100%;text-align: center">
          <el-table-column
            prop="workOrderCode"
            label="工单号">
          </el-table-column>
          <el-table-column
            prop="skuCode"
            label="SKU编号">
          </el-table-column>
          <el-table-column
            prop="skuDesc"
            label="SKU描述">
          </el-table-column>
          <el-table-column
            prop="customerCode"
            label="客户号">
          </el-table-column>
          <el-table-column
            prop="adviseReleaseDate"
            label="建议投料时间">
          </el-table-column>
          <el-table-column
            prop="actualReleaseDate"
            label="实际投料时间">
          </el-table-column>
          <el-table-column
            prop="quantity"
            label="数量">
          </el-table-column>
          <el-table-column
            prop="violationDate"
            label="违反时间">
          </el-table-column>
          <el-table-column
            prop="violationCause"
            label="违反原因"
            width="220"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.violationCause !== null">{{ scope.row.violationCause}}</span>
              <div v-else>
                <el-select v-model="scope.row.selectViolationCause" style="width: 100px;">
                  <el-option
                    v-for="(item, index) in options"
                    :key="item.valueSetLineId"
                    :label="item.valueName"
                    :value="index">
                  </el-option>
                </el-select>
                <el-button type="text" @click="chooseReason(scope.row)">确定</el-button>
              </div>
            </template>
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
import { findViolationRopeRuleList, exportViolationRopeRuleList, modifyBeforehandFeedingCause } from '@/api/front/dataAnalysis'
import { findBeforehandFeedingCauseList } from '@/api/front/setting'
export default {
  name: 'violateRule',
  data () {
    return {
      loading: false,
      workOrderCode: '',
      violationCause: '',
      startParams: {
        contractStartDate: '',
        contractEndDate: ''
      },
      endParams: {
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
      endTime: {
        startPickerOptions: {
          disabledDate: (val) => {
            if (this.endParams.contractEndDate !== null && this.endParams.contractEndDate !== '' && this.endParams.contractEndDate !== undefined) {
              return val.getTime() > this.endParams.contractEndDate
            }
          }
        },
        endPickerOptions: {
          disabledDate: (val) => {
            if (this.endParams.contractStartDate !== null) {
              return val.getTime() < this.endParams.contractStartDate
            }
          }
        }
      },
      options: [],
      tableData: [],
      currentPage: 1,
      totalSize: 2
    }
  },
  mounted () {
    const data = {
      pageNo: 1,
      pageSize: 50,
      supplierId: getUserInfo().supplierId
    }
    const params = {
      currentAccountId: getUserInfo().accountId,
      currentAccountName: getUserInfo().accountName,
      supplierId: getUserInfo().supplierId
    }
    this.fetchDataList(data)
    findBeforehandFeedingCauseList(params).then(res => {
      this.options = res.data.data
      this.options.unshift({
        permissions: '',
        remark: '',
        valueName: '请选择',
        valueSetLineId: ''
      })
    })
  },
  methods: {
    fetchDataList (data) {
      findViolationRopeRuleList(data).then(res => {
        this.loading = false
        if (res.data.code === 200) {
          const data = res.data.data
          this.totalSize = data.totalSize
          this.currentPage = data.pageNo
          this.tableData = data.list
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].adviseReleaseDate = moment(this.tableData[i].adviseReleaseDate).format('YYYY-MM-DD HH:MM')
            this.tableData[i].actualReleaseDate = moment(this.tableData[i].actualReleaseDate).format('YYYY-MM-DD HH:MM')
          }
        } else {
          this.$message({
            message: res.data.data,
            type: 'error'
          })
        }
      })
    },
    exportData () {
      const data = {
        supplierId: getUserInfo().supplierId,
        pageNo: this.currentPage,
        pageSize: 50,
        beforeAdviseReleaseDate: parseInt(moment(this.startParams.contractStartDate).format('x')),
        afterAdviseReleaseDate: parseInt(moment(this.startParams.contractEndDate).format('x')),
        beforeActualReleaseDate: parseInt(moment(this.endParams.contractStartDate).format('x')),
        afterActualReleaseDate: parseInt(moment(this.endParams.contractEndDate).format('x')),
        violationCause: this.violationCause === '请选择' ? '' : this.violationCause,
        workOrderCode: this.workOrderCode
      }
      exportViolationRopeRuleList(data).then(res => {
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
    chooseReason (index) {
      const data = {
        bfCause: this.options[index.selectViolationCause].valueName,
        bfCauseId: this.options[index.selectViolationCause].valueSetLineId,
        supplierId: getUserInfo().supplierId,
        workOrderCode: index.workOrderCode
      }
      modifyBeforehandFeedingCause(data).then(res => {
        if (res.data.code === 200) {
          this.$alert('修改成功', {
            confirmButtonText: '确定',
            callback: () => {
              window.location.reload()
            }
          })
        } else {
          this.$message({
            message: res.data.data,
            type: 'error'
          })
        }
      })
    },
    search () {
      this.loading = true
      const data = {
        pageNo: 1,
        pageSize: 50,
        supplierId: getUserInfo().supplierId,
        beforeAdviseReleaseDate: parseInt(moment(this.startParams.contractStartDate).format('x')),
        afterAdviseReleaseDate: parseInt(moment(this.startParams.contractEndDate).format('x')),
        beforeActualReleaseDate: parseInt(moment(this.endParams.contractStartDate).format('x')),
        afterActualReleaseDate: parseInt(moment(this.endParams.contractEndDate).format('x')),
        violationCause: this.violationCause === '请选择' ? '' : this.violationCause,
        workOrderCode: this.workOrderCode
      }
      this.fetchDataList(data)
    },
    handleSizeChange () {
    },
    handleCurrentChange (val) {
      const data = {
        supplierId: getUserInfo().supplierId,
        pageNo: val,
        pageSize: 50,
        beforeAdviseReleaseDate: parseInt(moment(this.startParams.contractStartDate).format('x')),
        afterAdviseReleaseDate: parseInt(moment(this.startParams.contractEndDate).format('x')),
        beforeActualReleaseDate: parseInt(moment(this.endParams.contractStartDate).format('x')),
        afterActualReleaseDate: parseInt(moment(this.endParams.contractEndDate).format('x')),
        violationCause: this.violationCause === '请选择' ? '' : this.violationCause,
        workOrderCode: this.workOrderCode
      }
      this.fetchDataList(data)
    }
  }
}
</script>
<style lang="sass">
  @import "violateRule"
</style>
