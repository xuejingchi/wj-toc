import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login/login'
import managementRoutes from './management'
import frontRoutes from './front'

Vue.use(Router)

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '',
      name: 'index',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    managementRoutes,
    frontRoutes
  ]
})
