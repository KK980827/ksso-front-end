<template>
  <div id="login">
    <el-card shadow='hover' class='g_center'>
      <div>
        <el-image :src=appInfo.logo fit="fit" class='logo'></el-image>
      </div>
      <el-divider>{{appInfo.name}}</el-divider>
      <el-form :model="form" ref="loginForm" label-width="100px" >
        <el-form-item label="账户" prop="account" :rules="[{required:true, message:'必须输入要登陆的账户', trigger:'blur'}]">
          <el-input  v-model="form.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :rules="[{required:true, message:'必须输入要登陆账户的密码', trigger:'blur'}]">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <div>
          <el-button round type='text' @click='$router.push({path:"/reset"})' size="mini">忘记密码</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type='text' @click='$router.push({path:"/regist"})' size="mini">注册账户</el-button>
        </div>
      </el-form>
      <div>
        <el-button type="primary" size="small" round @click="login()">登录</el-button>
      </div>
    </el-card>
    <Footer></Footer>
  </div>
</template>

<script>
import { Loading } from 'element-ui';
import Footer from '../components/Footer'
export default {
  name: 'Login',
  components: {
    Footer
  },
  data () {
    return {
      appInfo: {
        name: '',
        logo:'',
      },
      form: {
        account: '',
        password: '',
        appId: ''
      },
    }
  },
  methods: {
    resetForm( formName) {
      this.$refs[formName].resetFields();
    },
    login(){
      this.$axios.post('/api/sso/login', this.transferFormData(this.form)).then(res=>{
        console.log(res);
        if(res.status){
          window.localStorage.setItem("token", res.data.token);
          window.localStorage.setItem("token_md5", this.$md5(res.data.token));
          window.sessionStorage.setItem("current_user", JSON.stringify(res.data.baseInfo));
          if(res.data.jump){
            window.open(res.data.redirectUrl,"_self");
            return;
          }
          this.$router.push({path: res.data.redirectUrl});
        }
      });
    },
    getUrlParamValue(name,url){
  　　return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ""])[1].replace(/\+/g, '%20')) || null
    },
    isExist(val){
      try{
        return val!==undefined && val!==null && val!=='' && val!=='null' && val!='undefined';
      }catch(e){
        return false;
      }
    },
    transferFormData(data){
      const formData = new FormData();
        Object.keys(data).forEach((key) => {
          if(this.isExist(data[key])){
            formData.append(key, data[key]);
          }
        });
      return formData;
    },
    loadApp(appId){
      let a = "KSSO";
      let url = "/api/app/ksso";
      if(this.isExist(appId)){
        a = appId;
        url = "/api/app/"+appId;
      }
      this.$axios.get(url).then(res=>{
        console.log(res);
        if(!res.status || !res.data.enable){
          window.loading = Loading.service({
            text:"应用["+a+"]暂时不可用，无法对其进行授权操作！",
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.95)',
            lock:true
          });
        }
        this.appInfo = res.data;
        this.form.appId = appId;
      }).catch(error=>{
        console.log(error);
      });
    }
  },
  mounted() {
    let id = this.getUrlParamValue('appId',window.location.href);
    this.loadApp(id);
  }
}
</script>

<style scoped>
  #login{
    background:whitesmoke;
    height: 100%;
    min-width: 70rem;
  }
  .el-card{
    width: 500px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -80%);
  }
  .logo{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: lightgray 1px solid;
  }
</style>
