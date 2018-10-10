<template>
  <div class="account-setting">
    <div class="title"><span></span>权限设置</div>
    <el-button class="ghost-btn add" type="primary" @click="addAccount()">新建账号权限</el-button>
    <div class="table-list">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="accountCode"
          label="账号">
        </el-table-column>
        <el-table-column
          prop="accountName"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="accountContact"
          label="联系方式">
        </el-table-column>
        <el-table-column
          label="角色"
          width="180">
          <template slot-scope="scope">
            <span class="">{{ scope.row.roleName }}</span>
            <span class="item-items" @click="editorLimit(scope)">修改权限</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <span v-if="parseInt(scope.row.accountStatus, 10) !== 2" class="item-items" @click="editorAccount(scope)">修改账号信息</span>
            <span v-if="parseInt(scope.row.accountStatus, 10) !== 2" class="item-items" @click="closeCurrentAccount(scope)">关闭账户</span>
            <span v-if="parseInt(scope.row.accountStatus, 10) === 2" class="item-items" @click="openCurrentAccount(scope)">启动账户</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新建账号权限 -->
    <el-dialog
      title="新建账号权限"
      :visible.sync="dialog.addAccountDialog"
      :fullscreen="true"
      width="30%"
      center
      v-loading="loadingStatus">
      <div style="margin: 10% auto;width:80%">
        <el-form :model="addAccountDialog" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="账号：" prop="accountCode">
            <el-input type="number" v-model="addAccountDialog.accountCode" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="姓名：" prop="accountName">
            <el-input v-model="addAccountDialog.accountName" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="联系方式：" prop="accountContact">
            <el-input type="number" v-model="addAccountDialog.accountContact" placeholder="请输入联系方式"></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="accountPassword">
            <el-input type="password" v-model="addAccountDialog.accountPassword" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码：" prop="confirmPassword">
            <el-input type="password" v-model="addAccountDialog.confirmPassword" placeholder="请再次输入密码"></el-input>
          </el-form-item>
          <el-form-item label="权限管理：" prop="accountRoleId">
            <div :key="role.id" v-for="role in supplierAccountRoleList">
              <el-radio v-model="addAccountDialog.accountRoleId" :label="role.id">{{ role.roleName }}</el-radio>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitAddAccount()">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 修改权限 -->
    <el-dialog
      title="修改账号权限"
      :visible.sync="dialog.editRoleDialog"
      :fullscreen="true"
      width="30%"
      center
      v-loading="loadingStatus">
      <div style="margin: 10% auto;width:80%">
        <el-form :model="editRoleDialog" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="账号：" prop="accountCode">
            <el-input disabled type="number" v-model="editRoleDialog.accountCode" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="姓名：" prop="accountName">
            <el-input disabled v-model="editRoleDialog.accountName" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="联系方式：" prop="accountContact">
            <el-input disabled type="number" v-model="editRoleDialog.accountContact" placeholder="请输入联系方式"></el-input>
          </el-form-item>
          <el-form-item label="权限管理：" prop="accountRoleId">
            <div :key="role.id" v-for="role in supplierAccountRoleList">
              <el-radio v-model="editRoleDialog.roleId" :label="role.id">{{ role.roleName }}</el-radio>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitEditRole()">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 关闭账户 -->
    <el-dialog
      title="关闭账户"
      :visible.sync="dialog.closeAccountDialog"
      width="30%"
      class="addDialog">
      <div class="form">
        是否关闭该账户, 关闭后账户不能启用
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.closeAccountDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitCloseAccount()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 开启账户 -->
    <el-dialog
      title="开启账户"
      :visible.sync="dialog.openAccountDialog"
      width="30%"
      class="addDialog">
      <div class="form">
        是否开启该账户, 关闭后账户不能启用
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.openAccountDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitOpenAccount()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改账户信息 -->
    <el-dialog
      title="修改账户信息"
      :visible.sync="dialog.editorAccountDialog"
      :fullscreen="true"
      width="30%"
      center
      v-loading="loadingStatus">
      <div style="margin: 10% auto;width:80%">
        <el-form :model="editorAccountDialog" :rules="editAccountRules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="账号：" prop="accountCode">
            <el-input disabled type="number" v-model="editorAccountDialog.accountCode" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="姓名：" prop="accountName">
            <el-input v-model="editorAccountDialog.accountName" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="联系方式：" prop="accountContact">
            <el-input type="number" v-model="editorAccountDialog.accountContact" placeholder="请输入联系方式"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitEditAccount()">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { modifyAccountInfo, closeAccount, openAccount } from '@/api/accountSetting/accountSetting'
