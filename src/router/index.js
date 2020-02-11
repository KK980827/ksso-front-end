import Vue from 'vue'
import Router from 'vue-router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import Login from '@/page/Login'
import Manage from '@/page/Manage'
import Regist from '@/page/Regist'
import ResetPwd from '@/page/ResetPwd.vue'
import Info from '@/page/Info.vue'
import ManageApp from '@/components/ManageApp'
import ManageSysConfig from '@/components/ManageSysConfig'
import ManageUser from '@/components/ManageUser'
import ManageUserUpdate from '@/components/ManageUserUpdate'
import ManageUserNew from '@/components/ManageUserNew'

Vue.use(Router)
Vue.use(ElementUI)

const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => {
    console.log("路由错误");
    console.log(error);
  })
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
      meta: {
       title: '统一授权中心',
       requireAuth: false
      }
    },
    {
      path: '/reset',
      name: 'ResetPwd',
      component: ResetPwd,
      meta: {
       title: '重置密码',
       requireAuth: false
      }
    },
    {
      path: '/info',
      name: 'Info',
      component: Info,
      meta: {
       title: '我的信息',
       requireAuth: false
      }
    },
    {
      path: '/regist',
      name: 'Regist',
      component: Regist,
      meta: {
       title: '注册',
       requireAuth: false
      }
    },
    {
      path: '/manage',
      name: 'Manage',
      component: Manage,
      children:[
        {
          path: 'app',
          name: 'ManageApp',
          component: ManageApp,
          meta: {
           requireAuth: true
          }
        },
        {
          path: 'config',
          name: 'ManageSysConfig',
          component: ManageSysConfig,
          meta: {
           requireAuth: true
          }
        },
        {
          path:'user',
          name:'ManageUser',
          component: ManageUser,
          meta:{
           requireAuth: true
          }
        },
        {
          path:'user/update/:account',
          name:'ManageUserUpdate',
          component: ManageUserUpdate,
          meta:{
           requireAuth: true
          }
        },
        {
          path:'user/new',
          name:'ManageUserNew',
          component: ManageUserNew,
          meta:{
           requireAuth: true
          }
        }
      ]
    }
  ]
})
