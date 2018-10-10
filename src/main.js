// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'  // 注释掉默认主题样式
// 引入自定义主题样式
import '../theme/index.css'
import App from './App'
import router from './router'
import '@/css/base.css'
import '@/css/changeElement.scss'
import echarts from 'echarts'
import { getUserInfo } from '@/utils/auth'
import 'babel-polyfill'
// 过滤器
import * as custom from './filters/index.js'
Object.keys(custom).forEach(key => {
  Vue.filter(key, custom[key])
})

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.prototype.echarts = echarts
// 上传文件地址
Vue.prototype.FileUploadUrl = 'http://47.97.162.215:8081/node/file_upload'
// 服务器文件地址
Vue.prototype.ServerHttp = 'http://47.97.162.215:8081/'
// 导出 || 下载
Vue.prototype.DownloadFile = (path, name) => {
  let linkTarget = document.createElement('a')
  // linkTarget.target = '_blank'
  linkTarget.href = `http://47.97.162.215:8081/${path}?fname=${name}`
  document.body.appendChild(linkTarget)
  linkTarget.click()
  // 移除隐藏的下载链接
  document.body.removeChild(linkTarget)
}
// 路由拦截
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // 判断登录
  if (!getUserInfo() || !getUserInfo().hasOwnProperty('accountId')) {
    if (to.path !== '/login') {
      return next({
        // path: '/login'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
