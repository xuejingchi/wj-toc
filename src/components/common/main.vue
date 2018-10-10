<template>
  <div class="main-view clearfix">
    <div class="slider">
      <el-col>
        <el-menu
          :default-active="'supplierList'"
          class="el-menu-vertical-demo"
          @select="changeChildrenRoute">
          <div :key="item.path" v-for="item in childRoutes">
            <el-submenu v-if="item.subRoutes" :index="item.path">
              <template slot="title">
                <span slot="title" style="display: block; width: 100%;" @click="configOwnPage(item.hasOwnPage, item.path)">{{ item.name }}</span>
              </template>
              <div :key="subItem.path" v-for="subItem in item.subRoutes">
                <el-submenu v-if="subItem.thirdRoutes" :index="subItem.path">
                  <template slot="title">
                    <span style="display: block; width: 100%;" @click="configOwnPage(subItem.hasOwnPage, subItem.path)" slot="title">{{ subItem.name }}</span>
                  </template>
                  <el-menu-item v-for="thirdItem in subItem.thirdRoutes" :key="thirdItem.path" :index="thirdItem.path">
                    {{ thirdItem.name }}
                  </el-menu-item>
                </el-submenu>
                <el-menu-item v-else :key="subItem.path" :index="subItem.path">
                  {{ subItem.name }}
                </el-menu-item>
              </div>
            </el-submenu>
            <el-menu-item v-else :class="item.path === 'supplierList' ? 'isActive' : ''" :key="item.path" :index="item.path">
              {{ item.name }}<span v-if="item.count" class="message-num">45</span>
            </el-menu-item>
          </div>
        </el-menu>
      </el-col>
    </div>
    <div class="main-view">
      <router-view />
    </div>
  </div>
</template>

<script>
import { findMenuInfoList } from '@/api/login/login'
import { getUserInfo } from '@/utils/auth'
export default {
  name: 'mainView',
  data () {
    return {
      managementRoutes: [
        {
          path: 'supplierList',
          name: '供应商基础信息管理'
        }
      ],
      frontRoutes: [
        {
          path: '/front',
          name: '首页仪表盘',
          menuCode: '10000002'
        },
        {
          path: '/front/feeding',
          name: '投料排程',
          menuCode: '10000003'
        },
        {
          path: '/front/bufferReport/list',
          name: '缓冲报表',
          menuCode: '10000004'
        },
        {
          path: '/front/homoGeneity',
          name: '齐套管理',
          menuCode: '10000005'
        },
        {
          path: '/front/bufferManage',
          name: '动态缓冲管理',
          menuCode: '10000006'
        },
        {
          path: '/front/improvement',
          name: '持续改进',
          menuCode: '10000007'
        },
        {
          path: '/front/dataAnalysis',
          name: '数据分析报表',
          menuCode: '10000008'
        },
        {
          path: '/front/skuInfo',
          name: 'SKU管理',
          subRoutes: [
            {
              path: '/front/skuInfo',
              name: 'SKU信息'
            }
          ],
          menuCode: '10000009'
        },
        {
          path: '/front/setting',
          name: '设置',
          subRoutes: [{
            path: '/front/setting/general',
            name: '通用设置',
            menuCode: '10000059'
          }, {
            path: '/front/setting/limit',
            name: '权限设置',
            menuCode: '10000060'
          }],
          menuCode: '10000010'
        },
        {
          path: '/front/dataManage',
          name: '数据管理',
          subRoutes: [
            {
              path: '/front/dataManage/upload',
              name: '数据上传',
              menuCode: '10000078'
            },
            {
              path: '/front/dataManage/errorData',
              name: '未同步数据',
              menuCode: '10000079'
            }
          ],
          menuCode: '10000011'
        }
      ],
      index: '/front',
      userInfo: getUserInfo()
    }
  },
  computed: {
    childRoutes () {
      return this.$route.path.split('/')[1] === 'management' ? this.managementRoutes : this.frontRoutes
    }
  },
  created () {
    // 超管用户下显示账户管理
    let accountMaster = getUserInfo().accountMaster
    if (accountMaster === 1) {
      this.managementRoutes.push(
        {
          path: 'accountSetting',
          name: '账户管理'
        }
      )
    }
    // 登出时跳转至登录页
    if (JSON.stringify(this.userInfo) === '{}') {
      this.$router.push(
        {
          path: '/login'
        }
      )
      return
    }
    this.loadData()
    this.index = this.$route.path
  },
  mounted () {
    console.log('userInfo', getUserInfo())
  },
  methods: {
    changeChildrenRoute (index) {
      this.$router.push(`${index}`)
    },
    /*
    * 加载数据
    * */
    loadData () {
      // 获取一级权限列表
      this.getSingleLevelMenu(this.frontRoutes)
    },
    /*
    * 获取单级权限列表
    * */
    getSingleLevelMenu (data, parentId) {
      let params = {
        currentAccountId: this.userInfo.accountId,
        currentAccountName: this.userInfo.accountName
      }
      if (arguments.length === 2) {
        params.parentId = parentId
      }
      findMenuInfoList(params).then(res => {
        if (res.data.code === 200) {
          let menuInfo = res.data.data
          data = this.getIntersectionByMenuCode(this.frontRoutes, menuInfo)
          this.configSubRoutes(data)
        }
      })
    },
    /*
    * 判断二级目录
    * */
    configSubRoutes (data) {
      if (data.length) {
        data.forEach(item => {
          if (item.subRoutes && item.subRoutes.length) {
            this.getSingleLevelMenu(item.subRoutes, item.id)
          }
        })
      }
    },
    /*
    * 获取两个数组的交集数组
    * */
    getIntersectionByMenuCode (arr1, arr2) {
      if (!arr1.length || !arr2.length) {
        return []
      }
      let returnArr = []
      arr1.forEach(item1 => {
        arr2.forEach(item2 => {
          if (item1.menuCode === item2.menuCode) {
            item1.id = item2.id
            returnArr.push(item1)
          }
        })
      })
      return returnArr
    },
    /*
    * 判断是否有当前模块页面
    * */
    configOwnPage (flag, path) {
      console.log(flag)
      if (flag && this.$route.path !== path) {
        this.$router.push(path)
        this.index = path
      }
    }
  }
}
</script>

<style lang="sass">
  @import "index"
</style>
