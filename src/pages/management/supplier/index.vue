<template>
  <div class="supplier-list">
    <div class="title">供应商基础信息管理</div>
    <el-button class="add-btn" type="primary" @click="newOperate = true">新建供应商</el-button>
    <el-dialog
      title="新建"
      :visible.sync="newOperate"
      width="50%"
      center>
      <el-form :model="newData" :rules="createRules" ref="newOperate" label-width="100px" class="demo-ruleForm">
        <el-form-item label="供应商名称"  prop="supplierName">
          <el-input v-model.trim="newData.supplierName"></el-input>
        </el-form-item>
        <el-form-item label="社会信用代码" prop="supplierCreditCode">
          <el-input v-model.trim="newData.supplierCreditCode"></el-input>
        </el-form-item>
        <el-form-item label="地区">
          <el-select v-model="newProvince" @change="provinceChoose(1)" placeholder="省份">
            <el-option
              v-for="item in provinceList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="newCity" @change="cityChoose(1)" placeholder="城市" :disabled="cityDisabled">
            <el-option
              v-for="item in cityList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select v-model="newArea" placeholder="区域/乡镇" :disabled="areaDisabled">
            <el-option
              v-for="item in areaList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生产模式" prop="prodectModel">
          <el-select v-model="newData.prodectModel" placeholder="生产模式">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商联系人" prop="supplierContactName">
          <el-input v-model.trim="newData.supplierContactName"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="supplierContactMobile">
          <el-input v-model.trim="newData.supplierContactMobile"></el-input>
        </el-form-item>
        <el-form-item label="HX负责人" prop="responsibleName">
          <el-select v-model="newData.responsibleName" placeholder="杭萧负责人">
            <el-option
              v-for="item in responsiableOptions"
              :key="item.id"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <!--<el-input v-model="newData.responsibleName"></el-input>-->
        </el-form-item>
        <el-form-item label="HX联系电话" prop="responsibleMobile">
          <el-input v-model.trim="newData.responsibleMobile"></el-input>
        </el-form-item>
        <el-form-item label="合作开始时间">
          <el-date-picker
            v-model="newData.cooperantBeginDate"
            type="date"
            :picker-options="dialogTime.startPickerOptions"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合作结束时间">
          <el-date-picker
            v-model="newData.cooperantEndDate"
            type="date"
            :picker-options="dialogTime.endPickerOptions"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="newSupplier('newOperate')">确 定</el-button>
      </span>
    </el-dialog>
    <div class="search-condition">
      <div class="condition-title clearfix">
        <div class="f-l">查询搜索</div>
        <div class="f-r open-btn">
          <span @click="showSearchDate" v-if="!showDate">展开</span>
          <span @click="showSearchDate" v-if="showDate">收起</span>
          <span class="search-btn btn" @click="search">查询</span>
        </div>
      </div>
      <div class="condition clearfix">
        <div class="item clearfix">
          <div class="name">供应商名称:</div>
          <div class="value">
            <el-input v-model="supplierName" placeholder="供应商名称" clearable></el-input>
          </div>
        </div>
        <div class="item">
          <div class="name">地区:</div>
          <div class="value">
            <el-select v-model="province" @change="provinceChoose" placeholder="请选择">
              <el-option
                v-for="item in provinceList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="city" @change="cityChoose" placeholder="城市" :disabled="cityDisabled">
              <el-option
                v-for="item in cityList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="area" placeholder="区域/乡镇" :disabled="areaDisabled">
              <el-option
                v-for="item in areaList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="item">
          <div class="name">生产模式:</div>
          <div class="value">
            <el-select v-model="prodectModel" placeholder="生产模式">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="item" v-if="showDate">
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
        <div class="item" v-if="showDate">
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
      </div>
    </div>
    <div class="search-list">
      <div class="search-title">列表</div>
      <div class="list" v-loading="loading">
        <el-table
          ref="singleTable"
          :data="data"
          highlight-current-row
          stripe
          style="width: 100%">
          <el-table-column
            prop="supplierName"
            label="供应商名称">
          </el-table-column>
          <el-table-column
            prop="address"
            label="地区">
          </el-table-column>
          <el-table-column
            prop="supplierMakeMode"
            width="40"
            label="生产模式">
          </el-table-column>
          <el-table-column
            prop="supplierContactName"
            width="40"
            label="联系人">
          </el-table-column>
          <el-table-column
            prop="supplierContactMobile"
            width="80"
            label="联系方式">
          </el-table-column>
          <el-table-column
            prop="responsibleName"
            label="杭萧负责人">
          </el-table-column>
          <el-table-column
            prop="responsibleMobile"
            width="110"
            label="负责人联系方式">
          </el-table-column>
          <el-table-column
            prop="cooperantBeginDate"
            label="合作开始时间">
          </el-table-column>
          <el-table-column
            prop="cooperantEndDate"
            label="合作结束时间">
          </el-table-column>
          <el-table-column
            prop="type"
            label="账号">
            <template slot-scope="scope">
              <el-button type="text" @click="openList(scope.row)" v-if="scope.row.supplierStatus === 0">开通</el-button>
              <div v-else>{{ scope.row.masterAccount }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="operate"
            width="140"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="changeListData(scope.row)" v-if="scope.row.supplierStatus === 0 || scope.row.supplierStatus === 1">修改</el-button>
              <el-button type="text" @click="resetListPsw(scope.row)" v-if="scope.row.supplierStatus === 1">重置密码</el-button>
              <el-button type="text" @click="closeList(scope.row.supplierId)" v-if="scope.row.supplierStatus === 1">关闭</el-button>
              <el-button type="text" @click="reopenList(scope.row.supplierId)" v-if="scope.row.supplierStatus === 2">开启账户</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          title="提示"
          :visible.sync="openType"
          width="50%"
          center>
          <el-form :model="openData" ref="openData" label-width="100px" class="demo-ruleForm">
            <el-form-item label="账户">
              <el-input v-model="openData.userId"></el-input>
            </el-form-item>
            <el-form-item label="初始登录密码">
              <el-input type="password" v-model="openData.password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input type="password" v-model="openData.surePassword"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
                  <el-button @click="openType = false">取消</el-button>
                  <el-button type="primary" @click="makeOpen()">确定</el-button>
                </span>
        </el-dialog>
        <el-dialog
          title="修改"
          :visible.sync="changeOperate"
          width="40%"
          center>
          <el-form :model="changeData" ref="changeOperate" label-width="100px" class="demo-ruleForm">
            <el-form-item label="供应商名称" :rules="[{required: true}]">
              <el-input v-model="changeData.supplierName" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="社会信用代码" :rules="[{required: true}]">
              <el-input v-model="changeData.supplierCreditCode" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="地区" :rules="[{required: true}]">
              <el-input v-model="changeData.address" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="生产模式" :rules="[{required: true}]">
              <el-select v-model="changeData.supplierMakeMode" placeholder="生产模式">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="供应商联系人" :rules="[{required: true}]">
              <el-input v-model="changeData.supplierContactName"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" :rules="[{required: true}]">
              <el-input v-model="changeData.supplierContactMobile"></el-input>
            </el-form-item>
            <el-form-item label="HX负责人" :rules="[{required: true}]">
              <!--<el-input v-model="changeData.responsibleName"></el-input>-->
              <el-select v-model="changeData.responsibleName" placeholder="杭萧负责人">
                <el-option
                  v-for="item in responsiableOptions"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="HX联系电话" :rules="[{required: true}]">
              <el-input v-model="changeData.responsibleMobile"></el-input>
            </el-form-item>
            <el-form-item label="合作开始时间">
              <el-date-picker
                v-model="changeData.cooperantBeginDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="合作结束时间">
              <el-date-picker
                v-model="changeData.cooperantEndDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="changeOpen">确定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="重置密码"
          :visible.sync="resetPassword"
          width="40%"
          center>
          <el-form :model="resetData" ref="resetPassword" label-width="100px" class="demo-ruleForm">
            <el-form-item label="账户" :rules="[{required: true}]">
              <el-input v-model="resetData.accountCode" disabled="disabled"></el-input>
            </el-form-item>
            <el-form-item label="新密码" :rules="[{required: true}]">
              <el-input type="password" v-model="resetData.accountPassword"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" :rules="[{required: true}]">
              <el-input type="password" v-model="resetData.sureAccountPassword"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="changePsw">确定</el-button>
          </span>
        </el-dialog>
        <el-dialog
          title="关闭"
          :visible.sync="closeOperate"
          width="30%"
          center
        >
          <span>是否关闭该供应商的账户，关闭后该账户下的子账号也不能启用</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeOperate = false">取 消</el-button>
            <el-button type="primary" @click="closeSupplierOperate()">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getUserInfo } from '@/utils/auth'
