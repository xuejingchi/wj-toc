<template>
  <div class="account-setting">
    <div class="title"><span></span>账户管理</div>
    <el-button class="add-btn" type="primary" @click="addAccount()">新建账号</el-button>
    <div class="table-list">
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="accountName"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="accountCode"
          label="账号">
        </el-table-column>
        <el-table-column
          prop="accountContact"
          label="联系方式">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <span class="item-items" @click="resetPassword(scope)">密码重置</span>
            <span class="item-items" @click="editorAccount(scope)">修改账号信息</span>
            <span v-if="scope.row.accountStatus == '1'" class="item-items" @click="closeCurrentAccount(scope)">关闭账户</span>
            <span v-else-if="scope.row.accountStatus == '2'" class="item-items" @click="addCurrentAccount(scope)">开启账户</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="新增账号"
      :visible.sync="dialog.addAccountDialog"
      width="30%"
      class="addDialog"
      :before-close="handleClose">
      <div class="form">
        <div class="form-item clearfix">
          <div class="form-label f-l"><span class="required">姓名:</span></div>
          <div class="f-l form-input">
            <el-input v-model="accountDialog.name" placeholder="请输入姓名"></el-input>
          </div>
        </div>
        <div class="hint" v-show="commit.add.name"><span>*</span> 姓名不能为空</div>
        <div class="form-item clearfix">
          <div class="form-label f-l"><span class="required">账号:</span></div>
          <div class="f-l form-input">
            <el-input v-model="accountDialog.account" placeholder="请输入手机号码"></el-input>
          </div>
        </div>
        <div class="hint" v-show="commit.add.account">* 账号不能为空，且为手机号码</div>
        <div class="form-item clearfix">
          <div class="form-label f-l"><span class="required">联系方式:</span></div>
          <div class="f-l form-input">
            <el-input type="number" v-model="accountDialog.tel" placeholder="请输入联系方式"></el-input>
          </div>
        </div>
        <div class="hint" v-show="commit.add.tel">* 请输入正确联系方式</div>
        <div class="form-item clearfix">
          <div class="form-label f-l"><span class="required">密码:</span></div>
          <div class="f-l form-input">
            <el-input type="password" v-model="accountDialog.password" placeholder="请输入密码"></el-input>
          </div>
        </div>
        <div class="hint" v-show="commit.add.password">* 密码不能为空</div>
        <div class="form-item clearfix">
          <div class="form-label f-l"><span class="required">确认密码:</span></div>
          <div class="f-l form-input">
            <el-input type="password" v-model="accountDialog.confirmPassword" placeholder="请再次输入密码"></el-input>
          </div>
        </div>
        <div class="hint" v-show="commit.add.confirmPassword"><span>*</span> 密码不一致</div>
        <div class="hint" v-show="commit.add.resPassword"><span>*</span>密码格式需要a-z + 1-0</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.addAccountDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitAddAccount()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="重置密码"
      :visible.sync="dialog.resetPasswordDialog"
      width="30%"
      class="addDialog"
      :before-close="handleClose">
      <div class="form">
        <div class="form-item clearfix">
          <div class="form-label f-l"><span class="required">姓名:</span></div>
          <div class="f-l form-input">
            {{ resetDialog.name }}
          </div>
        </div>
        <div class="form-item clearfix">
          <div class="form-label f-l"><span class="required">账号:</span></div>
          <div class="f-l form-input">
            {{ resetDialog.code }}
          </div>
        </div>
        <div class="form-item clearfix">
          <div class="form-label f-l"><span class="required">密码:</span></div>
          <div class="f-l form-input">
            <el-input type="password" v-model="resetDialog.password" placeholder="请输入密码"></el-input>
          </div>
        </div>
        <div class="hint" v-show="commit.reset.password">* 密码不能为空</div>
        <div class="form-item clearfix">
          <div class="form-label f-l"><span class="required">确认密码:</span></div>
          <div class="f-l form-input">
            <el-input type="password" v-model="resetDialog.confirmPassword" placeholder="请再次输入密码"></el-input>
          </div>
        </div>
        <div class="hint" v-show="commit.reset.confirmPassword"><span>*</span> 密码不一致</div>
        <div class="hint" v-show="commit.reset.resPassword"><span>*</span>密码格式需要a-z + 1-0</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.resetPasswordDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitResetPassword()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改账户信息"
      :visible.sync="dialog.editorAccountDialog"
      width="30%"
      class="addDialog"
      :before-close="handleClose">
      <div class="form">
        <div class="form-item clearfix">
          <div class="form-label f-l"><span class="required">姓名:</span></div>
          <div class="f-l form-input">
            <el-input v-model="editorDialog.name" placeholder="请输入姓名"></el-input>
          </div>
        </div>
        <div class="hint" v-show="commit.editor.name"><span>*</span> 姓名不能为空</div>
        <div class="form-item clearfix">
          <div class="form-label f-l"><span class="required">账号:</span></div>
          <div class="f-l form-input">
            {{ editorDialog.code }}
          </div>
        </div>
        <div class="form-item clearfix">
          <div class="form-label f-l"><span class="required">联系方式:</span></div>
          <div class="f-l form-input">
            <el-input type="number" v-model="editorDialog.tel" placeholder="请输入正确的联系方式"></el-input>
          </div>
        </div>
        <div class="hint" v-show="commit.editor.tel"><span>*</span> 联系方式不能为空</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.editorAccountDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitEditorAccount()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改账户信息"
      :visible.sync="dialog.closeAccountDialog"
      width="30%"
      class="addDialog"
      :before-close="handleClose">
      <div class="form">
        是否关闭该账户, 关闭后账户不能启用
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.closeAccountDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitCloseAccount()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改账户信息"
      :visible.sync="dialog.addsAccountDialog"
      width="30%"
      class="addDialog"
      :before-close="handleClose">
      <div class="form">
        是否开启该账户？
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.addsAccountDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitAddsAccount()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserInfo } from '@/utils/auth'
import { createAdminAccout, resetAccountPwd, modifyAccountInfo, findAdminAccountInfoList, closeAccount, openAccount } from '@/api/accountSetting/accountSetting'
export default {
  name: 'accountSetting',
  data () {
    return {
      commit: {
        add: {
          name: false,
          account: false,
          tel: false,
          password: false,
          confirmPassword: false,
          resPassword: false
        },
        reset: {
          password: false,
          confirmPassword: false,
          resPassword: false
        },
        editor: {
          name: false,
          tel: false
        }
      },
      dialog: {
        addAccountDialog: false,
        resetPasswordDialog: false,
        editorAccountDialog: false,
        closeAccountDialog: false,
        addsAccountDialog: false
      },
      editorDialog: {
        name: '',
        tel: '',
        code: ''
      },
      resetDialog: {
        password: '',
        confirmPassword: '',
        name: '',
        code: ''
      },
      accountDialog: {
        name: '',
        account: '',
        tel: '',
        password: '',
        confirmPassword: ''
      },
      tableData: [],
      userInfo: getUserInfo(),
      currentInfo: {}
    }
  },
  mounted () {
    this.findAdminAccountInfoList()
  },
  methods: {
    findAdminAccountInfoList () { // 获取信息列表
      findAdminAccountInfoList().then((res) => {
        console.log(res)
        if (res.data.code === 200) {
          let data = res.data.data
          this.tableData = data
        }
      })
    },
    addAccount () { // 新建账号
      this.dialog.addAccountDialog = true
      this.accountDialog.name = ''
      this.accountDialog.account = ''
      this.accountDialog.tel = ''
      this.accountDialog.password = ''
      this.accountDialog.confirmPassword = ''
    },
    submitAddAccount () { // 提交新建账号
      if (this.accountDialog.name === '') {
        this.commit.add.name = true
        return false
      } else {
        this.commit.add.name = false
      }
      if (this.accountDialog.account === '' || this.accountDialog.account.length !== 11) {
        this.commit.add.account = true
        return false
      } else {
        this.commit.add.account = false
      }
      if (this.accountDialog.tel === '' || this.accountDialog.tel.length !== 11) {
        this.commit.add.tel = true
        return false
      } else {
        this.commit.add.tel = false
      }
      if (this.accountDialog.password === '') {
        this.commit.add.password = true
        return false
      } else {
        this.commit.add.password = false
      }
      if (this.accountDialog.confirmPassword === '' || this.accountDialog.confirmPassword !== this.accountDialog.password) {
        this.commit.add.confirmPassword = true
        return false
      } else {
        this.commit.add.confirmPassword = false
      }
      let reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,16}$/
      if (!reg.test(this.accountDialog.confirmPassword) && !reg.test(this.accountDialog.password)) {
        this.commit.add.resPassword = true
        return false
      } else {
        this.commit.add.resPassword = false
      }
      let params = {
        accountCode: this.accountDialog.account,
        accountContact: this.accountDialog.tel,
        accountName: this.accountDialog.name,
        accountPassword: this.accountDialog.password,
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName
      }
      createAdminAccout(params).then((res) => {
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '新建账号成功!'
          })
          this.findAdminAccountInfoList()
          this.dialog.addAccountDialog = false
        }
      })
    },
    resetPassword (scope) { // 重置密码
      this.dialog.resetPasswordDialog = true
      this.currentInfo = scope.row
      this.resetDialog.name = scope.row.accountName
      this.resetDialog.code = scope.row.accountCode
    },
    submitResetPassword (scope) { // 提交重置密码
      if (this.resetDialog.password === '') {
        this.commit.reset.password = true
        return false
      } else {
        this.commit.reset.password = false
      }
      if (this.resetDialog.confirmPassword === '' || this.resetDialog.confirmPassword !== this.resetDialog.password) {
        this.commit.reset.confirmPassword = true
        return false
      } else {
        this.commit.reset.confirmPassword = false
      }
      let reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,16}$/
      if (!reg.test(this.resetDialog.confirmPassword) && !reg.test(this.resetDialog.password)) {
        this.commit.reset.resPassword = true
        return false
      } else {
        this.commit.reset.resPassword = false
      }
      let params = {
        accountId: this.currentInfo.accountId,
        accountCode: this.currentInfo.accountCode,
        accountPassword: this.resetDialog.confirmPassword,
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName
      }
      resetAccountPwd(params).then((res) => {
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '重置密码成功!'
          })
          this.findAdminAccountInfoList()
          this.dialog.resetPasswordDialog = false
        }
      })
    },
    editorAccount (scope) { // 修改账号信息
      this.dialog.editorAccountDialog = true
      this.currentInfo = scope.row
      this.editorDialog.code = scope.row.accountCode
    },
    submitEditorAccount () { // 提交修改账号信息
      if (this.editorDialog.name === '') {
        this.commit.editor.name = true
        return false
      } else {
        this.commit.editor.name = false
      }
      if (this.editorDialog.tel === '' || this.editorDialog.tel.length !== 11) {
        this.commit.editor.tel = true
        return false
      } else {
        this.commit.editor.tel = false
      }
      console.log(this.currentInfo)
      let params = {
        accountContact: this.editorDialog.tel,
        accountId: this.currentInfo.accountId,
        accountName: this.editorDialog.name,
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName
      }
      modifyAccountInfo(params).then((res) => {
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: '修改账号信息成功!'
          })
          this.findAdminAccountInfoList()
          this.dialog.editorAccountDialog = false
        }
      })
    },
    closeCurrentAccount (scope) {
      this.dialog.closeAccountDialog = true
      this.currentInfo = scope.row
    },
    addCurrentAccount (scope) {
      this.dialog.addsAccountDialog = true
      this.currentInfo = scope.row
    },
    submitCloseAccount () {
      let params = {
        accountId: this.currentInfo.accountId,
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName
      }
      closeAccount(params).then((res) => {
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: res.data.data
          })
          this.findAdminAccountInfoList()
          this.dialog.closeAccountDialog = false
        }
      })
    },
    submitAddsAccount () {
      let params = {
        accountId: this.currentInfo.accountId,
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName
      }
      openAccount(params).then((res) => {
        if (res.data.code === 200) {
          this.$message({
            type: 'success',
            message: res.data.data
          })
          this.findAdminAccountInfoList()
          this.dialog.addsAccountDialog = false
        }
      })
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>
<style lang="sass">
  @import "index"
</style>
