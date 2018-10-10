<template>
  <div class="sku-list">
    <div class="title">SKU信息</div>
    <el-button plain @click="newSku = true">+新建SKU</el-button>
    <el-button plain style="margin-left:20px" @click="goDetail">+导入SKU</el-button>
    <!-- 新建sku1 -->
    <el-dialog
      title="新建SKU"
      :visible.sync="newSku"
      :fullscreen="true"
      width="30%"
      center
      v-loading="creatLoading">
      <div style="margin: 10% auto;width:80%">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="SKU类型：" prop="skuType" style="width:100%">
            <el-select v-model="ruleForm.skuType" placeholder="请选择活动区域">
              <el-option
                v-for="item in skuType"
                :key="item.valueSetLineId"
                :label="item.valueName"
                :value="item.valueName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="SKU编号：" prop="skuCode">
            <el-input v-model="ruleForm.skuCode" clearable></el-input>
          </el-form-item>
          <el-form-item label="SKU描述：" prop="skuDesc">
            <el-input v-model="ruleForm.skuDesc"></el-input>
          </el-form-item>
          <el-form-item label="来源位置编号：" prop="originLocation" style="width:100%">
            <el-select v-model="ruleForm.originLocation" placeholder="请选择活动区域">
              <el-option
                v-for="item in setList"
                :key="item.id"
                :label="item.locationCode"
                :value="item.locationCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生产模式：" prop="makeMode">
            <el-radio-group v-model="ruleForm.makeMode">
              <el-radio label="MTO"></el-radio>
              <el-radio label="MTA"></el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- MTO -->
          <el-form-item v-if="ruleForm.makeMode === 'MTO'" label="新生产周期：" prop="supplyLeadTimeMto" :rules="ruleForm.makeMode === 'MTO' ? rules.supplyLeadTimeMto:[]" style="width:100%">
            <el-select v-model="ruleForm.supplyLeadTimeMto" placeholder="请选择" >
              <el-option
                v-for="(item, index) in productionList"
                :key="index"
                :label="item.valueName"
                :value="item.valueName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="ruleForm.makeMode === 'MTO'" label="目标位置：" prop="targetAddress" :rules="ruleForm.makeMode === 'MTO' ? rules.targetAddress:[]" style="width:100%">
            <el-input v-model="ruleForm.targetAddress"></el-input>
          </el-form-item>
          <!-- MTA -->
          <el-form-item v-if="ruleForm.makeMode === 'MTA'" label="补货周期：" prop="supplyLeadTimeMta" :rules="ruleForm.makeMode === 'MTA' ? rules.supplyLeadTimeMta:[]" style="width:100%">
            <el-select v-model="ruleForm.supplyLeadTimeMta" placeholder="请选择" >
              <el-option
                v-for="(item, index) in productionList"
                :key="index"
                :label="item.valueName"
                :value="item.valueName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="ruleForm.makeMode === 'MTA'" label="目标缓冲库存：" prop="bufferSize" :rules="ruleForm.makeMode === 'MTA' ? rules.bufferSize:[]" style="width:100%">
            <el-input v-model="ruleForm.bufferSize"></el-input>
          </el-form-item>
          <el-form-item v-if="ruleForm.makeMode === 'MTA'" label="目标位置：" prop="destinationLocation" :rules="ruleForm.makeMode === 'MTA' ? rules.destinationLocation:[]" style="width:100%">
            <el-select v-model="ruleForm.destinationLocation" placeholder="请选择活动区域">
              <el-option
                v-for="item in locList"
                :key="item.id"
                :label="item.locationCode"
                :value="item.locationCode">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 正常 -->
          <el-form-item label="销售单位：" prop="saleUnit" style="width:100%">
            <el-select v-model="ruleForm.saleUnit" placeholder="请选择活动区域">
              <el-option
                v-for="(item, index) in saleUnitList"
                :key="index"
                :label="item.valueName"
                :value="item.valueName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="销售单价：" prop="saleUnitPrice">
            <el-input v-model="ruleForm.saleUnitPrice"></el-input>
          </el-form-item>
          <el-form-item label="单位变动成本：" prop="variableCost">
            <el-input v-model="ruleForm.variableCost"></el-input>
          </el-form-item>
          <el-form-item label="报告时间：" prop="reportDate">
            <el-date-picker
              v-model="ruleForm.reportDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button style="width:100%" type="primary" @click="submitForm('ruleForm')">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <div class="search-condition">
      <div class="condition-title clearfix">
        <div class="f-l">查询搜索</div>
        <div class="f-r open-btn">
          <el-button class="search-btn btn" @click="search">查询结果</el-button>
        </div>
      </div>
      <div class="condition clearfix">
        <div class="item">
          <div class="name">SKU类型：</div>
          <div class="value">
            <el-select v-model="skuTypeSearch" placeholder="请选择">
              <el-option :value="pleaseChoose" :label="pleaseChoose">请选择</el-option>
              <el-option
                v-for="item in skuType"
                :key="item.valueSetLineId"
                :label="item.valueName"
                :value="item.valueName">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="item clearfix">
          <div class="name">SKU编号：</div>
          <div class="value">
            <el-input v-model="skuCode" placeholder="请输入SKU编号" clearable></el-input>
          </div>
        </div>
        <div class="item">
          <div class="name">来源位置：</div>
          <div class="value">
            <el-select v-model="originLocation" placeholder="请选择">
              <el-option :value="pleaseChoose" :label="pleaseChoose">请选择</el-option>
              <el-option
                v-for="item in setList"
                :key="item.id"
                :label="item.locationCode"
                :value="item.locationCode">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="item">
          <div class="name">目标位置：</div>
          <div class="value">
            <el-select v-model="destinationLocaion" placeholder="请选择">
              <el-option :value="pleaseChoose" :label="pleaseChoose">请选择</el-option>
              <el-option
                v-for="item in locList"
                :key="item.id"
                :label="item.locationCode"
                :value="item.locationCode">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="item">
          <div class="name">生产类型：</div>
          <div class="value">
            <el-select v-model="makeMode" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <div class="search-list">
      <div class="search-title">列表</div>
      <div class="list">
        <el-table
          :data="skuList"
          border
          style="width: 100%">
          <el-table-column
            prop="skuType"
            label="SKU类型"
            width="">
          </el-table-column>
          <el-table-column
            prop="skuCode"
            label="SKU编号"
            width="">
          </el-table-column>
          <el-table-column
            prop="skuDesc"
            label="SKU描述"
            width="">
          </el-table-column>
          <el-table-column
            prop="originLocation"
            label="位置编号"
            width="">
          </el-table-column>
          <el-table-column
            prop="makeMode"
            label="生产模式"
            width="">
          </el-table-column>
          <el-table-column
            prop="supplyLeadTime"
            label="新生产周期"
            width="">
          </el-table-column>
          <el-table-column
            prop="bufferSize"
            label="目标缓冲库存"
            width="">
          </el-table-column>
          <el-table-column
            prop="saleUnit"
            label="销售单位"
            width="">
          </el-table-column>
          <el-table-column
            prop="saleUnitPrice"
            label="销售单价(元)"
            width="">
          </el-table-column>
          <el-table-column
            prop="variableCost"
            label="单位变动成本"
            width="">
          </el-table-column>
          <el-table-column
            label="报告时间"
            prop="reportDate"
            width="">
            <template slot-scope="scope">
              {{ scope.row.reportDate | timeFormat('YYYY-MM-DD') }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="180">
            <template slot-scope="scope">
              <el-button v-if="scope.row.permissions.sku_modify !== '1'" type="text" @click="modify(scope.row)">修改</el-button>
              <el-button v-if="scope.row.permissions.sku_fullkit_set !== '1'" type="text" @click="setClick(scope.row)">设置齐套元素</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 设置齐套元素 -->
    <el-dialog
      title="设置齐套元素"
      :visible.sync="setShow"
      :fullscreen="true"
      width="30%">
      <div style="margin: 10% auto;width:80%" v-loading="loading">
        <el-form :model="fullKitForm" :rules="fullKitFormRule" ref="fullKitForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="齐套负责人：" prop="fullKitManager">
            <el-input v-model="fullKitForm.fullKitManager"></el-input>
          </el-form-item>
          <el-form-item label="齐套元素：" prop="idList">
            <el-checkbox-group v-model="fullKitForm.idList">
              <div v-for="(item, index) in  fullKitElementList" :key="index">
                <el-checkbox :label="item.id" >{{item.elementName}}</el-checkbox>
              </div>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="subQitao('fullKitForm')">立即提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 修改sku信息 -->
    <el-dialog
      title="修改SKU"
      :visible.sync="modiyfSku"
      :fullscreen="true"
      width="30%"
      center
      v-loading="modifyLoading">
      <div style="margin: 10% auto;width:80%">
        <el-form :model="modifyForm" :rules="modifyRules" ref="modifyForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="SKU类型：" prop="skuType" style="width:100%">
            <el-select v-model="modifyForm.skuType" placeholder="请选择活动区域">
              <el-option
                v-for="item in skuType"
                :key="item.valueSetLineId"
                :label="item.valueName"
                :value="item.valueName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="SKU编号：" prop="skuCode">
            <el-input v-model="modifyForm.skuCode"></el-input>
          </el-form-item>
          <el-form-item label="SKU描述：" prop="skuDesc">
            <el-input v-model="modifyForm.skuDesc"></el-input>
          </el-form-item>
          <el-form-item label="来源位置编号：" prop="originLocation" style="width:100%">
            <el-select v-model="modifyForm.originLocation" placeholder="请选择活动区域">
              <el-option
                v-for="item in setList"
                :key="item.id"
                :label="item.locationCode"
                :value="item.locationCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生产模式：" prop="makeMode">
            <el-radio-group v-model="modifyForm.makeMode">
              <el-radio label="MTO"></el-radio>
              <el-radio label="MTA"></el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- MTO -->
          <el-form-item v-if="modifyForm.makeMode === 'MTO'" label="新生产周期：" prop="supplyLeadTimeMto" :rules="modifyForm.makeMode === 'MTO' ? modifyRules.supplyLeadTimeMto:[]" style="width:100%">
            <el-select v-model="modifyForm.supplyLeadTimeMto" placeholder="请选择" >
              <el-option
                v-for="(item, index) in productionList"
                :key="index"
                :label="item.valueName"
                :value="item.valueName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="modifyForm.makeMode === 'MTO'" label="目标位置：" prop="targetAddress" :rules="modifyForm.makeMode === 'MTO' ? modifyRules.targetAddress:[]" style="width:100%">
            <el-input v-model="modifyForm.targetAddress"></el-input>
          </el-form-item>
          <!-- MTA -->
          <el-form-item v-if="modifyForm.makeMode === 'MTA'" label="补货周期：" prop="supplyLeadTimeMta" :rules="modifyForm.makeMode === 'MTA' ? modifyRules.supplyLeadTimeMta:[]" style="width:100%">
            <el-select v-model="modifyForm.supplyLeadTimeMta" placeholder="请选择" >
              <el-option
                v-for="(item, index) in productionList"
                :key="index"
                :label="item.valueName"
                :value="item.valueName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="modifyForm.makeMode === 'MTA'" label="目标缓冲库存：" prop="bufferSize" :rules="modifyForm.makeMode === 'MTA' ? modifyRules.bufferSize:[]" style="width:100%">
            <el-input v-model="modifyForm.bufferSize" v-if="skuList[0].permissions.sku_buffersize_modify !== '1'"></el-input>
            <div v-else>{{ modifyForm.bufferSize }}</div>
          </el-form-item>
          <el-form-item v-if="modifyForm.makeMode === 'MTA'" label="目标位置：" prop="destinationLocation" :rules="modifyForm.makeMode === 'MTA' ? modifyRules.destinationLocation:[]" style="width:100%">
            <el-select v-model="modifyForm.destinationLocation" placeholder="请选择活动区域">
              <el-option
                v-for="item in locList"
                :key="item.id"
                :label="item.locationCode"
                :value="item.locationCode">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 正常 -->
          <el-form-item label="销售单位：" prop="saleUnit" style="width:100%">
            <el-select v-model="modifyForm.saleUnit" placeholder="请选择活动区域">
              <el-option
                v-for="(item, index) in saleUnitList"
                :key="index"
                :label="item.valueName"
                :value="item.valueSetLineId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="销售单价：" prop="saleUnitPrice">
            <el-input v-model="modifyForm.saleUnitPrice"></el-input>
          </el-form-item>
          <el-form-item label="单位变动成本：" prop="variableCost">
            <el-input v-model="modifyForm.variableCost"></el-input>
          </el-form-item>
          <el-form-item label="报告时间：" prop="reportDate">
            <el-date-picker
              v-model="modifyForm.reportDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button style="width:100%" type="primary" ref="a" @click="submitModify('modifyForm')">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[10, 20, 30, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalSize"
      style="text-align:right;background-color:#FFf;height:80px;padding-top:30px">
    </el-pagination>
  </div>
</template>
<script>
import { findSkuInfoList, findSkuTypeList, findSkuFullKitElementList, findLocationValueSetList, modifySkuFullKitElement, createSkuInfo, modifySkuInfo, getSkuInfoById } from '@/api/front/skuInfo/skuInfo'
import { findProductionLeadTimeList, findSaleUnitList } from '@/api/front/setting/index.js'
import { getUserInfo } from '@/utils/auth'
export default {
  name: 'supplierList',
  data () {
    return {
      totalSize: 0,
      pleaseChoose: '',
      pageNo: 1,
      pageSize: 10,
      creatLoading: false,
      loading: false,
      modifyLoading: false,
      newSku: false, // 新建sku
      modiyfSku: false, // 修改sku
      setShow: false, // 设置齐套元素
      skuTypeSearch: '',
      skuCodeParmas: '',
      skuCode: '',
      originLocation: '',
      destinationLocaion: '',
      makeMode: '',
      prodectModel: '',
      checkList: [],
      skuList: [{ permissions: 0 }],
      userInfo: getUserInfo(),
      skuType: [], // sku类型
      productionList: [], // 周期
      saleUnitList: [], // 销售单位
      setList: [], // 来源位置
      locList: [], // 目标位置
      options: [{
        value: '',
        label: '请选择'
      }, {
        value: 'MTO',
        label: 'MTO'
      }, {
        value: 'MTA',
        label: 'MTA'
      }],
      closeSupplierId: '',
      ruleForm: {
        supplyLeadTimeMto: '', // mto周期
        supplyLeadTimeMta: '', // mta周期
        saleUnit: '', // 销售单位
        skuType: '', // sku类型
        skuCode: '', // sku编号
        skuDesc: '', // sku描述
        targetAddress: '', // mto目标位置
        saleUnitPrice: '', // 销售单价
        variableCost: '', // 变动成本
        reportDate: '', // 报告时间
        makeMode: '', // 生产模式
        bufferSize: '', // mta目标缓冲库存
        originLocation: '', // 来源位置编号
        destinationLocation: '', // mta目标位置
        desc: ''
      },
      modifyForm: {
        supplyLeadTimeMto: '', // mto周期
        supplyLeadTimeMta: '', // mta周期
        saleUnit: '', // 销售单位
        skuType: '', // sku类型
        skuCode: '', // sku编号
        skuDesc: '', // sku描述
        targetAddress: '', // mto目标位置
        saleUnitPrice: '', // 销售单价
        variableCost: '', // 变动成本
        reportDate: '', // 报告时间
        makeMode: '', // 生产模式
        bufferSize: '', // mta目标缓冲库存
        originLocation: '', // 来源位置编号
        destinationLocation: '', // mta目标位置
        desc: ''
      },
      fullKitForm: {
        idList: [],
        fullKitManager: ''
      },
      modifyRules: {
        skuType: [
          { required: true, message: '请选择SKU类型', trigger: 'change' }
        ],
        skuCode: [
          { required: true, message: '请选择SKU编号', trigger: 'change' }
        ],
        makeMode: [
          { required: true, message: '请选择生产模式', trigger: 'change' }
        ],
        supplyLeadTimeMta: [
          { required: true, message: '请选择补货周期', trigger: 'change' }
        ],
        supplyLeadTimeMto: [
          { required: true, message: '请选择生产周期', trigger: 'change' }
        ],
        saleUnit: [
          { required: true, message: '请选择销售单位', trigger: 'change' }
        ],
        bufferSize: [
          { required: true, message: '请输入目标缓冲库存', trigger: 'change' }
        ],
        variableCost: [
          { required: true, message: '请输入单位变动成本', trigger: 'change' }
        ],
        saleUnitPrice: [
          { required: true, message: '请输入销售单价', trigger: 'change' }
        ],
        originLocation: [
          { required: true, message: '请选择来源位置编号', trigger: 'change' }
        ],
        destinationLocation: [
          { required: true, message: '请选目标位置', trigger: 'change' }
        ],
        reportDate: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ]
      },
      rules: {
        skuType: [
          { required: true, message: '请选择SKU类型', trigger: 'change' }
        ],
        skuCode: [
          { required: true, message: '请选择SKU编号', trigger: 'change' }
        ],
        makeMode: [
          { required: true, message: '请选择生产模式', trigger: 'change' }
        ],
        supplyLeadTimeMta: [
          { required: true, message: '请选择补货周期', trigger: 'change' }
        ],
        supplyLeadTimeMto: [
          { required: true, message: '请选择生产周期', trigger: 'change' }
        ],
        saleUnit: [
          { required: true, message: '请选择销售单位', trigger: 'change' }
        ],
        bufferSize: [
          { required: true, message: '请输入目标缓冲库存', trigger: 'change' }
        ],
        variableCost: [
          { required: true, message: '请输入单位变动成本', trigger: 'change' }
        ],
        saleUnitPrice: [
          { required: true, message: '请输入销售单价', trigger: 'change' }
        ],
        originLocation: [
          { required: true, message: '请选择来源位置编号', trigger: 'change' }
        ],
        destinationLocation: [
          { required: true, message: '请选目标位置', trigger: 'change' }
        ],
        reportDate: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ]
      },
      fullKitFormRule: {
        fullKitManager: [
          { required: true, message: '请输入齐套负责人', trigger: 'change' }
        ],
        idList: [
          { type: 'array', required: true, message: '请至少选择一个齐套元素', trigger: 'change' }
        ]
      },
      fullKitElementList: [] // 获取SKU齐套元素列表
    }
  },
  mounted () {
    this.search()
    this.getSkuType() // 获取sku类型
    // this.getFindLocation() // 获取位置来源
    this.findProduction() // 获取周期
    this.findSaleUnitList() // 销售单位
    this.findLocationValue() // 来源位置
    this.findLocationGet() // 目标位置
  },
  methods: {
    // 获取sku类型
    getSkuType () {
      let params = {
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName,
        supplierId: this.userInfo.supplierId
      }
      findSkuTypeList(params).then(res => {
        if (res.data.code === 200) {
          this.skuType = res.data.data
        }
      })
    },
    // 获取来源位置
    findLocationValue () {
      let params = {
        locationTypes: [1, 3],
        supplierId: this.userInfo.supplierId
      }
      findLocationValueSetList(params).then(res => {
        if (res.data.code === 200) {
          this.setList = res.data.data
        }
      })
    },
    // 获取目标位置
    findLocationGet () {
      let params = {
        locationTypes: [4],
        supplierId: this.userInfo.supplierId
      }
      findLocationValueSetList(params).then(res => {
        if (res.data.code === 200) {
          this.locList = res.data.data
        }
      })
    },
    // 获取周期
    findProduction () {
      let params = {
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName,
        supplierId: this.userInfo.supplierId
      }
      findProductionLeadTimeList(params).then(res => {
        if (res.data.code === 200) {
          this.productionList = res.data.data
          console.log(333, res.data.data)
        }
      })
    },
    // 销售单位
    findSaleUnitList () {
      let params = {
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName,
        supplierId: this.userInfo.supplierId
      }
      findSaleUnitList(params).then(res => {
        if (res.data.code === 200) {
          this.saleUnitList = res.data.data
        }
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.search()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.search()
    },
    // 新建供应商
    search () {
      let params = {
        skuType: this.skuTypeSearch,
        skuCode: this.skuCode,
        originLocation: this.originLocation,
        destinationLocation: this.destinationLocaion,
        makeMode: this.makeMode,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        supplierId: this.userInfo.supplierId,
        currentAccountId: getUserInfo().accountId
      }
      findSkuInfoList(params).then(res => {
        if (res.data.code === 200) {
          this.skuList = res.data.data.list
          this.totalSize = parseInt(res.data.data.totalSize)
        }
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.creatLoading = true
          let params = {
            currentAccountId: this.userInfo.accountId,
            currentAccountName: this.userInfo.accountName,
            supplierId: this.userInfo.supplierId,
            supplyLeadTime: this.ruleForm.makeMode === 'MTO' ? parseInt(this.ruleForm.supplyLeadTimeMto) : parseInt(this.ruleForm.supplyLeadTimeMta), // 周期
            saleUnit: this.ruleForm.saleUnit, // 销售单位
            skuType: this.ruleForm.skuType, // sku类型
            skuCode: this.ruleForm.skuCode, // sku编号
            skuDesc: this.ruleForm.skuDesc, // sku描述
            targetAddress: this.ruleForm.makeMode === 'MTO' ? this.ruleForm.targetAddress : '', // mto目标位置
            saleUnitPrice: this.ruleForm.saleUnitPrice, // 销售单价
            variableCost: this.ruleForm.variableCost, // 变动成本
            reportDate: this.ruleForm.reportDate.getTime(), // 报告时间
            makeMode: this.ruleForm.makeMode, // 生产模式
            bufferSize: this.ruleForm.makeMode === 'MTA' ? parseInt(this.ruleForm.bufferSize) : null, // mta目标缓冲库存
            originLocation: this.ruleForm.originLocation, // 来源位置编号
            destinationLocation: this.ruleForm.makeMode === 'MTA' ? this.ruleForm.destinationLocation : '' // mta目标位置
          }
          createSkuInfo(params).then(res => {
            if (res.data.code === 200) {
              this.$message({
                message: '创建成功',
                type: 'success'
              })
              setTimeout(() => {
                this.creatLoading = false
              }, 1000)
              this.$refs.ruleForm.resetFields()
              this.search()
            } else {
              this.creatLoading = false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 修改提交
    submitModify (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.modifyLoading = true
          let params = {
            currentAccountId: this.userInfo.accountId,
            currentAccountName: this.userInfo.accountName,
            supplierId: this.userInfo.supplierId,
            supplyLeadTime: this.modifyForm.makeMode === 'MTO' ? parseInt(this.modifyForm.supplyLeadTimeMto) : parseInt(this.modifyForm.supplyLeadTimeMta), // 周期
            saleUnit: this.modifyForm.saleUnit, // 销售单位
            skuType: this.modifyForm.skuType, // sku类型
            skuCode: this.modifyForm.skuCode, // sku编号
            skuDesc: this.modifyForm.skuDesc, // sku描述
            targetAddress: this.modifyForm.makeMode === 'MTO' ? this.modifyForm.targetAddress : '', // mto目标位置
            saleUnitPrice: this.modifyForm.saleUnitPrice, // 销售单价
            variableCost: this.modifyForm.variableCost, // 变动成本
            reportDate: new Date(this.modifyForm.reportDate).getTime(), // 报告时间
            makeMode: this.modifyForm.makeMode, // 生产模式
            bufferSize: this.modifyForm.makeMode === 'MTA' ? parseInt(this.modifyForm.bufferSize) : null, // mta目标缓冲库存
            originLocation: this.modifyForm.originLocation, // 来源位置编号
            destinationLocation: this.modifyForm.makeMode === 'MTA' ? this.modifyForm.destinationLocation : '' // mta目标位置
          }
          modifySkuInfo(params).then(res => {
            if (res.data.code === 200) {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              setTimeout(() => {
                this.modifyLoading = false
              }, 1000)
              // this.$refs.modifyForm.resetFields()
              this.search()
            } else {
              this.modifyLoading = false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    fromatValue (a) {
      console.log(a)
    },
    setClick (skuCode) {
      this.fullKitForm.fullKitManager = skuCode.fullKitManager
      this.setShow = true
      this.skuCodeParmas = skuCode.skuCode
      this.findSkuFullKitElementList() // 获取SKU齐套元素列表
    },
    modify (row) {
      this.modiyfSku = true
      let params = {
        skuId: row.id
      }
      getSkuInfoById(params).then(res => {
        if (res.data.code === 200) {
          let data = res.data.data
          if (data.makeMode === 'MTO') {
            this.modifyForm.supplyLeadTimeMto = data.supplyLeadTime
          }
          if (data.makeMode === 'MTA') {
            this.modifyForm.supplyLeadTimeMta = data.supplyLeadTime
          }
          this.modifyForm.saleUnit = data.saleUnit
          this.modifyForm.skuType = data.skuType
          this.modifyForm.skuCode = data.skuCode
          this.modifyForm.skuDesc = data.skuDesc
          this.modifyForm.targetAddress = data.targetAddress
          this.modifyForm.saleUnitPrice = data.saleUnitPrice
          this.modifyForm.variableCost = data.variableCost
          // this.modifyForm.reportDate = moment(data.reportDate).format('YYYY-MM-DD')
          this.modifyForm.reportDate = new Date(data.reportDate)
          this.modifyForm.makeMode = data.makeMode
          this.modifyForm.bufferSize = data.bufferSize
          this.modifyForm.originLocation = data.originLocation
          this.modifyForm.destinationLocation = data.destinationLocation
        }
      })
    },
    // 获取SKU齐套元素列表
    findSkuFullKitElementList () {
      this.fullKitForm.idList = []
      let params = {
        skuCode: this.skuCodeParmas,
        supplierId: this.userInfo.supplierId
      }
      findSkuFullKitElementList(params).then(res => {
        if (res.data.code === 200) {
          res.data.data.forEach((item) => {
            if (item.selected === true) {
              this.fullKitForm.idList.push(item.id)
            }
          })
          this.fullKitElementList = res.data.data
        }
      })
    },
    subQitao (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          let params = {
            skuCode: this.skuCodeParmas,
            currentAccountId: this.userInfo.accountId,
            currentAccountName: this.userInfo.accountName,
            supplierId: this.userInfo.supplierId,
            idList: this.fullKitForm.idList,
            fullKitManager: this.fullKitForm.fullKitManager
          }
          modifySkuFullKitElement(params).then(res => {
            if (res.data.code === 200) {
              this.$message({
                message: '创建成功',
                type: 'success'
              })
              setTimeout(() => {
                this.loading = false
              }, 1000)
              this.findSkuFullKitElementList()
              // this.$refs.fullKitForm.resetFields()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    goDetail () {
      this.$router.push({
        path: '/front/dataManage/upload'
      })
    }
  }
}
</script>

<style lang="sass">
  @import "index"
</style>
