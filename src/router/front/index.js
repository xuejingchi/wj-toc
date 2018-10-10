// 用户设置
const account = r => require.ensure([], () => r(require('@/pages/management/account/index')), 'account')

const skuInfo = r => require.ensure([], () => r(require('@/pages/front/skuInfo/index')), 'skuInfo')
const homoGeneity = r => require.ensure([], () => r(require('@/pages/front/homoGeneity/index')), 'homoGeneity')
const setting = r => require.ensure([], () => r(require('@/pages/front/setting/index')), 'setting')
const stateSetting = r => require.ensure([], () => r(require('@/pages/front/setting/state/index')), 'stateSetting')
const accountSetting = r => require.ensure([], () => r(require('@/pages/front/setting/account/index')), 'accountSetting')
const limitSetting = r => require.ensure([], () => r(require('@/pages/front/setting/limit/index')), 'limitSetting')
const general = r => require.ensure([], () => r(require('@/pages/front/setting/general/index')), 'general')
const layOut = r => require.ensure([], () => r(require('@/views/layout/index')), 'layOut')
// 数据管理
const dataManage = r => require.ensure([], () => r(require('@/pages/front/dataManage/index')), 'dataManage')
const upload = r => require.ensure([], () => r(require('@/pages/front/dataManage/upload')), 'upload')
const errorData = r => require.ensure([], () => r(require('@/pages/front/dataManage/errorData')), 'errorData')
const unsynchronizedList = r => require.ensure([], () => r(require('@/pages/front/dataManage/unsynchronizedData/unsynchronizedList')), 'unsynchronizedList')
const unsynchronizedStock = r => require.ensure([], () => r(require('@/pages/front/dataManage/unsynchronizedData/unsynchronizedStock')), 'unsynchronizedStock')
const unsynchronizedTransaction = r => require.ensure([], () => r(require('@/pages/front/dataManage/unsynchronizedData/unsynchronizedTransaction')), 'unsynchronizedTransaction')

// 动态缓冲管理
const bufferManage = r => require.ensure([], () => r(require('@/pages/front/bufferManage/bufferManage')), 'bufferManage')
const improvement = r => require.ensure([], () => r(require('@/pages/front/improvement/improvement')), 'improvement')
// 动态缓冲管理
const repertoryDetail = r => require.ensure([], () => r(require('@/pages/front/bufferManage/repertoryDetail')), 'repertoryDetail')
// import onlineOrder from './dataAnalysisList/onlineOrder'
// import accomplishOrder from './dataAnalysisList/accomplishOrder'
// import inventoryStatus from './dataAnalysisList/inventoryStatus'
// import inventoryTransaction from './dataAnalysisList/inventoryTransaction'
// import replenishmentOrderInfo from './dataAnalysisList/replenishmentOrderInfo'
// import violateRule from './dataAnalysisList/violateRule'
// import productionColorStatistics from './dataAnalysisList/productionColorStatistics'
// import inventoryColorStatistics from './dataAnalysisList/inventoryColorStatistics'
// import productionPeriodStatistics from './dataAnalysisList/productionPeriodStatistics'
// 数据分析报表
const dataAnalysis = r => require.ensure([], () => r(require('@/pages/front/dataAnalysis/dataAnalysis')), 'dataAnalysis')

// 投料排程
const feeding = r => require.ensure([], () => r(require('@/pages/front/feeding/feeding')), 'feeding')
const replenish = r => require.ensure([], () => r(require('@/pages/front/feeding/replenish')), 'replenish')

const onlineOrder = r => require.ensure([], () => r(require('@/pages/front/dataAnalysis/dataAnalysisList/onlineOrder')), 'onlineOrder')
const accomplishOrder = r => require.ensure([], () => r(require('@/pages/front/dataAnalysis/dataAnalysisList/accomplishOrder')), 'accomplishOrder')
const inventoryStatus = r => require.ensure([], () => r(require('@/pages/front/dataAnalysis/dataAnalysisList/inventoryStatus')), 'inventoryStatus')

const inventoryTransaction = r => require.ensure([], () => r(require('@/pages/front/dataAnalysis/dataAnalysisList/inventoryTransaction')), 'inventoryTransaction')
const replenishmentOrderInfo = r => require.ensure([], () => r(require('@/pages/front/dataAnalysis/dataAnalysisList/replenishmentOrderInfo')), 'replenishmentOrderInfo')
const violateRule = r => require.ensure([], () => r(require('@/pages/front/dataAnalysis/dataAnalysisList/violateRule')), 'violateRule')

