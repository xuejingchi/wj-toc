<template>
  <div class="account-setting">
    <div class="title"><span></span>缓冲报表</div>
    <div class="main-top">
      <ul class="header">
        <li class="left">查询</li>
        <li class="right">
          <span style="margin-right: 30px;" @click="showMoreSearchItems = !showMoreSearchItems">{{ showMoreSearchItems ? '收起' : '展开' }}
            <i :class="[showMoreSearchItems ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i>
          </span>
          <el-button class="btn" @click="doSearch">查询</el-button>
        </li>
      </ul>
      <ul class="body">
        <li>
          <span class="label">生产线:</span>
          <el-select v-model="searchParams.productionLine" placeholder="请选择">
            <el-option label="请选择" value=""></el-option>
            <el-option
              v-for="item in locationInfoList"
              :key="item.id"
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
          <span class="label">缓冲颜色</span>
          <span v-for="(item, index) in bufferColors" class="check-box1" :key="index" :style="{ backgroundColor: item.color }" @click="item.checked = !item.checked">
            <div :class="item.checked ? 'check-box1-active' : ''"><i :class="item.checked ? 'el-icon-triangle' : ''"></i><i :class="item.checked ? 'el-icon-check' : ''"></i></div>
          </span>
        </li>
      </ul>
      <ul v-if="showMoreSearchItems" class="body">
        <li>
          <span class="label">客户号:</span>
          <el-input
            class="input"
            placeholder=""
            v-model="searchParams.customerCode"
            clearable>
          </el-input>
        </li>
        <li>
          <span class="label">销售订单SO编号:</span>
          <el-input
            class="input"
            placeholder=""
            v-model="searchParams.saleOrderCode"
            clearable>
          </el-input>
        </li>
        <li>
          <span class="label">建议投料时间:</span>
          <el-date-picker
            v-model="searchParams.afterAdviseReleaseDate"
            align="right"
            type="date"
            placeholder="YYYY-MM-DD"
            :picker-options="pickerOptionsStart"
            @change="startDateChange('afterAdviseReleaseDate', 'defaultAdviceEndDate', 'advicePickerOptionsEnd')">
          </el-date-picker>
          至
          <el-date-picker
            v-model="searchParams.beforeAdviseReleaseDate"
            align="right"
            type="date"
            placeholder="YYYY-MM-DD"
            :default-value="defaultAdviceEndDate"
            :picker-options="advicePickerOptionsEnd">
          </el-date-picker>
        </li>
      </ul>
      <ul v-if="showMoreSearchItems" class="body">
        <li>
          <span class="label">实际投料时间:</span>
          <el-date-picker
            v-model="searchParams.afterActualReleaseDate"
            align="right"
            type="date"
            placeholder="YYYY-MM-DD"
            :picker-options="pickerOptionsStart"
            @change="startDateChange('afterActualReleaseDate', 'defaultActualEndDate', 'actualPickerOptionsEnd')">
          </el-date-picker>
          至
          <el-date-picker
            v-model="searchParams.beforeActualReleaseDate"
            align="right"
            type="date"
            placeholder="YYYY-MM-DD"
            :default-value="defaultActualEndDate"
            :picker-options="actualPickerOptionsEnd">
          </el-date-picker>
        </li>
        <li>
          <span class="label">红黑单原因:</span>
          <el-select v-model="searchParams.redBlackOrderCauseId" placeholder="请选择">
            <el-option
              v-for="item in redBlackOrderCauseList"
              :key="item.valueSetLineId"
              :label="item.valueName"
              :value="item.valueSetLineId">
            </el-option>
          </el-select>
        </li>
        <li>
          <span class="label">工单类型:</span>
          <el-select v-model="searchParams.makeMode" placeholder="请选择">
            <el-option label="请选择" value=""></el-option>
            <el-option
              key="MTA"
              label="MTA"
              value="MTA">
            </el-option>
            <el-option
              key="MTO"
              label="MTO"
              value="MTO">
            </el-option>
            <el-option
              key="MTA/MTO"
              label="MTA/MTO"
              value="MTA/MTO">
            </el-option>
          </el-select>
        </li>
      </ul>
    </div>
    <div style="margin-top: 20px;" class="main-list">
      <ul class="header">
        <li class="left">报告</li>
        <li class="right">
          <el-button class="ghost-btn" @click="exportBufferReportList">导出表格</el-button>
        </li>
      </ul>
    </div>
    <div class="table-list">
      <el-table
        :data="tableData"
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
          prop="workOrderType"
          label="工单类型">
        </el-table-column>
        <el-table-column
          label="PRO"
          width="80">
          <template slot-scope="scope">
            <span class="item-items" @click="showPRODetail(scope)">PRO</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="skuCode"
          label="SKU编号">
        </el-table-column>
        <el-table-column
          prop="skuDesc"
          label="SKU物料描述"
          width="200">
        </el-table-column>
        <el-table-column
          prop="workOrderQuantity"
          label="工单数量">
        </el-table-column>
        <el-table-column
          prop="unit"
          label="单位">
        </el-table-column>
        <el-table-column
          prop="fullKitting"
          label="齐套状态">
          <template slot-scope="scope">
            {{ parseInt(scope.row.fullKitting, 10) === 1 ? '已齐套' : '未齐套' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="adviseReleasedDate"
          label="建议投料时间"
          width="100">
          <template slot-scope="scope">
            {{ scope.row.adviseReleasedDate | timeFormat('YYYY/MM/DD') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="accountContact"
          label="实际投料时间"
          width="100">
          <template slot-scope="scope">
            {{ scope.row.actualReleasedDate | timeFormat('YYYY/MM/DD') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="customerCode"
          label="客户号">
        </el-table-column>
        <el-table-column
          prop="saleOrderCode"
          label="销售订单SO编号">
        </el-table-column>
        <el-table-column
          prop="bufferColor"
          label="缓冲颜色">
          <template slot-scope="scope">
            <div :style="{ backgroundColor: colorList[scope.row.bufferColor], color: scope.row.bufferColor >= 4 ? '#fff' : '#4A4A4A' }">{{ colorTexts[scope.row.bufferColor] }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="bufferPercent"
          label="缓冲比例">
          <template slot-scope="scope">
            <div :style="{ backgroundColor: colorList[scope.row.bufferColor], color: scope.row.bufferColor >= 4 ? '#fff' : '#4A4A4A' }">{{ scope.row.bufferPercent }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="redOrderCause"
          label="红黑单原因"
          width="180">
          <template slot-scope="scope">
            <el-select v-if="scope.row.bufferColor >= 4 && scope.row.permissions.bufferreport_redblack_fill !== '1'" v-model="scope.row.redBlackVlId" placeholder="请选择原因" @change="modifyRedBlackOrderCause(scope.row)">
              <el-option
                v-for="item in redBlackOrderCauseList"
                :key="item.valueSetLineId"
                :label="item.valueName"
                :value="item.valueSetLineId"
                >
              </el-option>
            </el-select>
            <div v-else>{{ scope.row.redOrderCause }}</div>
          </template>
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
      style="text-align:right;margin-top:20px;margin-bottom:20px;padding-bottom:20px">
    </el-pagination>
  </div>
</template>

<script>
import * as funSets from '@/api/front/bufferReport'
import { getUserInfo } from '@/utils/auth'
import moment from 'moment'
export default {
  name: 'accountSetting',
  data () {
    return {
      red: false,
      green: false,
      tableData: [],
      userInfo: getUserInfo(),
      currentInfo: {},
      reasonOptions: [],
      pageSize: 10,
      pageNo: 1,
      searchParams: {
        productionLine: '',
        workOrderCode: '',
        skuCode: '',
        customerCode: '',
        saleOrderCode: '',
        beforeAdviseReleaseDate: '',
        afterAdviseReleaseDate: '',
        beforeActualReleaseDate: '',
        afterActualReleaseDate: '',
        redBlackOrderCauseId: '',
        makeMode: ''
      },
      showMoreSearchItems: false,
      totalSize: 0,
      pickerOptionsStart: {
        disabledDate (time) {
          return ''
        }
      },
      advicePickerOptionsEnd: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 1000 * 60 * 60 * 24
        }
      },
      actualPickerOptionsEnd: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 1000 * 60 * 60 * 24
        }
      },
      defaultAdviceEndDate: new Date(),
      defaultActualEndDate: new Date(),
      locationInfoList: [],
      redBlackOrderCauseList: [],
      bufferColors: [{
        color: '#000000',
        checked: false,
        value: 5
      }, {
        color: '#FF3939',
        checked: false,
        value: 4
      }, {
        color: '#FEFF3C',
        checked: false,
        value: 3
      }, {
        color: '#ACFF3C',
        checked: false,
        value: 2
      }, {
        color: '#00FFFF',
        checked: false,
        value: 1
      }],
      colorList: ['', '#00FFFF', '#ACFF3C', '#FEFF3C', '#FF3939', '#000000'],
      colorTexts: ['', 'Cyan', 'Green', 'Yellow', 'Red', 'Black']
    }
  },
  computed: {
    queryParams () {
      let params = {
        supplierId: this.userInfo.supplierId,
        currentAccountId: this.userInfo.accountId,
        pageSize: this.pageSize || 15,
        pageNo: this.pageNo
      }
      return params
    },
    /*
    * 选中的颜色
    * */
    selectedColors () {
      let arr = []
      console.log(11, arr)
      this.bufferColors.forEach(item => {
        if (item.checked) {
          arr.push(item.value)
        }
      })
      console.log(22, arr)
      return arr
    }
  },
  created () {
    this.findLocationInfoList()
    this.findRedBlackOrderCauseList()
  },
  mounted () {
  },
  methods: {
    /*
    * 获取生厂商位置
    * */
    findLocationInfoList () {
      funSets.findLocationInfoList({
        supplierId: this.userInfo.supplierId,
        locationType: 1
      }).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.locationInfoList = res.data.data
        }
      })
    },
    /*
    * 获取红黑单原因
    * */
    findRedBlackOrderCauseList () {
      funSets.findRedBlackOrderCauseList({
        supplierId: this.userInfo.supplierId,
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName
      }).then(res => {
        if (res.data.code === 200) {
          this.redBlackOrderCauseList = res.data.data
          this.redBlackOrderCauseList.unshift({
            permissions: '',
            remark: null,
            valueName: '请选择原因',
            valueSetLineId: ''
          })
          // 加载完红黑单原因后加载列表数据
          this.loadData()
        }
      })
    },
    /*
    * 开始日期改变
    * */
    startDateChange (startKey, endKey, options) {
      // 结束日期默认值
      this[endKey] = this.searchParams[startKey]
      // 结束日期不可选赋值
      this[options].disabledDate = time => {
        return time.getTime() < this.searchParams[startKey].getTime()
      }
    },
    /*
    * 获取列表数据
    * */
    loadData () {
      let params = Object.assign({}, this.queryParams, this.searchParams)
      let filterParams = {}
      Object.keys(params).forEach(key => {
        if (params[key]) {
          filterParams[key] = params[key]
        }
      })
      filterParams.filterParams = this.getRedOrderCauseById(this.searchParams.redBlackOrderCauseId)
      if (filterParams.beforeAdviseReleaseDate && filterParams.beforeAdviseReleaseDate.getTime()) {
        filterParams.beforeAdviseReleaseDate = filterParams.beforeAdviseReleaseDate.getTime()
      }
      if (filterParams.afterAdviseReleaseDate && filterParams.afterAdviseReleaseDate.getTime()) {
        filterParams.afterAdviseReleaseDate = filterParams.afterAdviseReleaseDate.getTime()
      }
      if (filterParams.beforeActualReleaseDate && filterParams.beforeActualReleaseDate.getTime()) {
        filterParams.beforeActualReleaseDate = filterParams.beforeActualReleaseDate.getTime()
      }
      if (filterParams.afterActualReleaseDate && filterParams.afterActualReleaseDate.getTime()) {
        filterParams.afterActualReleaseDate = filterParams.afterActualReleaseDate.getTime()
      }
      filterParams.currentAccountId = getUserInfo().accountId
      filterParams.filterParams = filterParams.filterParams === '请选择原因' ? '' : filterParams.filterParams
      funSets.findBufferReportList(filterParams).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.totalSize = res.data.data.totalSize
          let listData = res.data.data.list
          if (listData === null) {
            this.tableData = []
            return
          }
          listData.forEach(item => {
            item.redBlackVlId = item.bufferColor === 4 ? item.rocVlId : item.bocVlId
          })
          this.tableData = listData
        }
      }, err => {
        console.log(err)
      })
    },
    // 导出动态缓冲信息列表
    exportBufferReportList () {
      const params = Object.assign({}, this.searchParams, {
        beforeAdviseReleaseDate: parseInt(moment(this.searchParams.beforeAdviseReleaseDate).format('x')),
        afterAdviseReleaseDate: parseInt(moment(this.searchParams.afterAdviseReleaseDate).format('x')),
        beforeActualReleaseDate: parseInt(moment(this.searchParams.beforeActualReleaseDate).format('x')),
        afterActualReleaseDate: parseInt(moment(this.searchParams.afterActualReleaseDate).format('x'))
      })
      params.currentAccountId = getUserInfo().accountId
      params.currentAccountName = getUserInfo().accountName
      params.supplierId = getUserInfo().supplierId
      delete params.pageNo
      funSets.exportBufferReportList(params).then(
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
    /*
    * 页码修改
    * */
    handleCurrentChange (val) {
      this.pageNo = val
      this.loadData()
    },
    /*
    * 单页修改
    * */
    handleSizeChange (val) {
      this.pageSize = val
      this.loadData()
    },
    /*
    * 查询
    * */
    doSearch () {
      if (this.selectedColors) {
        // this.searchParams.bufferColors = JSON.stringify(this.selectedColors)
        this.searchParams.bufferColors = this.selectedColors
      }
      this.loadData()
    },
    /*
    * 展示 PRO 详情
    * */
    showPRODetail (scope) {
      this.$router.push({
        path: 'pro',
        query: {
          workOrderCode: scope.row.workOrderCode
        }
      })
    },
    /*
    * 设置红黑单原因
    * */
    modifyRedBlackOrderCause (value) {
      // 判断是否有值
      if (!value.redBlackVlId) {
        return false
      }
      funSets.modifyRedBlackOrderCause({
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName,
        supplierId: this.userInfo.supplierId,
        workOrderCode: value.workOrderCode,
        redBlackOrderCauseId: value.redBlackVlId,
        redBlackOrderCause: this.getRedOrderCauseById(value.redBlackVlId),
        type: value.bufferColor === 5 ? 2 : 1
      }).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.$message.success({
            message: '设置红黑单原因成功！'
          })
        }
      })
    },
    /*
    * 获取红黑单原因文字
    * */
    getRedOrderCauseById (id) {
      let cause = ''
      this.redBlackOrderCauseList.forEach(item => {
        if (item.valueSetLineId === id) {
          cause = item.valueName
        }
      })
      return cause
    }
  }
}
</script>
<style lang="sass">
  @import "index"
</style>
