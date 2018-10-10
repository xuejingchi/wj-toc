const account = r => require.ensure([], () => r(require('@/pages/management/account/index')), 'account')
const layOut = r => require.ensure([], () => r(require('@/views/layout/index')), 'layOut')
const supplierList = r => require.ensure([], () => r(require('@/pages/management/supplier/index')), 'supplierList')
const accountSetting = r => require.ensure([], () => r(require('@/pages/management/accountSetting/index')), 'accountSetting')

export default {
  path: '/management',
  component: layOut,
  meta: {
    title: 'TOC后台管理系统'
  },
  redirect: '/management/supplierList',
  children: [
    {
      path: 'supplierList',
      component: supplierList
    },
    {
      path: 'accountSetting',
      component: accountSetting
    },
    {
      path: 'account',
      name: 'account',
      component: account
    }
  ]
}