const productionColorStatistics = r => require.ensure([], () => r(require('@/pages/front/dataAnalysis/dataAnalysisList/productionColorStatistics')), 'productionColorStatistics')
const inventoryColorStatistics = r => require.ensure([], () => r(require('@/pages/front/dataAnalysis/dataAnalysisList/inventoryColorStatistics')), 'inventoryColorStatistics')
const productionPeriodStatistics = r => require.ensure([], () => r(require('@/pages/front/dataAnalysis/dataAnalysisList/productionPeriodStatistics')), 'productionPeriodStatistics')

// 缓冲报表
const bufferReport = r => require.ensure([], () => r(require('@/pages/front/bufferReport')), 'bufferReport')
const bufferReportList = r => require.ensure([], () => r(require('@/pages/front/bufferReport/list/index.vue')), 'bufferReportList')
const bufferReportPro = r => require.ensure([], () => r(require('@/pages/front/bufferReport/pro/index.vue')), 'bufferReportLPro')

// 首页仪表盘
const instrument = r => require.ensure([], () => r(require('@/pages/front/instrument')), 'instrument')
const order = r => require.ensure([], () => r(require('@/pages/front/instrument/order/order')), 'order')
const available = r => require.ensure([], () => r(require('@/pages/front/instrument/available/available')), 'available')

export default {
  path: '/front',
  component: layOut,
  meta: {
    title: 'TOC决策支撑系统'
  },
  redirect: '/front/instrument',
  children: [
    {
      path: 'account',
      name: 'account',
      component: account
    },
    {
      path: 'skuInfo',
      component: skuInfo
    },
    {
      path: 'homoGeneity',
      component: homoGeneity
    },
    {
      path: 'setting',
      component: setting,
      children: [
        {
          path: 'state',
          component: stateSetting
        },
        {
          path: 'account',
          component: accountSetting
        },
        {
          path: 'limit',
          component: limitSetting
        },
        {
          path: 'general',
          component: general
        }
      ]
    },
    {
      path: 'dataManage',
      component: dataManage,
      children: [
        {
          path: 'upload',
          component: upload
        },
        {
          path: 'errorData',
          component: errorData,
          redirect: '/front/dataManage/errorData/unsynchronizedList',
          children: [
            {
              path: 'unsynchronizedList',
              component: unsynchronizedList
            },
            {
              path: 'unsynchronizedStock',
              component: unsynchronizedStock
            },
            {
              path: 'unsynchronizedTransaction',
              component: unsynchronizedTransaction
            }
          ]
        }
      ]
    },
    {
      path: 'bufferManage',
      component: bufferManage
    },
    {
      path: 'improvement',
      component: improvement
    },
    {
      path: 'repertoryDetail',
      component: repertoryDetail
    },
    {
      path: 'dataAnalysis',
      component: dataAnalysis,
      redirect: '/front/dataAnalysis/onlineOrder',
      children: [
        {
          path: 'onlineOrder',
          component: onlineOrder
        },
        {
          path: 'accomplishOrder',
          component: accomplishOrder
        },
        {
          path: 'inventoryStatus',
          component: inventoryStatus
        },
        {
          path: 'inventoryTransaction',
          component: inventoryTransaction
        },
        {
          path: 'replenishmentOrderInfo',
          component: replenishmentOrderInfo
        },
        {
          path: 'violateRule',
          component: violateRule
        },
        {
          path: 'productionColorStatistics',
          component: productionColorStatistics
        },
        {
          path: 'inventoryColorStatistics',
          component: inventoryColorStatistics
        },
        {
          path: 'productionPeriodStatistics',
          component: productionPeriodStatistics
        }
      ]
    },
    {
      component: bufferReport,
      path: 'bufferReport',
      children: [
        {
          path: 'list',
          component: bufferReportList
        },
        {
          path: 'pro',
          component: bufferReportPro
        }
      ]
    },
    {
      path: 'feeding',
      component: feeding
    },
    {
      path: 'replenish',
      component: replenish
    },
    {
      path: 'instrument',
      component: instrument,
      children: [
        {
          path: '/',
          component: order
        },
        {
          path: 'available',
          component: available
        }
      ]
    }
  ]
}
