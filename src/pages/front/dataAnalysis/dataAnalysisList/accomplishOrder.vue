<template>
  <div class="accomplish-order">
    <div class="list-title clearfix">
      <span class="query-list f-l">查询搜索</span>
      <div class="f-r">
        <span class="unfold-screen" v-if="!noneQueryList" @click="handleToggle()">展开筛选</span>
        <span class="unfold-screen" v-if="noneQueryList" @click="handleToggle()">收起筛选</span>
        <span class="query-result">
          <el-button @click="findFinishedWorkOrderList()" class="btn">查询</el-button>
        </span>
      </div>
    </div>
    <div class="screen-list">
      <div class="show-query clearfix">
        <div class="form-item w20">
          <div class="name">工单编号:</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="query.orderNumber"
              clearable>
            </el-input>
          </div>
        </div>
        <div class="form-item w20">
          <div class="name">工单类型:</div>
          <div class="value">
            <el-select v-model="query.orderTypes" placeholder="请选择">
              <el-option
                v-for="item in query.orderTypesOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="form-item w20">
          <div class="name">SKU编号:</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="query.skuNumber"
              clearable>
            </el-input>
          </div>
        </div>
        <div class="form-item w20">
          <div class="name">生产线:</div>
          <div class="value">
            <el-select v-model="query.productionLine" placeholder="请选择">
              <el-option
                v-for="item in query.productionLinesOption"
                :key="item.locationCode"
                :label="item.locationCode"
                :value="item.locationCode">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div v-if="noneQueryList" class="none-query clearfix">
        <div class="form-item w50">
          <div class="name">建议投料时间:</div>
          <div class="value">
            <el-date-picker
              v-model="query.suggest.suggestStartTime"
              :picker-options="oneTime.startPickerOptions"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
            至
            <el-date-picker
              v-model="query.suggest.suggestEndTime"
              :picker-options="oneTime.endPickerOptions"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </div>
        <div class="form-item w50">
          <div class="name">实际投料时间:</div>
          <div class="value">
            <el-date-picker
              v-model="query.practical.practicalStartTime"
              :picker-options="twoTime.startPickerOptions"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
            至
            <el-date-picker
              v-model="query.practical.practicalEndTime"
              :picker-options="twoTime.endPickerOptions"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </div>
        <div class="form-item w50">
          <div class="name">实际交货时间:</div>
          <div class="value">
            <el-date-picker
              v-model="query.delivery.deliveryStartTime"
              :picker-options="threeTime.startPickerOptions"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
            至
            <el-date-picker
              v-model="query.delivery.deliveryEndTime"
              :picker-options="threeTime.endPickerOptions"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </div>
        <div class="form-item w50 clearfix">
          <div class="form-item n-m w50">
            <div class="name">客户:</div>
            <div class="value">
              <el-input
                placeholder="请输入内容"
                v-model="query.customerCode"
                clearable>
              </el-input>
            </div>
          </div>
          <div class="form-item n-m w50">
            <div class="name">销售订单SO编号:</div>
            <div class="value">
              <el-input
                placeholder="请输入内容"
                v-model="query.salesOrder"
                clearable>
              </el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="condition-title clearfix">
      <div class="f-l">列表</div>
      <div class="f-r open-btn ghost-btn">
        <span class="search-btn" @click="exportFinishedWorkOrderList()">导出表格</span>
      </div>
    </div>
    <div class="table-list">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="productionLine"
          label="生产线">
        </el-table-column>
        <el-table-column
          prop="workOrderCode"
          label="工单编号">
        </el-table-column>
        <el-table-column
          prop="workOrderType"
          label="工单类型">
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
          prop="actualReleasedQuantity"
          label="数量">
        </el-table-column>
        <el-table-column
          prop="unit"
          label="单位">
        </el-table-column>
        <el-table-column
          label="建议齐套时间">
          <template slot-scope="scope">
            {{ scope.row.fullKitCompleteTargetDate | timeFormat('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column
          label="齐套完成时间">
          <template slot-scope="scope">
            {{ scope.row.actualFullKitDate }}
          </template>
        </el-table-column>
        <el-table-column
          label="建议投料时间">
          <template slot-scope="scope">
            {{ scope.row.adviseReleasedDate | timeFormat('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column
          label="实际投料时间">
          <template slot-scope="scope">
            {{ scope.row.actualReleasedDate | timeFormat('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column
          label="目标交货时间">
          <template slot-scope="scope">
            {{ scope.row.targetDeliveryDate | timeFormat('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column
          label="实际交货时间">
          <template slot-scope="scope">
            {{ scope.row.actualDeliveryDate | timeFormat('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column
          label="延误时间">
          <template slot-scope="scope">
            {{ scope.row.DelayTime }}
          </template>
        </el-table-column>
        <el-table-column
          prop="customerCode"
          label="客户号">
        </el-table-column>
        <el-table-column
          prop="supplierOrderCode"
          label="SO编号">
        </el-table-column>
      </el-table>
      <div class="clearfix" style="margin-top: 20px;">
        <div class="f-r">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pages.currentPage"
            :page-size="pages.size"
            layout="total, prev, pager, next, jumper"
            :total="pages.total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { findFinishedWorkOrderList, exportFinishedWorkOrderList } from '@/api/front/dataAnalysis/index'
import { findLocationInfoList } from '@/api/front/setting/index'
import { getUserInfo } from '@/utils/auth'
import moment from 'moment'
export default {
  name: 'accomplishOrder',
  data () {
    return {
      userInfo: getUserInfo(),
      query: {
        orderNumber: '',
        orderTypes: '',
        skuNumber: '',
        productionLine: '',
        suggest: {
          suggestStartTime: null,
          suggestEndTime: null
        },
        practical: {
          practicalStartTime: null,
          practicalEndTime: null
        },
        delivery: {
          deliveryStartTime: null,
          deliveryEndTime: null
        },
        productionLinesOption: [],
        orderTypesOption: [
          {
            value: '',
            label: '请选择'
          },
          {
            value: 'MTO',
            label: 'MTO'
          },
          {
            value: 'MTA',
            label: 'MTA'
          },
          {
            value: 'MTA/MTO',
            label: 'MTA/MTO'
          }
        ],
        customerCode: '',
        salesOrder: ''
      },
      oneTime: {
        startPickerOptions: {
          disabledDate: (val) => {
            if (this.query.suggest.suggestEndTime !== null && this.query.suggest.suggestEndTime !== '' && this.query.suggest.suggestEndTime !== undefined) {
              return val.getTime() > this.query.suggest.suggestEndTime
            }
          }
        },
        endPickerOptions: {
          disabledDate: (val) => {
            if (this.query.suggest.suggestStartTime !== null) {
              return val.getTime() < this.query.suggest.suggestStartTime
            }
          }
        }
      },
      twoTime: {
        startPickerOptions: {
          disabledDate: (val) => {
            if (this.query.practical.practicalEndTime !== null && this.query.practical.practicalEndTime !== '' && this.query.practical.practicalEndTime !== undefined) {
              return val.getTime() > this.query.practical.practicalEndTime
            }
          }
        },
        endPickerOptions: {
          disabledDate: (val) => {
            if (this.query.practical.practicalStartTime !== null) {
              return val.getTime() < this.query.practical.practicalStartTime
            }
          }
        }
      },
      threeTime: {
        startPickerOptions: {
          disabledDate: (val) => {
            if (this.query.delivery.deliveryEndTime !== null && this.query.delivery.deliveryEndTime !== '' && this.query.delivery.deliveryEndTime !== undefined) {
              return val.getTime() > this.query.delivery.deliveryEndTime
            }
          }
        },
        endPickerOptions: {
          disabledDate: (val) => {
            if (this.query.delivery.deliveryStartTime !== null) {
              return val.getTime() < this.query.delivery.deliveryStartTime
            }
          }
        }
      },
      pages: {
        currentPage: 1,
        total: null,
        size: 50
      },
      noneQueryList: false,
      tableData: []
    }
  },
  mounted () {
    this.findLocationValueSetList()
    this.findFinishedWorkOrderList()
  },
  methods: {
    exportFinishedWorkOrderList () {
      let params = {
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName,
        pageNo: this.pages.currentPage,
        pageSize: this.pages.size,
        productionLine: this.query.productionLine === '请选择' ? '' : this.query.productionLine,
        adviseAfterDate: parseInt(moment(this.query.suggest.suggestStartTime).format('x')),
        adviseBeforeDate: parseInt(moment(this.query.suggest.suggestEndTime).format('x')),
        customerCode: this.query.customerCode,
        deliveryAfterDate: parseInt(moment(this.query.delivery.deliveryStartTime).format('x')),
        deliveryBeforeDate: parseInt(moment(this.query.delivery.deliveryEndTime).format('x')),
        releasedAfterDate: parseInt(moment(this.query.practical.practicalStartTime).format('x')),
        practicalStartTime: parseInt(moment(this.query.practical.practicalEndTime).format('x')),
        skuCode: this.query.skuNumber,
        supplierId: this.userInfo.supplierId,
        supplierOrderCode: this.query.salesOrder,
        workOrderCode: this.query.orderNumber,
        workOrderType: this.query.orderTypes
      }
      exportFinishedWorkOrderList(params).then((res) => {
        if (res.data.code === 200) {
          let data = res.data.data
          this.DownloadFile(data.fileUrl, data.fileName)
        }
      })
    },
    handleToggle () {
      this.noneQueryList = !this.noneQueryList
    },
    findLocationValueSetList () { // 获取生产线
      let params = {
        locationTypes: [1],
        supplierId: this.userInfo.supplierId
      }
      findLocationInfoList(params).then((res) => {
        if (res.data.code === 200) {
          this.query.productionLinesOption = res.data.data
          this.query.productionLinesOption.unshift({
            currentAccountId: null,
            currentAccountName: null,
            description: '请选择',
            id: '',
            locationCode: '请选择',
            locationType: 4
          })
        }
      })
    },
    handleSizeChange (val) {
    },
    handleCurrentChange (val) {
      this.pages.currentPage = val
      this.findFinishedWorkOrderList()
    },
    findFinishedWorkOrderList () {
      let params = {
        pageNo: this.pages.currentPage,
        pageSize: this.pages.size,
        productionLine: this.query.productionLine === '请选择' ? '' : this.query.productionLine,
        adviseAfterDate: parseInt(moment(this.query.suggest.suggestStartTime).format('x')),
        adviseBeforeDate: parseInt(moment(this.query.suggest.suggestEndTime).format('x')),
        customerCode: this.query.customerCode,
        deliveryAfterDate: parseInt(moment(this.query.delivery.deliveryStartTime).format('x')),
        deliveryBeforeDate: parseInt(moment(this.query.delivery.deliveryEndTime).format('x')),
        releasedAfterDate: parseInt(moment(this.query.practical.practicalStartTime).format('x')),
        practicalStartTime: parseInt(moment(this.query.practical.practicalEndTime).format('x')),
        skuCode: this.query.skuNumber,
        supplierId: this.userInfo.supplierId,
        supplierOrderCode: this.query.salesOrder,
        workOrderCode: this.query.orderNumber,
        workOrderType: this.query.orderTypes
      }
      findFinishedWorkOrderList(params).then((res) => {
        if (res.data.code === 200) {
          let data = res.data.data
          this.pages.total = data.totalSize
          this.pages.size = data.totalSize
          this.tableData = data.workOrderList
        }
      })
    }
  }
}
</script>
<style lang="sass">
  @import "accomplishOrder"
</style>