import { findSupplierList, getAreaInfo, createSupplierMasterAccount, createSupplier, closeSupplierAllAccount, findAdministratorList, resetAccountPwd, modifySupplier, openSupplierAllAccount } from '../../../api/supplier/supplier'

export default {
  name: 'supplierList',
  data () {
    return {
      loading: false,
      closeSupplierId: '',
      supplierName: '',
      newProvince: '',
      newCity: '',
      newArea: '',
      province: '',
      city: '',
      area: '',
      provinceList: [],
      cityList: [],
      areaList: [],
      cityDisabled: false,
      areaDisabled: false,
      loadingCity: null,
      prodectModel: '',
      createRules: {
        supplierName: [
          { required: true, message: '请输入供应商', trigger: 'blur' },
          // { pattern: /^[\u4e00-\u9fa5]{3,100}$/, message: '3到100个字符', trigger: 'blur' }
          { min: 3, max: 100, message: '3到100个字符', trigger: 'blur' }
        ],
        supplierCreditCode: [
          { required: true, message: '请输入社会信用代码', trigger: 'change' },
          { pattern: /^[a-zA-Z0-9]{6,18}$/, message: '统一社会信用代码是18位阿拉伯数字或者字母组成', trigger: 'blur' }
        ],
        // newProvince: [
        //   { required: true, message: '请选择地区', trigger: 'change' }
        // ],
        prodectModel: [
          { required: true, message: '请选择生产模式', trigger: 'change' }
        ],
        supplierContactName: [
          { required: true, message: '请输入供应商联系人', trigger: 'change' },
          { pattern: /^[\u4e00-\u9fa5]{2,5}$/, message: '请输入2-5位的中文', trigger: 'blur' }
        ],
        supplierContactMobile: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/ && /^[0-9]{3,4}[0-9]{7,8}$/, message: '联系方式是11-12的手机或者联系电话', trigger: 'blur' }
        ],
        responsibleName: [
          { required: true, message: '请输入HX负责人', trigger: 'change' }
        ],
        responsibleMobile: [
          { required: true, message: '请输入手机号', trigger: 'blue' },
          { pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/ && /^[0-9]{3,4}[0-9]{7,8}$/, message: '联系方式是11-12的手机或者联系电话', trigger: 'blur' }
        ]
      },
      options: [{
        value: '',
        label: '请选择'
      }, {
        value: 'MTA/MTO',
        label: 'MTA/MTO'
      }, {
        value: 'MTO',
        label: 'MTO'
      }, {
        value: 'MTA',
        label: 'MTA'
      }],
      responsiableOptions: [],
      startParams: {
        contractStartDate: '',
        contractEndDate: ''
      },
      endParams: {
        contractStartDate: '',
        contractEndDate: ''
      },
      data: [{
        supplierName: '行行行',
        address: '上海市普陀区金沙江路 1518 弄',
        supplierMakeMode: 'MTA/MTO',
        supplierContactName: 'xxx',
        supplierContactMobile: '13123123123',
        responsibleName: 'bb',
        responsibleMobile: '13312341234',
        cooperantBeginDate: '123',
        cooperantEndDate: moment(13312341234).format('YYYY-MM-DD'),
        type: '1',
        operate: '13'
      }],
      showDate: false,
      // 日期校验
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
      dialogTime: {
        startPickerOptions: {
          disabledDate: (val) => {
            if (this.newData.cooperantEndDate !== null && this.newData.cooperantEndDate !== '' && this.newData.cooperantEndDate !== undefined) {
              return val.getTime() > this.newData.cooperantEndDate
            }
          }
        },
        endPickerOptions: {
          disabledDate: (val) => {
            if (this.newData.cooperantBeginDate !== null) {
              return val.getTime() < this.newData.cooperantBeginDate
            }
          }
        }
      },
      openType: false,
      newOperate: false,
      changeOperate: false,
      resetPassword: false,
      closeOperate: false,
      openData: {
        userId: '',
        password: '',
        surePassword: ''
      },
      newData: {
        supplierName: '',
        supplierCreditCode: '',
        prodectModel: '',
        supplierContactName: '',
        supplierContactMobile: '',
        responsibleName: '',
        responsibleMobile: '',
        cooperantBeginDate: '',
        cooperantEndDate: ''
      },
      changeData: {
        userId: '123',
        password: '123',
        surePassword: '123'
      },
      resetData: {
        supplierAccountId: '',
        accountPassword: '',
        sureAccountPassword: ''
      }
    }
  },
  mounted () {
    this.$refs.singleTable.setCurrentRow(this.data[0])
    findAdministratorList().then(res => {
      for (let i = 0; i < res.data.data.length; i++) {
        this.responsiableOptions.push({
          value: res.data.data[i].accountName,
          label: res.data.data[i].accountName,
          id: res.data.data[i].accountId
        })
      }
    })
    this.fetchData()
    getAreaInfo().then(res => {
      const data = res.data.data
      this.allList = data
      const allList = this.allList
      allList.unshift(
        {
          cityListEntityList: [],
          id: '',
          name: '请选择',
          permissions: ''
        }
      )
      for (let i = 0; i < allList.length; i++) {
        this.provinceList.push(
          {
            'value': i,
            'id': allList[i].id,
            'label': allList[i].name
          }
        )
      }
    })
  },
  methods: {
    reopenList (index) {
      const data = {
        currentAccountId: getUserInfo().accountId,
        currentAccountName: getUserInfo().accountName,
        supplierId: index
      }
      openSupplierAllAccount(data).then(res => {
        if (res.data.code === 200) {
          this.$alert('成功', {
            confirmButtonText: '确定',
            callback: () => {
              window.location.reload()
            }
          })
        }
      })
    },
    openList (index) {
      this.openType = true
      this.openData = index
    },
    closeList (index) {
      this.closeOperate = true
      this.closeSupplierId = index
    },
    resetListPsw (index) {
      this.resetData = {
        accountCode: index.masterAccount
      }
      this.resetPassword = true
    },
    changeListData (index) {
      this.changeOperate = true
      this.changeData = {
        supplierId: index.supplierId,
        supplierName: index.supplierName,
        supplierCreditCode: index.supplierCreditCode,
        address: index.provinceName + index.cityName + index.districtName,
        provinceCode: index.provinceCode,
        provinceName: index.provinceName,
        cityCode: index.cityCode,
        cityName: index.cityName,
        districtCode: index.districtCode,
        districtName: index.districtName,
        supplierMakeMode: index.supplierMakeMode,
        supplierContactName: index.supplierContactName,
        supplierContactMobile: index.supplierContactMobile,
        responsibleName: index.responsibleName,
        responsibleMobile: index.responsibleMobile,
        cooperantBeginDate: index.cooperantBeginDate,
        cooperantEndDate: index.cooperantEndDate
      }
    },
    changePsw () {
      const data = {
        currentAccountId: getUserInfo().accountId,
        currentAccountName: getUserInfo().accountName,
        accountCode: this.resetData.accountCode,
        accountPassword: this.resetData.accountPassword
      }
      if (this.resetData.accountPassword !== this.resetData.sureAccountPassword) {
        this.$alert('两次输入的密码需保持一致', {
          confirmButtonText: '确定'
        })
      } else {
        resetAccountPwd(data).then(res => {
          if (res.data.code === 200) {
            this.$alert('修改成功', {
              confirmButtonText: '确定',
              callback: () => {
                window.location.reload()
              }
            })
          }
        })
      }
    },
    // 新建供应商
    newSupplier (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const newData = this.newData
          const data = {
            currentAccountId: getUserInfo().accountId,
            currentAccountName: getUserInfo().accountName,
            supplierName: newData.supplierName,
            creditCode: newData.supplierCreditCode,
            countryCode: 'CN',
            countryName: '中国',
            provinceCode: this.newProvince !== '' ? this.provinceList[this.newProvince].id : '',
            provinceName: this.newProvince !== '' ? this.provinceList[this.newProvince].label : '',
            cityCode: this.newCity !== '' ? this.cityList[this.newCity].id : '',
            cityName: this.newCity !== '' ? this.cityList[this.newCity].label : '',
            districtCode: this.newArea !== '' ? this.areaList[this.newArea].id : '',
            districtName: this.newArea !== '' ? this.areaList[this.newArea].label : '',
            makeMode: newData.prodectModel,
            contactName: newData.supplierContactName,
            contactMobile: newData.supplierContactMobile,
            responsibleName: newData.responsibleName,
            responsibleMobile: newData.responsibleMobile,
            cooperantBeginDate: parseInt(moment(newData.cooperantBeginDate).format('X')) * 1000,
            cooperantEndDate: parseInt(moment(newData.cooperantEndDate).format('X')) * 1000
          }
          createSupplier(data).then(res => {
            if (res.data.code === 200) {
              this.$alert('添加成功', {
                confirmButtonText: '确定',
                callback: () => {
                  window.location.reload()
                }
              })
              this.newOperate = false
            } else {
              this.$message({
                message: res.data.data,
                type: 'error'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    fetchData (data) {
      findSupplierList(data).then(res => {
        this.loading = false
        if (res.data.code === 200) {
          this.data = res.data.data.supplierInfoList
          for (let i = 0; i < this.data.length; i++) {
            this.data[i].address = this.data[i].provinceName + this.data[i].cityName + this.data[i].districtName
            this.data[i].cooperantBeginDate = moment(this.data[i].cooperantBeginDate).format('YYYY-MM-DD')
            this.data[i].cooperantEndDate = moment(this.data[i].cooperantEndDate).format('YYYY-MM-DD')
          }
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
        supplierName: this.supplierName,
        provinceCode: this.province !== '' ? this.provinceList[this.province].id : '',
        cityCode: this.city !== '' ? this.cityList[this.city].id : '',
        districtCode: this.area !== '' ? this.areaList[this.area].id : '',
        makeMode: this.prodectModel,
        cooperantBeginDateAfter: parseInt(moment(this.startParams.contractStartDate).format('X')) * 1000,
        cooperantBeginDateBefore: parseInt(moment(this.startParams.contractEndDate).format('X')) * 1000,
        cooperantEndDateAfter: parseInt(moment(this.endParams.contractStartDate).format('X')) * 1000,
        cooperantEndDateBefore: parseInt(moment(this.endParams.contractEndDate).format('X')) * 1000
      }
      this.fetchData(data)
    },
    provinceChoose (index) {
      this.cityList = []
      if (this.cityDisabled) {
        this.cityDisabled = false
      }
      let allList
      this.allList[this.province] === undefined ? allList = this.allList[this.newProvince].cityListEntityList : allList = this.allList[this.province].cityListEntityList
      if (allList.length === 0) {
        this.city = ''
        this.area = ''
        this.cityList = []
        this.areaList = []
        return false
      }
      for (let i = 0; i < allList.length; i++) {
        this.cityList.push({
          'value': i,
          'id': allList[i].id,
          'label': allList[i].name
        })
      }
      if (this.loadingCity === null) {
      } else {
        this.cityChoose()
      }
    },
    cityChoose (index) {
      this.areaList = []
      if (this.areaDisabled) {
        this.areaDisabled = false
      }
      let allList
      index === 1 ? allList = this.allList[this.newProvince].cityListEntityList[this.newCity].cityListEntityList : allList = this.allList[this.province].cityListEntityList[this.city].cityListEntityList
      this.loadingCity = allList
      for (let i = 0; i < allList.length; i++) {
        this.areaList.push({
          'value': i,
          'id': allList[i].id,
          'label': allList[i].name
        })
      }
    },
    showSearchDate () {
      this.showDate = !this.showDate
    },
    makeOpen () {
      const data = {
        currentAccountId: getUserInfo().accountId,
        currentAccountName: getUserInfo().accountName,
        supplierId: this.openData.supplierId,
        supplierAccount: this.openData.userId,
        accountPassword: this.openData.password
      }
      this.openData.password !== this.openData.surePassword ? this.$message({
        message: '请保证两次密码一致',
        type: 'error'
      }) : createSupplierMasterAccount(data).then(res => {
        if (res.data.code === 200) {
          this.$message({
            message: '开通成功',
            type: 'success'
          })
          window.location.reload()
        } else {
          this.$message({
            message: res.data.data,
            type: 'error'
          })
        }
      })
    },
    changeOpen () {
      const data = {
        currentAccountId: getUserInfo().accountId,
        currentAccountName: getUserInfo().accountName,
        supplierId: this.changeData.supplierId,
        supplierName: this.changeData.supplierName,
        creditCode: this.changeData.supplierCreditCode,
        countryCode: 'CN',
        countryName: '中国',
        provinceCode: this.changeData.provinceCode,
        provinceName: this.changeData.provinceName,
        cityCode: this.changeData.cityCode,
        cityName: this.changeData.cityName,
        districtCode: this.changeData.districtCode,
        districtName: this.changeData.districtName,
        makeMode: this.changeData.supplierMakeMode,
        contactName: this.changeData.supplierContactName,
        contactMobile: this.changeData.supplierContactMobile,
        responsibleName: this.changeData.responsibleName,
        responsibleMobile: this.changeData.responsibleMobile,
        cooperantBeginDate: parseInt(moment(this.changeData.cooperantBeginDate).format('X')) * 1000,
        cooperantEndDate: parseInt(moment(this.changeData.cooperantEndDate).format('X')) * 1000
      }
      modifySupplier(data).then(res => {
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
    closeSupplierOperate () {
      const data = {
        currentAccountId: getUserInfo().accountId,
        currentAccountName: getUserInfo().accountName,
        supplierId: this.closeSupplierId
      }
      closeSupplierAllAccount(data).then(res => {
        if (res.data.code === 200) {
          this.closeOperate = false
          this.$alert('关闭成功', {
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
    }
  }
}
</script>

<style lang="sass">
  @import "index"
</style>
