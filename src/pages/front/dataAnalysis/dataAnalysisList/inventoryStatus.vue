<template>
  <div class="inventory-status">
    <div class="list-title clearfix">
      <span class="query-list f-l">查询搜索</span>
      <div class="f-r">
        <span class="query-result">
          <el-button @click="findInventoryStatusDetailList()" class="btn">查询</el-button>
        </span>
      </div>
    </div>
    <div class="screen-list">
      <div class="show-query clearfix">
        <div class="form-item w33">
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
        <div class="form-item w33">
          <div class="name">SKU类型:</div>
          <div class="value">
            <el-select v-model="query.skuType" placeholder="请选择">
              <el-option
                v-for="item in typesOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="form-item w33">
          <div class="name">SKU编号:</div>
          <div class="value">
            <el-input
              placeholder="请输入内容"
              v-model="query.skuCode"
              clearable>
            </el-input>
          </div>
        </div>
      </div>
      <div class="show-query clearfix">
        <div class="form-item w55">
          <div class="name">时间:</div>
          <div class="value">
            <el-date-picker
              v-model="query.time.startTime"
              type="date"
              :picker-options="time.startPickerOptions"
              placeholder="选择日期">
            </el-date-picker>
            至
            <el-date-picker
              v-model="query.time.endTime"
              type="date"
              :picker-options="time.endPickerOptions"
              placeholder="选择日期">
            </el-date-picker>
          </div>
        </div>
        <div class="form-item w35">
          <div class="name" style="width: 120px">在库库存颜色:</div>
          <div class="value">
            <el-checkbox-group v-model="query.checkList" @change="handleCheckedCitiesChange">
              <el-checkbox label="5" class="color-black"></el-checkbox>
              <el-checkbox label="4" class="color-red"></el-checkbox>
              <el-checkbox label="3" class="color-yellow"></el-checkbox>
              <el-checkbox label="2" class="color-green"></el-checkbox>
              <el-checkbox label="1" class="color-cyan"></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
    </div>
    <div class="condition-title clearfix">
      <div class="f-l">列表</div>
      <div class="f-r open-btn ghost-btn">
        <span class="search-btn" @click="exportInventoryStatusDetailList()">导出表格</span>
      </div>
    </div>
    <div class="table-list">
      <el-table
        :data="inventoryStatusDetailTableData"
        border
        style="width: 100%">
        <el-table-column
          prop="destinationLocation"
          label="库存位置">
        </el-table-column>
        <el-table-column
          label="时间">
          <template slot-scope="scope">
            {{ scope.row.reportDate | timeFormat('YYYY-MM-DD') }}
          </template>
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
          prop="skuDesc"
          label="SKU描述">
        </el-table-column>
        <el-table-column
          prop="currentInventory"
          label="在库库存">
        </el-table-column>
        <el-table-column
          prop="targetInventory"
          label="目标库存">
        </el-table-column>
        <el-table-column
          label="在库库存颜色">
          <template slot-scope="scope">
            <div class="color-item black" v-if="scope.row.inventoryColor === 5">Black</div>
            <div class="color-item red" v-if="scope.row.inventoryColor === 4">Red</div>
            <div class="color-item yellow" v-if="scope.row.inventoryColor === 3">Yellow</div>
            <div class="color-item green" v-if="scope.row.inventoryColor === 2">Green</div>
            <div class="color-item cyan" v-if="scope.row.inventoryColor === 1">Cyan</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="clearfix2" style="margin-top: 20px;">
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
import { findInventoryStatusDetailList, exportInventoryStatusDetailList } from '@/api/front/dataAnalysis/index'
import { findLocationInfoList } from '@/api/front/setting/index'
import { getUserInfo } from '@/utils/auth'
import moment from 'moment'
export default {
  name: 'inventoryStatus',
  data () {
    return {
      userInfo: getUserInfo(),
      query: {
        location: '',
        skuType: '',
        skuCode: '',
        time: {
          startTime: null,
          endTime: null
        },
        checkList: [],
        locationsOption: []
      },
      inventoryStatusDetailTableData: [],
      pages: {
        currentPage: 1,
        total: null,
        size: 50
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
      typesOption: [
        {
          label: '请选择',
          value: ''
        },
        {
          label: '成品',
          value: 'FG'
        },
        {
          label: '半成品',
          value: 'SFG'
        },
        {
          label: '原材料',
          value: 'RM'
        }
      ]
    }
  },
  mounted () {
    this.findLocationValueSetList()
    this.findInventoryStatusDetailList()
  },
  methods: {
    exportInventoryStatusDetailList () {
      let params = {
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName,
        afterDate: parseInt(moment(this.query.time.startTime).format('x')),
        beforeDate: parseInt(moment(this.query.time.endTime).format('x')),
        inventoryColor: this.query.checkList,
        inventoryLocation: this.query.location === '请选择' ? '' : this.query.location,
        pageNo: this.pages.currentPage,
        pageSize: this.pages.size,
        skuCode: this.query.skuCode,
        skuType: this.query.skuType,
        supplierId: this.userInfo.supplierId
      }
      exportInventoryStatusDetailList(params).then((res) => {
        if (res.data.code === 200) {
          let data = res.data.data
          this.DownloadFile(data.fileUrl, data.fileName)
        }
      })
    },
    handleCheckedCitiesChange (val) {
      this.query.checkList = val
    },
    handleSizeChange (val) {
      console.log(111, val)
    },
    handleCurrentChange (val) {
      this.pages.currentPage = val
      this.findInventoryStatusDetailList()
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
    findInventoryStatusDetailList () {
      let params = {
        beforeDate: parseInt(moment(this.query.time.startTime).format('x')),
        afterDate: parseInt(moment(this.query.time.endTime).format('x')),
        inventoryColor: this.query.checkList,
        inventoryLocation: this.query.location === '请选择' ? '' : this.query.location,
        pageNo: this.pages.currentPage,
        pageSize: this.pages.size,
        skuCode: this.query.skuCode,
        skuType: this.query.skuType,
        supplierId: this.userInfo.supplierId
      }
      findInventoryStatusDetailList(params).then((res) => {
        let data = res.data.data
        console.log(11, data)
        this.pages.total = data.totalSize
        this.inventoryStatusDetailTableData = data.inventoryStatusDetailList
      })
    }
  }
}
</script>
<style lang="sass">
  @import "inventoryStatus"
</style>
