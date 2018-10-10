<template>
  <div class="inventory-transaction">
    <div class="list-title clearfix">
      <span class="query-list f-l">查询搜索</span>
      <div class="f-r">
        <span class="query-result">
          <el-button @click="findInventoryStatusDetailList" class="btn">查询搜索</el-button>
        </span>
      </div>
    </div>
    <div class="screen-list">
      <div class="show-query clearfix">
        <div class="form-item w30">
          <div class="name">交易时间:</div>
          <div class="value">
            <el-date-picker
              v-model="query.time.startTime"
              :picker-options="time.startPickerOptions"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
            至
            <el-date-picker
              v-model="query.time.endTime"
              :picker-options="time.endPickerOptions"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </div>
        <div class="form-item w15">
          <div class="name">库存位置:</div>
          <div class="value">
            <el-select v-model="query.location" placeholder="请选择">
              <el-option
                v-for="item in query.locationsOption"
                :key="item.locationCode"
                :label="item.locationCode"
                :value="item.locationCode">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="form-item w20">
          <div class="name">SKU编号:</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="query.skuCode"
              clearable>
            </el-input>
          </div>
        </div>
        <div class="form-item w15">
          <div class="name">交易类型:</div>
          <div class="value">
            <el-select v-model="query.type" placeholder="请选择">
              <el-option
                v-for="item in typesOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <div class="condition-title clearfix">
      <div class="f-l">列表</div>
      <div class="f-r open-btn ghost-btn">
        <span class="search-btn" @click="exportInventoryTransactionDetailList()">导出表格</span>
      </div>
    </div>
    <div class="table-list">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="destinationLocation"
          label="库存位置">
        </el-table-column>
        <el-table-column
          prop="skuCode"
          label="SKU编号">
        </el-table-column>
        <el-table-column
          label="交易类型">
          <template slot-scope="scope">
            <div v-if="scope.row.transactionType === 'IN'">入库</div>
            <div v-if="scope.row.transactionType === 'OUT'">出库</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="quantity"
          label="数量">
        </el-table-column>
        <el-table-column
          label="交易时间">
          <template slot-scope="scope">
            {{ scope.row.transactionDate | timeFormat('YYYY-MM-DD') }}
          </template>
        </el-table-column>
      </el-table>
      <div class="clearfix" style="margin-top: 20px;padding:0 20px 20px 0">
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
import { findInventoryTransactionDetailList, exportInventoryTransactionDetailList } from '@/api/front/dataAnalysis/index'
import { findLocationInfoList } from '@/api/front/setting/index'
import { getUserInfo } from '@/utils/auth'
import moment from 'moment'
export default {
  name: 'inventoryTransaction',
  data () {
    return {
      userInfo: getUserInfo(),
      query: {
        location: '',
        type: '',
        skuCode: '',
        time: {
          startTime: '',
          endTime: ''
        },
        locationsOption: []
      },
      time: {
        startPickerOptions: {
          disabledDate: (val) => {
            if (this.query.time.endTime !== null && this.query.time.endTime !== '' && this.query.time.endTime !== undefined) {
              return val.getTime() > this.query.time.endTime
            }
          }
        },
        endPickerOptions: {
          disabledDate: (val) => {
            if (this.query.time.startTime !== null) {
              return val.getTime() < this.query.time.startTime
            }
          }
        }
      },
      tableData: [],
      pages: {
        currentPage: 1,
        total: 100,
        size: 50
      },
      typesOption: [
        {
          label: '请选择',
          value: ''
        },
        {
          label: '入库',
          value: 'IN'
        },
        {
          label: '出库',
          value: 'OUT'
        }
      ]
    }
  },
  mounted () {
    this.findLocationValueSetList()
    this.findInventoryStatusDetailList()
  },
  methods: {
    exportInventoryTransactionDetailList () {
      let params = {
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName,
        afterDate: parseInt(moment(this.query.time.startTime).format('x')),
        beforeDate: parseInt(moment(this.query.time.endTime).format('x')),
        inventoryLocation: this.query.location === '请选择' ? '' : this.query.location,
        pageNo: this.pages.currentPage,
        pageSize: this.pages.size,
        skuCode: this.query.skuCode,
        transactionType: this.query.type,
        supplierId: this.userInfo.supplierId
      }
      exportInventoryTransactionDetailList(params).then((res) => {
        if (res.data.code === 200) {
          let data = res.data.data
          this.DownloadFile(data.fileUrl, data.fileName)
        }
      })
    },
    findLocationValueSetList () { // 获取位置
      let params = {
        locationTypes: [4],
        supplierId: this.userInfo.supplierId
      }
      findLocationInfoList(params).then((res) => {
        if (res.data.code === 200) {
          this.query.locationsOption = res.data.data
          this.query.locationsOption.unshift({
            currentAccountId: null,
            currentAccountName: null,
            description: '请选择',
            id: '',
            locationCode: '请选择',
            locationType: 1
          })
        }
      })
    },
    handleSizeChange () {},
    handleCurrentChange (val) {
      this.pages.currentPage = val
      this.findInventoryStatusDetailList()
    },
    findInventoryStatusDetailList () {
      let params = {
        afterDate: parseInt(moment(this.query.time.startTime).format('x')),
        beforeDate: parseInt(moment(this.query.time.endTime).format('x')),
        inventoryLocation: this.query.location === '请选择' ? '' : this.query.location,
        pageNo: this.pages.currentPage,
        pageSize: this.pages.size,
        skuCode: this.query.skuCode,
        transactionType: this.query.type,
        supplierId: this.userInfo.supplierId
      }
      findInventoryTransactionDetailList(params).then((res) => {
        let data = res.data.data
        this.pages.total = data.totalSize
        this.pages.size = data.totalSize
        this.tableData = data.inventoryTransactionDetailList
      })
    }
  }
}
</script>
<style lang="sass">
  @import "inventoryTransaction"
</style>
