<template>
  <div class="state">
    <div class="title">位置设置</div>
    <!-- eslint-disable -->
    <router-link class="back" :to="{ path: '/front/setting' }"><-返回上一页</router-link>
    <div class="func">
      <el-button class="add-btn" type="primary" @click="newState = true">新建位置</el-button>
      <el-dialog
        title="新增位置"
        :visible.sync="newState"
        width="50%"
        center>
        <el-form :model="newData" ref="newState" label-width="100px">
          <el-form-item label="类型" prop="typeName">
            <el-select v-model="newData.locationType">
              <el-option
                v-for="item in selectItem"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="位置编号" prop="locationCode">
            <el-input v-model="newData.locationCode"></el-input>
          </el-form-item>
          <el-form-item label="位置描述" prop="description">
            <el-input v-model="newData.description"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="createState">新 增</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="search">
      <div class="search-title clearfix">
        <div class="f-l">查询</div>
        <span class="f-r">
          <span class="search-btn btn" @click="search">查询结果</span>
        </span>
      </div>
      <div class="search-condition clearfix">
        <div class="item clearfix">
          <div class="name">位置编号:</div>
          <div class="value">
            <el-input placeholder="位置编号" clearable v-model="searchData.locationCode"></el-input>
          </div>
        </div>
        <div class="item clearfix">
          <div class="name">位置描述:</div>
          <div class="value">
            <el-input placeholder="位置描述" clearable v-model="searchData.description"></el-input>
          </div>
        </div>
        <div class="item clearfix">
          <div class="name">类型:</div>
          <div class="value">
            <el-select v-model="searchData.locationType">
              <el-option
                v-for="item in selectItem"
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
      <div class="search-title clearfix">
        <div class="f-l">报告</div>
      </div>
      <div class="search-result">
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="typeName"
            label="类型">
            <template slot-scope="scope">
              <span v-if="scope.row.locationType === 1">生产线</span>
              <span v-if="scope.row.locationType === 2">工作站</span>
              <span v-if="scope.row.locationType === 3">工厂</span>
              <span v-if="scope.row.locationType === 4">仓库</span>
              <span v-if="scope.row.locationType === 5">供应商</span>
              <span v-if="scope.row.locationType === 6">客户</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="locationCode"
            label="位置编号">
          </el-table-column>
          <el-table-column
            prop="description"
            label="位置描述">
          </el-table-column>
          <el-table-column
            prop="operate"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="modifyState(scope.row)">修改</el-button>
              <el-button type="text" @click="deleteState(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      title="修改位置"
      :visible.sync="modifyType"
      width="50%"
      center>
      <el-form :model="modifyData" label-width="100px">
        <el-form-item label="类型" prop="typeName">
          <span v-if="modifyData.locationType === 1">生产线</span>
          <span v-if="modifyData.locationType === 2">工作站</span>
          <span v-if="modifyData.locationType === 3">工厂</span>
          <span v-if="modifyData.locationType === 4">仓库</span>
          <span v-if="modifyData.locationType === 5">供应商</span>
          <span v-if="modifyData.locationType === 6">客户</span>
        </el-form-item>
        <el-form-item label="位置编号" prop="locationCode">
          {{ modifyData.locationCode }}
        </el-form-item>
        <el-form-item label="位置描述" prop="description">
          <el-input v-model="modifyData.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureModify">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserInfo } from '@/utils/auth'
import { findLocationInfoList, createLocationInfo, deleteLocationInfo, modifyLocationInfo } from '@/api/front/setting/index'
export default {
  name: 'state',
  data () {
    return {
      newState: false,
      modifyType: false,
      searchData: {},
      selectItem: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '生产线'
        }, {
          value: 2,
          label: '工作站'
        }, {
          value: 3,
          label: '工厂'
        }, {
          value: 4,
          label: '仓库'
        }, {
          value: 5,
          label: '供应商'
        }, {
          value: 6,
          label: '客户'
        }
      ],
      newData: {},
      tableData: [
        {
          typeName: '生产线',
          locationCode: '123',
          description: 'hxss',
          operate: ''
        }
      ],
      modifyData: {}
    }
  },
  mounted () {
    const data = {
      supplierId: getUserInfo().supplierId
    }
    this.fetchListInfo(data)
  },
  methods: {
    fetchListInfo (data) {
      findLocationInfoList(data).then(res => {
        this.tableData = res.data.data
      })
    },
    search () {
      const data = this.searchData
      data.supplierId = getUserInfo().supplierId
      if (data.locationType === 0) {
        delete data.locationType
      }
      this.fetchListInfo(data)
    },
    createState () {
      const data = this.newData
      data.currentAccountId = getUserInfo().accountId
      data.currentAccountName = getUserInfo().accountName
      data.supplierId = getUserInfo().supplierId
      createLocationInfo(data).then(res => {
        if (res.data.code === 200) {
          this.$alert('添加成功', {
            confirmButtonText: '确定',
            callback: () => {
              window.location.reload()
            }
          })
        } else {
          this.$alert(res.data.data, {
            confirmButtonText: '确定',
            callback: () => {
              window.location.reload()
            }
          })
        }
      })
    },
    sureModify () {
      const data = {
        currentAccountId: getUserInfo().accountId,
        currentAccountName: getUserInfo().accountName,
        supplierId: getUserInfo().supplierId,
        locationCode: this.modifyData.locationCode,
        description: this.modifyData.description
      }
      modifyLocationInfo(data).then(res => {
        if (res.data.code === 200) {
          this.$alert('修改成功', {
            confirmButtonText: '确定',
            callback: () => {
              window.location.reload()
            }
          })
        } else {
          this.$alert(res.data.data, {
            confirmButtonText: '确定'
          })
        }
      })
    },
    modifyState (index) {
      this.modifyType = true
      this.modifyData = index
    },
    deleteState (index) {
      const data = {
        currentAccountId: getUserInfo().accountId,
        currentAccountName: getUserInfo().accountName,
        supplierId: getUserInfo().supplierId,
        locationCode: index.locationCode
      }
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLocationInfo(data).then(res => {
          if (res.data.code === 200) {
            this.$alert('删除成功', {
              confirmButtonText: '确定',
              callback: () => {
                window.location.reload()
              }
            })
          } else {
            this.$alert(res.data.data, {
              confirmButtonText: '确定'
            })
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    }
  }
}
</script>
<style lang="sass">
  @import "index"
</style>
