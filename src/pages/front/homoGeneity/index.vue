<template>
  <div class="home-list">
    <div class="title">关闭齐套元素</div>
    <div class="search-condition">
      <div class="condition-title clearfix">
        <div class="f-l">查询搜索</div>
        <div class="f-r open-btn">
          <el-button class="search-btn btn" @click="search">查询结果</el-button>
        </div>
      </div>
      <div class="condition clearfix">
        <div class="item">
          <div class="name">工单编号：</div>
          <div class="value">
            <el-input v-model="workOrderCode" placeholder="请输入工单号" clearable></el-input>
          </div>
        </div>
        <div class="item clearfix">
          <div class="name">是否齐套：</div>
          <div class="value">
            <el-select v-model="fitKitting" placeholder="是否齐套">
              <el-option label="请选择" value=""></el-option>
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="2"></el-option>
            </el-select>
          </div>
        </div>
        <div class="item">
          <div class="name">要求齐套时间：</div>
          <div class="value">
            <div class="start-time f-l">
              <el-date-picker
                v-model="beforeAdviseReleaseDate"
                type="date"
                placeholder="开始时间"
                class="start-input"
              >
              </el-date-picker>
            </div>
            <i class="f-l line">-</i>
            <div class="f-l end-time">
              <el-date-picker
                v-model="afterAdviseReleaseDate"
                type="date"
                placeholder="结束时间"
                class="end-input"
              >
              </el-date-picker>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="search-list">
      <div class="condition-title clearfix">
        <div class="f-l">列表</div>
        <div class="f-r open-btn">
          <el-button class="ghost-btn" @click="exportFullKitInfoList">导出表格</el-button>
        </div>
      </div>
      <div class="list">
        <el-table
          :data="tableData5"
          border
          style="width: 100%"
          @expand-change="showDetail">
          <el-table-column type="expand" >
            <template slot-scope="props" >
              <!-- <div v-if="props.row.findWorkList.length > 0"> -->
                <div v-for="(item, index) in props.row.findWorkList" :key="index">
                  <div class="homoGeneity-list">
                    <div class="detail" ></div>
                    <div class="detail" >{{item.fullKitElementName}}</div>
                    <div class="detail" >{{item.fullKitCompleteTargetDate | timeFormat('YYYY-MM-DD')}}</div>
                    <div class="detail" >{{item.fullKitDate | timeFormat('YYYY-MM-DD') }}</div>
                    <div class="detail" >
                      <el-checkbox v-if="props.row.permissions.fullkit_close !== '1'" v-model="item.selectedBool" @change="changeStatus(item)">
                        <template v-if="item.selectedBool">已齐套</template>
                        <template v-else>未齐套</template>
                      </el-checkbox>
                      <div v-else>
                        {{ item.selectedBool ? '已齐套' : '未齐套'}}
                      </div>
                    </div>
                    <div class="detail" >
                      {{item.fullKitElementManager}}
                    </div>
                    <div class="detail" ></div>
                    <div class="detail" ></div>
                  </div>
                </div>
              <!-- </div> -->
              <!-- <div v-else style="line-height:46px;height46px;text-align:center">暂无数据</div> -->
            </template>
          </el-table-column>
          <el-table-column
            label="工单编号"
            prop="workOrderCode">
          </el-table-column>
          <el-table-column
            label="齐套元素"
            prop="name">
          </el-table-column>
          <el-table-column
            label="要求齐套时间"
            prop="fullKitCompleteTargetDate">
            <template slot-scope="scope">
              {{ scope.row.fullKitCompleteTargetDate | timeFormat('YYYY-MM-DD') }}
            </template>
          </el-table-column>
          <el-table-column
            label="实际齐套时间"
            prop="actualFullKitDate">
            <template slot-scope="scope">
              <span v-if="scope.row.fullKittingCount !== scope.row.fullKitElementTotal">未齐套</span>
              <span v-else>{{ scope.row.actualFullKitDate | timeFormat('YYYY-MM-DD') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="是否齐套"
            prop="desc">
            <template slot-scope="scope">
              齐套情况(已齐套要素/总){{ scope.row.fullKittingCount }}/{{scope.row.fullKitElementTotal}}
            </template>
          </el-table-column>
          <el-table-column
            label="齐套负责人"
            prop="fullKitManager">
          </el-table-column>
          <el-table-column
            label="备注">
            <template slot-scope="scope">
              <el-select v-if="scope.row.permissions.fullkit_reason_fill !== '1'" v-model="scope.row.notFullKitCause" placeholder="选择未齐套原因" @change="changeFull(scope.row)">
                <el-option
                  v-for="item in optionsList"
                  :key="item.valueSetLineId"
                  :label="item.valueName"
                  :value="item.valueSetLineId + ';' + item.valueName + ''">
                </el-option>
              </el-select>
              <div v-else>{{ scope.row.notFullKitCause }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            prop="desc">
            <template slot-scope="scope">
              <el-button v-if="scope.row.permissions.fullkit_close !== '1' && scope.row.fullKittingCount === scope.row.fullKitElementTotal && scope.row.status === 2" type="text" @click="close(scope.row)">关闭齐套</el-button>
              <el-button v-if="scope.row.permissions.fullkit_close !== '1' && (scope.row.status === 1 || scope.row.fullKittingCount !== scope.row.fullKitElementTotal)" type="text" @click="closeTitle()">关闭齐套</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalSize"
          style="text-align:right;background-color:#FFF;height:80px;padding-top:30px;">
        </el-pagination>
      </div>
    </div>
    <el-dialog
      title="关闭齐套元素"
      :visible.sync="dialogVisible"
      width="30%">
      <span>是否关闭该齐套元素？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createQitao">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="关闭齐套元素"
      :visible.sync="dialogVisibleTwo"
      width="30%">
      <span>是否关闭该齐套元素？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleTwo = false">取 消</el-button>
        <el-button type="primary" @click="closeQitao">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getUserInfo } from '@/utils/auth'
import { findFullKitInfoList, findWorkOrderFullKitElementList, findNotFullKitCauseList, setWorkOrderCloseFullKit, modifyWorkOrderNotFullKitCause, exportFullKitInfoList, createWOFullKitElementRel, deleteWOFullKitElementRel } from '@/api/front/homoGeneity/homoGeneity'
export default {
  name: 'supplierList',
  data () {
    return {
      userInfo: getUserInfo(),
      totalSize: 0,
      pageNo: 1,
      pageSize: 10,
      checked: false,
      dialogVisible: false, // 关闭齐套
      dialogVisibleTwo: false,
      afterAdviseReleaseDate: '',
      beforeAdviseReleaseDate: '',
      fitKitting: '',
      workOrderCode: '',
      workOrderCodeClose: '',
      workOrderCodeCreate: '',
      skuFullKitRelId: '',
      fullKitElementId: '',
      workOrderFullKitRelId: '',
      findWorkList: [],
      optionsList: [], // 未齐套原因
      tableData5: []
    }
  },
  mounted () {
    this.getNotKitList() // 未齐套原因
    this.search()
  },
  methods: {
    // 更改状态操作
    changeStatus (item) {
      this.skuFullKitRelId = item.skuFullKitRelId
      this.fullKitElementId = item.fullKitElementId
      this.workOrderFullKitRelId = item.workOrderFullKitRelId
      if (item.selectedBool === false) {
        this.dialogVisible = true
      } else if (item.selectedBool === true) {
        let params = {
          currentAccountId: this.userInfo.accountId,
          currentAccountName: this.userInfo.accountName,
          supplierId: this.userInfo.supplierId,
          skuFullKitRelId: this.skuFullKitRelId,
          fullKitElementId: this.fullKitElementId,
          workOrderCode: this.workOrderCodeCreate
        }
        createWOFullKitElementRel(params).then(res => {
          if (res.data.code === 200) {
            this.$alert('更改成功', {
              confirmButtonText: '确定',
              callback: () => {
                window.location.reload()
              }
            })
          }
        })
      }
    },
    // 分页大小
    handleSizeChange (val) {
      this.pageSize = val
      this.search()
    },
    // 下一页
    handleCurrentChange (val) {
      this.pageNo = val
      this.search()
    },
    // 展开
    showDetail (row, expandedRows) {
      this.workOrderCodeCreate = row.workOrderCode
      let params = {
        supplierId: this.userInfo.supplierId,
        workOrderCode: row.workOrderCode
      }
      findWorkOrderFullKitElementList(params).then(res => {
        if (res.data.code === 200) {
          this.$set(row, 'findWorkList', res.data.data)
        }
      })
    },
    // 查询
    search () {
      let params = {
        supplierId: this.userInfo.supplierId,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        afterAdviseReleaseDate: this.afterAdviseReleaseDate === '' ? null : this.afterAdviseReleaseDate.getTime(),
        beforeAdviseReleaseDate: this.beforeAdviseReleaseDate === '' ? null : this.beforeAdviseReleaseDate.getTime(),
        fitKitting: this.fitKitting === '' ? null : this.fitKitting,
        workOrderCode: this.workOrderCode,
        currentAccountId: getUserInfo().accountId
      }
      findFullKitInfoList(params).then(res => {
        if (res.data.code === 200) {
          res.data.data.list.forEach(item => {
            if (item.notFullKitCause === null) {
              item.notFullKitCause = ''
            }
            item.showId = ''
            item.findWorkList = []
            // this.showDetail(item)
          })
          this.totalSize = parseInt(res.data.data.totalSize, 10)
          this.tableData5 = res.data.data.list
        }
      })
    },
    // 为关闭齐套原因
    getNotKitList () {
      let params = {
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName,
        supplierId: this.userInfo.supplierId
      }
      findNotFullKitCauseList(params).then(res => {
        if (res.data.code === 200) {
          this.optionsList = res.data.data
        }
      })
    },
    // 关闭齐套
    close (row) {
      this.dialogVisibleTwo = true
      this.workOrderCodeClose = row.workOrderCode
    },
    // 关闭齐套确认
    closeQitao () {
      let params = {
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName,
        supplierId: this.userInfo.supplierId,
        workOrderCode: this.workOrderCodeClose
      }
      setWorkOrderCloseFullKit(params).then(res => {
        if (res.data.code === 200) {
          this.dialogVisibleTwo = false
          this.search()
        }
      })
    },
    // 更改齐套原因
    changeFull (item) {
      let notArry = item.notFullKitCause.split(';')
      let params = {
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName,
        supplierId: this.userInfo.supplierId,
        workOrderCode: item.workOrderCode,
        notFullKitCauseId: notArry[0],
        notFullKitCause: notArry[1]
      }
      modifyWorkOrderNotFullKitCause(params).then(res => {
        if (res.data.code === 200) {
          this.search()
        }
      })
    },
    // 导出齐套表格
    exportFullKitInfoList () {
      let params = {
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName,
        supplierId: this.userInfo.supplierId
      }
      exportFullKitInfoList(params).then(res => {
        if (res.data.code === 200) {
          let data = res.data.data
          this.DownloadFile(data.fileUrl, data.fileName)
        }
      })
    },
    // 确定齐套创建按钮
    createQitao () {
      this.dialogVisible = false
      let params = {
        supplierId: this.userInfo.supplierId,
        workOrderFullKitRelId: this.workOrderFullKitRelId
      }
      deleteWOFullKitElementRel(params).then(res => {
        if (res.data.code === 200) {
          this.$alert('更改成功', {
            confirmButtonText: '确定',
            callback: () => {
              window.location.reload()
            }
          })
        }
      })
    },
    // 弹出提示
    closeTitle () {
      this.$confirm('是否关闭齐套?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
    }
  }
}
</script>

<style lang="sass">
  @import "index"
</style>
