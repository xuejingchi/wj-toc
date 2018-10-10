<template>
  <div class="general">
    <el-button class="set-btn" type="primary" @click="showDialogVisible(1)">生产周期设置</el-button>
    <el-button class="set-btn" type="primary" @click="showDialogVisible(2)">销售单位设置</el-button>
    <el-button class="set-btn" type="primary" @click="showDialogVisible(3)">提前投料原因设置</el-button>
    <el-button class="set-btn" type="primary" @click="showDialogVisible(4)">红黑单原因设置</el-button>
    <el-button class="set-btn" type="primary" @click="showDialogVisible(5)">齐套元素设置</el-button>
    <el-button class="set-btn" type="primary" @click="showDialogVisible(6)">未齐套原因设置</el-button>
    <el-button class="set-btn" type="primary" @click="routerLinkTopath()">位置设置</el-button>
    <el-dialog :visible.sync="dialog.dialogOneVisible" width="40%" fullscreen class="box">
      <h1>生产周期设置</h1>
      <div class="addPhase">
        <div class="box-title">新建生产周期</div>
        <div class="addRadio">
          <span class="key">计数单位：</span>
          <el-radio-group v-model="oneDialog.form.radio">
            <el-radio :label="`小时`">小时</el-radio>
            <el-radio :label="`天`">天</el-radio>
          </el-radio-group>
          <el-form :model="oneDialog.form" label-width="80px">
            <el-form-item label="生产周期">
              <el-input v-model="oneDialog.form.name"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="oneDialog.form.desc"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="createItem(1)">立即创建</el-button>
              <el-button @click="resetForm(1)">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="tableList">
        <div class="box-title">生产周期列表</div>
        <el-table
          :data="tableDataOne"
          border>
          <el-table-column
            label="生产周期">
            <template slot-scope="scope">
              <div v-if="scope.row.disabel">{{ scope.row.valueName }}</div>
              <el-input v-else v-model="scope.row.valueName"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="备注">
            <template slot-scope="scope">
              <div v-if="scope.row.disabel">{{ scope.row.remark }}</div>
              <el-input v-else v-model="scope.row.remark"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <span class="item-items" v-if="scope.row.disabel" @click="editor(scope, 1)">编辑</span>
              <span class="item-items" v-else @click="save(scope, 1)">保存</span>
              <span class="item-items" @click="remove(scope, 1)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialog.dialogTwoVisible" width="40%" fullscreen class="box">
      <h1>销售单位设置</h1>
      <div class="addPhase">
        <div class="box-title">新建销售单位</div>
        <div class="addRadio">
          <span class="key">销售单位：</span>
          <el-radio-group v-model="twoDialog.form.radio" @change="twoRadio()">
            <el-radio :label="`件`">件</el-radio>
            <el-radio :label="`片`">片</el-radio>
            <el-radio :label="`公斤`">公斤</el-radio>
            <el-radio :label="`米`">米</el-radio>
            <el-radio :label="`吨`">吨</el-radio>
            <br>
            <el-radio :label="`自定义`">自定义</el-radio>
          </el-radio-group>
          <el-input style="margin-left: 76px; width: 200px;" v-model="twoDialog.form.name" v-if="flag"></el-input>
          <el-form :model="twoDialog.form" label-width="80px">
            <el-form-item>
              <el-button type="primary" @click="createItem(2)">立即创建</el-button>
              <el-button @click="resetForm(2)">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="tableList">
        <div class="box-title">销售单位列表</div>
        <el-table
          :data="tableDataTwo"
          border>
          <el-table-column
            type="index"
            label="序号"
            width="80">
          </el-table-column>
          <el-table-column
            label="销售单位">
            <template slot-scope="scope">
              <div v-if="scope.row.disabel">{{ scope.row.valueName }}</div>
              <el-input v-else v-model="scope.row.valueName"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <span class="item-items" v-if="scope.row.disabel" @click="editor(scope, 2)">编辑</span>
              <span class="item-items" v-else @click="save(scope, 2)">保存</span>
              <span class="item-items" @click="remove(scope, 2)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialog.dialogThreeVisible" width="40%" fullscreen class="box">
      <h1>提前投料原因设置</h1>
      <div class="addPhase">
        <div class="box-title">新建原因</div>
        <div class="addRadio">
          <el-form :model="threeDialog.form" label-width="80px">
            <el-form-item label="添加原因:">
              <el-input v-model="threeDialog.form.name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="createItem(3)">确定添加</el-button>
              <el-button @click="resetForm(3)">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="tableList">
        <div class="box-title">原因列表</div>
        <el-table
          :data="tableDataThree"
          border>
          <el-table-column
            type="index"
            label="序号"
            width="80">
          </el-table-column>
          <el-table-column
            label="原因">
            <template slot-scope="scope">
              <div v-if="scope.row.disabel">{{ scope.row.valueName }}</div>
              <el-input v-else v-model="scope.row.valueName"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <span class="item-items" v-if="scope.row.disabel" @click="editor(scope, 3)">编辑</span>
              <span class="item-items" v-else @click="save(scope, 3)">保存</span>
              <span class="item-items" @click="remove(scope, 3)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialog.dialogFourVisible" width="40%" fullscreen class="box">
      <h1>红黑单原因设置</h1>
      <div class="addPhase">
        <div class="box-title">新建原因</div>
        <div class="addRadio">
          <el-form :model="fourDialog.form" label-width="80px">
            <el-form-item label="添加原因:">
              <el-input v-model="fourDialog.form.name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="createItem(4)">确定添加</el-button>
              <el-button @click="resetForm(4)">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="tableList">
        <div class="box-title">原因列表</div>
        <el-table
          :data="tableDataFour"
          border>
          <el-table-column
            type="index"
            label="序号"
            width="80">
          </el-table-column>
          <el-table-column
            label="原因">
            <template slot-scope="scope">
              <div v-if="scope.row.disabel">{{ scope.row.valueName }}</div>
              <el-input v-else v-model="scope.row.valueName"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <span class="item-items" v-if="scope.row.disabel" @click="editor(scope, 4)">编辑</span>
              <span class="item-items" v-else @click="save(scope, 4)">保存</span>
              <span class="item-items" @click="remove(scope, 4)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialog.dialogFiveVisible" width="40%" fullscreen class="box">
      <h1>齐套元素设置</h1>
      <div class="addPhase">
        <div class="box-title">新建齐套元素</div>
        <div class="addRadio">
          <el-form :model="fiveDialog.form" label-width="120px">
            <el-form-item label="齐套元素名称:">
              <el-input v-model="fiveDialog.form.elementName"></el-input>
            </el-form-item>
            <el-form-item label="齐套负责人:">
              <el-input v-model="fiveDialog.form.manager"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="createItem(5)">确定添加</el-button>
              <el-button @click="resetForm(5)">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="tableList">
        <div class="box-title">齐套元素列表</div>
        <el-table
          :data="tableDataFive"
          border>
          <el-table-column
            type="index"
            label="序号"
            width="80">
          </el-table-column>
          <el-table-column
            label="齐套元素名称">
            <template slot-scope="scope">
              <div v-if="scope.row.disabel">{{ scope.row.elementName }}</div>
              <el-input v-else v-model="scope.row.elementName"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="齐套元素负责人">
            <template slot-scope="scope">
              <div v-if="scope.row.disabel">{{ scope.row.manager }}</div>
              <el-input v-else v-model="scope.row.manager"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <span class="item-items" v-if="scope.row.disabel" @click="editor(scope, 5)">编辑</span>
              <span class="item-items" v-else @click="save(scope, 5)">保存</span>
              <span class="item-items" @click="remove(scope, 5)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialog.dialogSixVisible" width="40%" fullscreen class="box">
      <h1>未齐套原因设置</h1>
      <div class="addPhase">
        <div class="box-title">新建原因</div>
        <div class="addRadio">
          <el-form :model="sixDialog.form" label-width="100px">
            <el-form-item label="未齐套原因:">
              <el-input v-model="sixDialog.form.name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="createItem(6)">确定添加</el-button>
              <el-button @click="resetForm(6)">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="tableList">
        <div class="box-title">原因列表</div>
        <el-table
          :data="tableDataSix"
          border>
          <el-table-column
            type="index"
            label="序号"
            width="80">
          </el-table-column>
          <el-table-column
            label="未齐套原因">
            <template slot-scope="scope">
              <div v-if="scope.row.disabel">{{ scope.row.valueName }}</div>
              <el-input v-else v-model="scope.row.valueName"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <span class="item-items" v-if="scope.row.disabel" @click="editor(scope, 6)">编辑</span>
              <span class="item-items" v-else @click="save(scope, 6)">保存</span>
              <span class="item-items" @click="remove(scope, 6)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  findProductionLeadTimeList,
  addValueSetLine, modifyValueSetLine,
  deleteValueSetLine,
  findSaleUnitList,
  findBeforehandFeedingCauseList,
  findRedBlackOrderCauseList,
  findFullKitElementList,
  createFullKitElement,
  modifyFullKitElement,
  deleteFullKitElement,
  findNotFullKitCauseList
} from '@/api/front/setting/index.js'
import { getUserInfo } from '@/utils/auth'
import nodata from '@/assets/noData.png'
export default {
  name: 'general',
  data () {
    return {
      userInfo: getUserInfo(),
      flag: false,
      dialog: {
        dialogOneVisible: false,
        dialogTwoVisible: false,
        dialogThreeVisible: false,
        dialogFourVisible: false,
        dialogFiveVisible: false,
        dialogSixVisible: false
      },
      tableDataOne: [],
      tableDataTwo: [],
      tableDataThree: [],
      tableDataFour: [],
      tableDataFive: [],
      tableDataSix: [],
      oneDialog: {
        form: {
          radio: '小时',
          name: '',
          desc: ''
        },
        editor: {
          unit: '',
          production: '',
          remark: ''
        }
      },
      twoDialog: {
        form: {
          radio: '件',
          name: ''
        }
      },
      threeDialog: {
        form: {
          name: ''
        }
      },
      fourDialog: {
        form: {
          name: ''
        }
      },
      fiveDialog: {
        form: {
          elementName: '',
          manager: '',
          prepareTime: ''
        }
      },
      sixDialog: {
        form: {
          name: ''
        }
      },
      disabel: true
    }
  },
  mounted () {
    this.getOneTableList()
    this.getTwoTableList()
    this.getThreeTableList()
    this.getFourTableList()
    this.getFiveTableList()
    this.getSixTableList()
  },
  methods: {
    showDialogVisible (num) {
      this.dialog.dialogOneVisible = false
      this.dialog.dialogTwoVisible = false
      this.dialog.dialogThreeVisible = false
      this.dialog.dialogFourVisible = false
      this.dialog.dialogFiveVisible = false
      this.dialog.dialogSixVisible = false
      if (num === 1) {
        this.dialog.dialogOneVisible = true
        this.getOneTableList()
      }
      if (num === 2) {
        this.dialog.dialogTwoVisible = true
        this.getTwoTableList()
      }
      if (num === 3) {
        this.dialog.dialogThreeVisible = true
        this.getThreeTableList()
      }
      if (num === 4) {
        this.dialog.dialogFourVisible = true
        this.getFourTableList()
      }
      if (num === 5) {
        this.dialog.dialogFiveVisible = true
        this.getFiveTableList()
      }
      if (num === 6) {
        this.dialog.dialogSixVisible = true
        this.getSixTableList()
      }
    },
    getOneTableList () {
      let params = {
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName,
        supplierId: this.userInfo.supplierId
      }
      findProductionLeadTimeList(params).then((res) => {
        if (res.data.code === 200) {
          this.tableDataOne = res.data.data
          this.isData(res.data.data)
          let i = 0
          for (;i < this.tableDataOne.length; i++) {
            this.tableDataOne[i].disabel = true
          }
        }
      }).catch(() => {
        this.isData([])
      })
    },
    // 无数据时显示图片
    isData (data) {
      let img = null
      let noTableData = null
      if (data.length <= 0) {
        noTableData = document.getElementsByClassName('el-table__empty-block')[0]
        img = document.createElement('img')
        img.src = nodata
        noTableData && noTableData.appendChild(img)
      } else {
        noTableData && noTableData.removeChild(img)
      }
    },
    getTwoTableList () {
      let params = {
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName,
        supplierId: this.userInfo.supplierId
      }
      findSaleUnitList(params).then((res) => {
        if (res.data.code === 200) {
          this.tableDataTwo = res.data.data
          this.isData(res.data.data)
          let i = 0
          for (;i < this.tableDataTwo.length; i++) {
            this.tableDataTwo[i].disabel = true
          }
        }
      }).catch(() => {
        this.isData([])
      })
    },
    getThreeTableList () {
      let params = {
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName,
        supplierId: this.userInfo.supplierId
      }
      findBeforehandFeedingCauseList(params).then((res) => {
        if (res.data.code === 200) {
          this.tableDataThree = res.data.data
          this.isData(res.data.data)
          let i = 0
          for (;i < this.tableDataThree.length; i++) {
            this.tableDataThree[i].disabel = true
          }
        }
      }).catch(() => {
        this.isData([])
      })
    },
    getFourTableList () {
      let params = {
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName,
        supplierId: this.userInfo.supplierId
      }
      findRedBlackOrderCauseList(params).then((res) => {
        if (res.data.code === 200) {
          this.tableDataFour = res.data.data
          this.isData(res.data.data)
          let i = 0
          for (;i < this.tableDataFour.length; i++) {
            this.tableDataFour[i].disabel = true
          }
        }
      }).catch(() => {
        this.isData([])
      })
    },
    getFiveTableList () {
      let params = {
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName,
        supplierId: this.userInfo.supplierId
      }
      findFullKitElementList(params).then((res) => {
        if (res.data.code === 200) {
          this.tableDataFive = res.data.data
          this.isData(res.data.data)
          let i = 0
          for (;i < this.tableDataFive.length; i++) {
            this.tableDataFive[i].disabel = true
          }
        }
      }).catch(() => {
        this.isData([])
      })
    },
    getSixTableList () {
      let params = {
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName,
        supplierId: this.userInfo.supplierId
      }
      findNotFullKitCauseList(params).then((res) => {
        if (res.data.code === 200) {
          this.tableDataSix = res.data.data
          this.isData(res.data.data)
          let i = 0
          for (;i < this.tableDataSix.length; i++) {
            this.tableDataSix[i].disabel = true
          }
        }
      }).catch(() => {
        this.isData([])
      })
    },
    resetForm (num) {
      if (num === 1) {
        this.oneDialog.form.radio = '小时'
        this.oneDialog.form.name = ''
        this.oneDialog.form.desc = ''
      }
      if (num === 2) {
        this.twoDialog.form.radio = '件'
        this.twoDialog.form.name = ''
        this.flag = false
      }
      if (num === 3) {
        this.threeDialog.form.name = ''
      }
      if (num === 4) {
        this.fourDialog.form.name = ''
      }
      if (num === 5) {
        this.fiveDialog.form.elementName = ''
        this.fiveDialog.form.manager = ''
      }
      if (num === 6) {
        this.sixDialog.form.name = ''
      }
    },
    createItem (num) {
      if (num === 1) {
        if (this.oneDialog.form.name < 99.99) {
          let params = {
            currentAccountId: this.userInfo.accountId,
            currentAccountName: this.userInfo.accountName,
            supplierId: this.userInfo.supplierId,
            remark: this.oneDialog.form.desc,
            valueSetName: `${this.oneDialog.form.name}${this.oneDialog.form.radio}`,
            type: 1
          }
          addValueSetLine(params).then((res) => {
            console.log(res)
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '新建成功!'
              })
              this.getOneTableList()
              this.oneDialog.form.radio = '小时'
              this.oneDialog.form.name = ''
              this.oneDialog.form.desc = ''
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '生产周期要小于99.99'
          })
        }
      }
      if (num === 2) {
        console.log(this.twoDialog.form.radio)
        if (this.twoDialog.form.radio === '自定义') {
          let params = {
            currentAccountId: this.userInfo.accountId,
            currentAccountName: this.userInfo.accountName,
            supplierId: this.userInfo.supplierId,
            valueSetName: this.twoDialog.form.name,
            type: 2
          }
          addValueSetLine(params).then((res) => {
            if (res.data.data === '值级已经存在') {
              this.$message({
                type: 'error',
                message: '不能重复定义'
              })
              return
            }
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '创建成功'
              })
              this.twoDialog.form.radio = '件'
              this.twoDialog.form.name = ''
              this.flag = false
            }
            this.getTwoTableList()
          })
        } else {
          let params = {
            currentAccountId: this.userInfo.accountId,
            currentAccountName: this.userInfo.accountName,
            supplierId: this.userInfo.supplierId,
            valueSetName: this.twoDialog.form.radio,
            type: 2
          }
          addValueSetLine(params).then((res) => {
            if (res.data.data === '值级已经存在') {
              this.$message({
                type: 'error',
                message: '不能重复定义'
              })
              return
            }
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '创建成功'
              })
              this.twoDialog.form.radio = '件'
            }
            this.getTwoTableList()
          })
        }
      }
      if (num === 3) {
        let params = {
          currentAccountId: this.userInfo.accountId,
          currentAccountName: this.userInfo.accountName,
          supplierId: this.userInfo.supplierId,
          valueSetName: this.threeDialog.form.name,
          type: 3
        }
        addValueSetLine(params).then((res) => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '创建成功'
            })
            this.threeDialog.form.name = ''
          }
          this.getThreeTableList()
        })
      }
      if (num === 4) {
        let params = {
          currentAccountId: this.userInfo.accountId,
          currentAccountName: this.userInfo.accountName,
          supplierId: this.userInfo.supplierId,
          valueSetName: this.fourDialog.form.name,
          type: 4
        }
        addValueSetLine(params).then((res) => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '创建成功'
            })
            this.fourDialog.form.name = ''
          }
          this.getFourTableList()
        })
      }
      if (num === 5) {
        let params = {
          currentAccountId: this.userInfo.accountId,
          currentAccountName: this.userInfo.accountName,
          supplierId: this.userInfo.supplierId,
          elementName: this.fiveDialog.form.elementName,
          manager: this.fiveDialog.form.manager
        }
        createFullKitElement(params).then((res) => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '创建成功'
            })
            this.fiveDialog.form.manager = ''
            this.fiveDialog.form.elementName = ''
          }
          this.getFiveTableList()
        })
      }
      if (num === 6) {
        let params = {
          currentAccountId: this.userInfo.accountId,
          currentAccountName: this.userInfo.accountName,
          supplierId: this.userInfo.supplierId,
          valueSetName: this.sixDialog.form.name,
          type: 5
        }
        addValueSetLine(params).then((res) => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '创建成功'
            })
            this.sixDialog.form.name = ''
          }
          this.getSixTableList()
        })
      }
    },
    editor (scope, num) {
      if (num === 1) {
        let temp = scope.row
        temp.disabel = !temp.disabel
        this.tableDataOne.splice(scope.$index, 1, temp)
      }
      if (num === 2) {
        let temp = scope.row
        temp.disabel = !temp.disabel
        this.tableDataTwo.splice(scope.$index, 1, temp)
      }
      if (num === 3) {
        let temp = scope.row
        temp.disabel = !temp.disabel
        this.tableDataThree.splice(scope.$index, 1, temp)
      }
      if (num === 4) {
        let temp = scope.row
        temp.disabel = !temp.disabel
        this.tableDataFour.splice(scope.$index, 1, temp)
      }
      if (num === 5) {
        let temp = scope.row
        temp.disabel = !temp.disabel
        this.tableDataFive.splice(scope.$index, 1, temp)
      }
      if (num === 6) {
        let temp = scope.row
        temp.disabel = !temp.disabel
        this.tableDataSix.splice(scope.$index, 1, temp)
      }
    },
    save (scope, num) {
      if (scope.row.valueName === '') {
        this.$message({
          type: 'error',
          message: '内容不能为空'
        })
        return
      }
      if (num === 1) {
        let params = {
          currentAccountId: this.userInfo.accountId,
          currentAccountName: this.userInfo.accountName,
          supplierId: this.userInfo.supplierId,
          remark: scope.row.remark,
          valueSetId: scope.row.valueSetLineId,
          valueSetName: scope.row.valueName,
          type: 1
        }
        modifyValueSetLine(params).then((res) => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.getOneTableList()
          } else {
            this.$message({
              type: 'error',
              message: res.data.data
            })
          }
        })
      }
      if (num === 2) {
        let params = {
          currentAccountId: this.userInfo.accountId,
          currentAccountName: this.userInfo.accountName,
          supplierId: this.userInfo.supplierId,
          valueSetId: scope.row.valueSetLineId,
          valueSetName: scope.row.valueName,
          type: 2
        }
        modifyValueSetLine(params).then((res) => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.getTwoTableList()
          }
        })
      }
      if (num === 3) {
        let params = {
          currentAccountId: this.userInfo.accountId,
          currentAccountName: this.userInfo.accountName,
          supplierId: this.userInfo.supplierId,
          valueSetId: scope.row.valueSetLineId,
          valueSetName: scope.row.valueName,
          type: 3
        }
        modifyValueSetLine(params).then((res) => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.getThreeTableList()
          }
        })
      }
      if (num === 4) {
        let params = {
          currentAccountId: this.userInfo.accountId,
          currentAccountName: this.userInfo.accountName,
          supplierId: this.userInfo.supplierId,
          valueSetId: scope.row.valueSetLineId,
          valueSetName: scope.row.valueName,
          type: 4
        }
        modifyValueSetLine(params).then((res) => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.getFourTableList()
          }
        })
      }
      if (num === 5) {
        if (scope.row.elementName === '' || scope.row.manager === '') {
          this.$message({
            type: 'error',
            message: '内容不能为空!'
          })
          return
        }
        let params = {
          currentAccountId: this.userInfo.accountId,
          currentAccountName: this.userInfo.accountName,
          supplierId: this.userInfo.supplierId,
          elementName: scope.row.elementName,
          fullKitElementId: scope.row.id,
          manager: scope.row.manager
        }
        modifyFullKitElement(params).then((res) => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.getFiveTableList()
          }
        })
      }
      if (num === 6) {
        let params = {
          currentAccountId: this.userInfo.accountId,
          currentAccountName: this.userInfo.accountName,
          supplierId: this.userInfo.supplierId,
          valueSetId: scope.row.valueSetLineId,
          valueSetName: scope.row.valueName,
          type: 5
        }
        modifyValueSetLine(params).then((res) => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.getSixTableList()
          }
        })
      }
    },
    remove (scope, num) {
      if (num === 1) {
        let params = {
          currentAccountId: this.userInfo.accountId,
          currentAccountName: this.userInfo.accountName,
          supplierId: this.userInfo.supplierId,
          valueSetId: scope.row.valueSetLineId
        }
        deleteValueSetLine(params).then((res) => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getOneTableList()
          }
        })
      }
      if (num === 2) {
        let params = {
          currentAccountId: this.userInfo.accountId,
          currentAccountName: this.userInfo.accountName,
          supplierId: this.userInfo.supplierId,
          valueSetId: scope.row.valueSetLineId
        }
        deleteValueSetLine(params).then((res) => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getTwoTableList()
          }
        })
      }
      if (num === 3) {
        let params = {
          currentAccountId: this.userInfo.accountId,
          currentAccountName: this.userInfo.accountName,
          supplierId: this.userInfo.supplierId,
          valueSetId: scope.row.valueSetLineId
        }
        deleteValueSetLine(params).then((res) => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getThreeTableList()
          }
        })
      }
      if (num === 4) {
        let params = {
          currentAccountId: this.userInfo.accountId,
          currentAccountName: this.userInfo.accountName,
          supplierId: this.userInfo.supplierId,
          valueSetId: scope.row.valueSetLineId
        }
        deleteValueSetLine(params).then((res) => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getFourTableList()
          }
        })
      }
      if (num === 5) {
        let params = {
          currentAccountId: this.userInfo.accountId,
          currentAccountName: this.userInfo.accountName,
          supplierId: this.userInfo.supplierId,
          fullKitElementId: scope.row.id
        }
        deleteFullKitElement(params).then((res) => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getFiveTableList()
          }
        })
      }
      if (num === 6) {
        let params = {
          currentAccountId: this.userInfo.accountId,
          currentAccountName: this.userInfo.accountName,
          supplierId: this.userInfo.supplierId,
          valueSetId: scope.row.valueSetLineId
        }
        deleteValueSetLine(params).then((res) => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getSixTableList()
          }
        })
      }
    },
    routerLinkTopath () {
      this.$router.push('/front/setting/state')
    },
    twoRadio () {
      if (this.twoDialog.form.radio === '自定义') {
        console.log(this.flag)
        this.flag = true
      } else {
        this.flag = false
      }
      console.log(this.twoDialog.form.radio)
    }
  }
}
</script>

<style lang="sass">
  @import "index"
</style>