import { findSupplierAccountRoleList, createSupplierSubAccount, findSupplierAccountInfoList, modifyAccountRole } from '@/api/front/setting/limit'
import { getUserInfo } from '@/utils/auth'
export default {
  name: 'accountSetting',
  data () {
    return {
      loadingStatus: false,
      supplierAccountRoleList: [],
      rules: {
        accountCode: [
          { required: true, message: '请输入账号', trigger: 'change' }
        ],
        accountContact: [
          { required: true, message: '请输入联系方式', trigger: 'change' }
        ],
        accountName: [
          { required: true, message: '请输入姓名', trigger: 'change' }
        ],
        accountPassword: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ],
        confirmPassword: [
          { required: true, message: '请输入确认密码', trigger: 'change' }
        ],
        accountRoleId: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
      editAccountRules: {
        accountContact: [
          { required: true, message: '请输入联系方式', trigger: 'change' }
        ],
        accountName: [
          { required: true, message: '请输入姓名', trigger: 'change' }
        ]
      },
      dialog: {
        addAccountDialog: false,
        editorAccountDialog: false,
        closeAccountDialog: false,
        editRoleDialog: false,
        openAccountDialog: false
      },
      editorAccountDialog: {},
      addAccountDialog: {
        accountCode: '',
        accountContact: '',
        accountName: '',
        accountPassword: '',
        confirmPassword: '',
        accountRoleId: ''
      },
      editRoleDialog: {},
      tableData: [],
      userInfo: getUserInfo(),
      currentInfo: {}
    }
  },
  created () {
    this.loadRoleList()
    console.log(this.userInfo)
  },
  mounted () {
    this.findSupplierAccountInfoList()
  },
  methods: {
    /*
    * 提交表单
    * */
    submitForm (type) {},
    /*
    * 加载角色
    * */
    loadRoleList () {
      findSupplierAccountRoleList().then(res => {
        console.log(res)
        if (res.data.code === 200 && res.data.data && res.data.data.length) {
          this.supplierAccountRoleList = res.data.data
          this.addAccountDialog.accountRoleId = res.data.data[0].id
        }
      })
    },
    /*
    * 获取列表信息
    * */
    findSupplierAccountInfoList () {
      findSupplierAccountInfoList({
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName,
        supplierId: this.userInfo.supplierId
      }).then((res) => {
        console.log(res)
        if (res.data.code === 200) {
          let data = res.data.data
          this.tableData = data
        }
      })
    },
    addAccount () { // 新建账号
      this.dialog.addAccountDialog = true
    },
    /*
    * 提交新建账号
    * */
    submitAddAccount () {
      let params = this.addAccountDialog
      params.accountRoleName = this.getRoleNameByRoleCode(this.addAccountDialog.accountRoleId)
      delete params.confirmPassword
      params.currentAccountId = this.userInfo.accountId
      params.currentAccountName = this.userInfo.accountName
      params.supplierId = this.userInfo.supplierId
      this.loadingStatus = true
      createSupplierSubAccount(params).then((res) => {
        this.loadingStatus = false
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '新建账号成功!'
          })
          this.findSupplierAccountInfoList()
          this.dialog.addAccountDialog = false
          // 重置新增表单
          this.addAccountDialog = {
            accountCode: '',
            accountContact: '',
            accountName: '',
            accountPassword: '',
            confirmPassword: '',
            accountRoleId: ''
          }
        }
      })
    },
    /*
    * 根据roleId 获取roleName
    * */
    getRoleNameByRoleCode (id) {
      let roleName = ''
      this.supplierAccountRoleList.forEach(role => {
        if (role.id === id) {
          roleName = role.roleName
        }
      })
      return roleName
    },
    /*
    * 提交修改权限
    * */
    submitEditRole () {
      let params = {
        accountId: this.editRoleDialog.id,
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName,
        roleId: this.editRoleDialog.roleId,
        roleName: this.getRoleNameByRoleCode(this.editRoleDialog.roleId)
      }
      modifyAccountRole(params).then((res) => {
        this.loadingStatus = false
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '修改权限成功!'
          })
          this.findSupplierAccountInfoList()
          this.dialog.editRoleDialog = false
        }
      })
    },
    /*
    * 修改账号信息
    * */
    editorAccount (scope) {
      this.dialog.editorAccountDialog = true
      this.editorAccountDialog = scope.row
    },
    /*
    * 提交修改账号信息
    * */
    submitEditAccount () {
      let params = {
        accountContact: this.editorAccountDialog.accountContact,
        accountId: this.editorAccountDialog.id,
        accountName: this.editorAccountDialog.accountName,
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName
      }
      modifyAccountInfo(params).then((res) => {
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '修改账号信息成功!'
          })
          this.findSupplierAccountInfoList()
          this.dialog.editorAccountDialog = false
        }
      })
    },
    closeCurrentAccount (scope) {
      this.dialog.closeAccountDialog = true
      this.currentInfo = scope.row
    },
    openCurrentAccount (scope) {
      this.dialog.openAccountDialog = true
      this.currentInfo = scope.row
    },
    submitCloseAccount () {
      let params = {
        accountId: this.currentInfo.id,
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName
      }
      closeAccount(params).then((res) => {
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '成功关闭此账号!'
          })
          this.findSupplierAccountInfoList()
          this.dialog.closeAccountDialog = false
        }
      })
    },
    submitOpenAccount () {
      let params = {
        accountId: this.currentInfo.id,
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName
      }
      openAccount(params).then((res) => {
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '成功开启此账号!'
          })
          this.findSupplierAccountInfoList()
          this.dialog.openAccountDialog = false
        }
      })
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    /*
    * 修改权限
    * */
    editorLimit (scope) {
      this.dialog.editRoleDialog = true
      this.editRoleDialog = scope.row
    }
  }
}
</script>
<style lang="sass">
  @import "index"
</style>
