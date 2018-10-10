<template>
  <div class="account-setting-page">
    <div class="account-setting-title"><span></span>我的账户</div>
    <ul class="account-setting-body">
      <li class="account-setting-item">
        姓名：
        <div v-if="!changeAccountName">
          <span>{{ userInfo.accountName }}</span><el-button style="margin-left: 20px;" @click="changeInfo('accountName', 'changeAccountName')">修改</el-button>
        </div>
        <div v-if="changeAccountName">
          <el-input v-model="accountName" style="width: 200px; margin: 0 20px;" placeholder="请输入姓名"></el-input>
          <el-button @click="saveInfo('accountName', 'changeAccountName')">保存</el-button>
          <el-button @click="changeAccountName = !changeAccountName">取消</el-button>
        </div>
      </li>
      <li class="account-setting-item">
        账号：
        <div>
          <span>{{ userInfo.accountCode }}</span>
        </div>
      </li>
      <li class="account-setting-item">
        联系方式：
        <div v-if="!changeAccountContact">
          <span>{{ userInfo.accountContact }}</span><el-button style="margin-left: 20px;" @click="changeInfo('accountContact', 'changeAccountContact')">修改</el-button>
        </div>
        <div v-if="changeAccountContact">
          <el-input v-model="accountContact" style="width: 200px; margin: 0 20px;" placeholder="请输入账号"></el-input>
          <el-button @click="saveInfo('accountContact', 'changeAccountContact')">保存</el-button>
          <el-button @click="changeAccountContact = !changeAccountContact">取消</el-button>
        </div>
      </li>
      <li class="account-setting-item">
        密码：<el-button @click="dialog.verifyDialog = true">修改</el-button>
      </li>
    </ul>
    <el-dialog
      title="安全验证"
      :visible.sync="dialog.verifyDialog"
      width="30%"
      class="addDialog">
      <div class="form">
        <div class="form-item clearfix">
          <div class="form-label f-l"><span class="required">原密码:</span></div>
          <div class="f-l form-input">
            <el-input v-model="verifyDialog.password" placeholder="请输入原密码"></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="verifyOldPsd()">下一步</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="设置密码"
      :visible.sync="dialog.settingDialog"
      width="30%"
      class="addDialog">
      <div class="form">
        <div class="form-item clearfix">
          <div class="form-label f-l"><span class="required">新密码:</span></div>
          <div class="f-l form-input">
            <el-input v-model="settingDialog.password" placeholder="请输入密码"></el-input>
          </div>
        </div>
        <div class="form-item clearfix">
          <div class="form-label f-l"><span class="required">确认密码:</span></div>
          <div class="f-l form-input">
            <el-input v-model="settingDialog.password2" placeholder="请输入密码"></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmModify()">确认修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserInfo, setUserInfo } from '@/utils/auth'
import { checkAccountPwd, resetAccountPwd, modifyAccountInfo } from '@/api/login/login'
export default {
  name: 'accountSetting',
  data () {
    return {
      changeAccountName: false,
      changeAccountContact: false,
      userInfo: getUserInfo(),
      accountName: '',
      accountContact: '',
      dialog: {
        verifyDialog: false,
        settingDialog: false
      },
      verifyDialog: {
        password: ''
      },
      settingDialog: {
        password: '',
        password2: ''
      }
    }
  },
  mounted () {
    console.log(this.userInfo)
  },
  methods: {
    /*
    * 修改信息
    * */
    changeInfo (key, showFlag) {
      this[key] = this.userInfo[key]
      this[showFlag] = !this[showFlag]
    },
    /*
    * 保存信息
    * */
    saveInfo (key, showFlag) {
      let params = {
        accountContact: this.userInfo.accountContact,
        accountId: this.userInfo.accountId,
        accountName: this.userInfo.accountName,
        currentAccountId: this.userInfo.accountId,
        accountCode: this.userInfo.accountCode,
        currentAccountName: this.userInfo.accountName
      }
      params[key] = this[key]
      if (key === 'accountName') {
        params.currentAccountName = this[key]
      }
      modifyAccountInfo(params).then(res => {
        if (res.data.code === 200) {
          this.userInfo[key] = this[key]
          this[showFlag] = !this[showFlag]
          setUserInfo(JSON.stringify(this.userInfo))
          this.$message({
            message: '修改成功！',
            type: 'success'
          })
        }
      })
    },
    /*
    * 下一步 验证原密码
    * */
    verifyOldPsd () {
      checkAccountPwd({
        accountId: this.userInfo.accountId,
        accountPassword: this.verifyDialog.password
      }).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.dialog.settingDialog = true
          this.dialog.verifyDialog = false
        } else {
          this.$message({
            message: res.data.data,
            type: 'error'
          })
        }
      })
    },
    /*
    * 确认修改
    * */
    confirmModify () {
      if (!this.settingDialog.password || !this.settingDialog.password) {
        this.$message({
          message: '请输入密码',
          type: 'error'
        })
      }
      if (this.settingDialog.password !== this.settingDialog.password2) {
        this.$message({
          message: '两次输入密码不一致',
          type: 'error'
        })
      }
      let reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,16}$/
      if (!reg.test(this.settingDialog.password) && !reg.test(this.settingDialog.password2)) {
        this.$message({
          message: '密码格式需要a-z + 1-0',
          type: 'error'
        })
        return false
      }
      resetAccountPwd({
        accountCode: this.userInfo.accountCode,
        accountPassword: this.settingDialog.password,
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName
      }).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.$message({
            message: '修改成功！',
            type: 'success'
          })
          this.dialog.settingDialog = false
        }
      })
    }
  }
}
</script>
<style lang="sass">
  @import "index"
</style>
