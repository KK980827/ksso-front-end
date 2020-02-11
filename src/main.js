import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import md5 from 'js-md5';
import { Loading } from 'element-ui';

Vue.config.productionTip = true
Vue.prototype.$md5 = md5;

/* 原型************************************************************************************************************************************/
Date.prototype.Format = function (fmt) {
  var o = {
      "M+": this.getMonth() + 1, //月份
      "d+": this.getDate(), //日
      "h+": this.getHours(), //小时
      "m+": this.getMinutes(), //分
      "s+": this.getSeconds(), //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

/* Axios配置 ******************************************************************************************************************************/
axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = 'http://localhost:8888';

let loadingIns = undefined;
axios.interceptors.request.use((config) => {
    loadingIns = Loading.service({
      text:"请求中...",
      lock:true,
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.8)'
    });

    //追加Token
    const t = window.localStorage.getItem("token");
    if(t!==undefined && t!=null){
      config.headers['token'] = t;
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
    }

    return config;
},(error) =>{
    console.log('错误的传参')
    if(loadingIns!==undefined){
      loadingIns.close();
      loadingIns=undefined;
    }
    return Promise.reject(error);
});

axios.interceptors.response.use((res) =>{
    if(loadingIns!==undefined){
      loadingIns.close();
      loadingIns=undefined;
    }
    if(!res.data.status || res.data.code!=1){
      let c = res.data.code;
      var type = c==2 ? 'info' : c==3 ? 'warning' : 'error';
      if(c==403){
        window.vm.$confirm('当前所使用的令牌已经过期,请重新验证身份来获取一个新的令牌.点击[确定]将会跳转到登录页面来重新获取令牌,如果在当前页面下您持有未保存的工作,可以点击[稍后]来继续进行工作.', '身份过期', {
          confirmButtonText: '确定',
          cancelButtonText: '稍后',
          center:true,
          type: 'warning'
        }).then(() => {
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("token_md5");
          window.sessionStorage.removeItem("current_user");
          window.open("/","_self");
        }).catch(() => {
          window.vm.$message({
            type: 'warning',
            message: '请继续,但由于令牌已经失效,在未重新认证之前,您将无法进行任何有效的操作.',
            duration: 5000
          });
        });
      }else{
        window.vm.$alert(res.data.msg+"["+c+"]",window.alert_title,{
          type: type,
          showClose: false
        });
      }
      return Promise.resolve(res.data);
    }
    return res.data;
},(error) => {
    if(loadingIns!==undefined){
      loadingIns.close();
      loadingIns=undefined;
    }
    window.vm.$alert(error,window.alert_title,{
      type: 'error',
      showClose: false
    });
    return Promise.reject(error);
});
Vue.prototype.$axios = axios


/* 全局路由身份验证**************************************************************************************************************************/
router.beforeEach((to, from, next) => {
  const path = to.path;
  if(path.startsWith('/manage')) {
    if(to.meta.requireAuth){
      const md5 = window.localStorage.getItem("token_md5");
      if(md5==undefined || md5==null){
        next({path:'/'})
      }
      console.log("身份校验通过");
      next();
    }else{
      next();
    }
  }else{
    next();
 }
});

/***********************************************************************************************************************************************/
window.vm = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
