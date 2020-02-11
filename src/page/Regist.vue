<template>
  <div id="regist">
    <Footer></Footer>
    <el-card shadow='never'>
      <div class="g_center header">
        <el-image :src="appInfo.logo"></el-image>
        <p>- 加入KSSO，快速访问BestBigKK下的所有应用 -</p>
      </div>
      <el-divider></el-divider>
      <UserForm :obj='user' model='add' @submit="add"></UserForm>
    </el-card>
  </div>
</template>

<script>
import { Loading } from 'element-ui';
import Footer from '../components/Footer.vue'
import UserForm from '../components/UserForm.vue'
export default {
  name: 'Regist',
  components: {
    Footer,
    UserForm
  },
  data () {
    return {
      appInfo:undefined,
      user:{
          account: undefined,
          identity: "NORMAL",
          expireTime: "2028-01-01 00:00:00",
          enable: true,
          forbid: false,
          loginNotice: false,
          nickname: undefined,
          sex: "男",
          age: 1,
          address: undefined,
          logo: undefined,
          email: undefined,
          school: undefined,
          introduce: undefined,
          motto: undefined,
          constellation: "处女座",
          birthday: "1998-08-27 00:00:00",
          hometown: undefined,
          job: undefined,
          phoneCode:undefined
      }
    }
  },
  methods: {
    add(user){
      let u = {};
      Object.keys(user).forEach((key) => {
          if(this.isExist(user[key])){
            u[key] = user[key];
          }
      });
      if(!this.isExist(user.phoneCode)){
        this.$alert('请输入手机：'+user.account+'接收到的短信验证码。','校验不通过',{type:'warning',showClose:false});
        return;
      }
      if(!this.isExist(user.password) || !this.isExist(user.rePassword) || user.password!=user.rePassword || user.password.length>12 || user.password.length<6){
        this.$alert('保证两次输入的密码一致，且密码长度在6~12之间。','校验不通过',{type:'warning',showClose:false});
        return;
      }
      this.$axios.post('/api/user/',this.transferFormData(u)).then(res=>{
        if(res.status){
         this.$notify({
           title: '注册成功',
           message: '欢迎加入BestBigKK大家庭，现在你可以进行登录操作了。',
           type: 'success'
         });
         this.$router.push({path:'/'});
        }
      });
    },
    resetForm( formName) {
      this.$refs[formName].resetFields();
    },
    transferFormData(data){
      const formData = new FormData();
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });
      return formData;
    },
    isExist(val){
      try{
        return val!==undefined && val!==null && val!=='' && val!=='null' && val!='undefined';
      }catch(e){
        return false;
      }
    },
    loadApp(){
      this.$axios.get("/api/app/ksso").then(res=>{
        console.log(res);
        if(res.status){
          this.appInfo = res.data;
        }
      }).catch(error=>{
        console.log(error);
      });
    },
    goBack(){
      const timer = setTimeout(()=>{
        clearTimeout(timer);
        this.$router.go(-1);
      },5000)
    },
    loadConfig(){
      this.$axios.get("/api/sys/config/").then(res=>{
        console.log(res);
        if(!res.status){
          window.loading = Loading.service({
            text:"开启注册通道失败，无法进行后续操作，请稍后重试！，5s后自动返回上一级。",
            spinner: 'el-icon-loading',
            lock:true,
            background: 'rgba(0, 0, 0, 0.95)'
          });
          this.goBack();
        }
        var msg = undefined;
        if(!res.data.enableAuthorization){
          msg = "KSSO授权服务未开启，";
        }
        if(!res.data.enableRegister){
          msg = "KSSO注册通道未开启，";
        }
        if(msg!==undefined){
          window.loading = Loading.service({
            text: "页面已禁用，" + msg + "无法进行后续操作，5s后自动返回上一级。",
            spinner: 'el-icon-loading',
            lock:true,
            background: 'rgba(0, 0, 0, 0.95)'
          });
          this.goBack();
        }
      });
    }

  },
  mounted() {
    this.loadApp();
    this.loadConfig();
  }
}
</script>

<style scoped>
  #regist{
    height: 100%;
  }
  .el-card{
    width: 70rem;
    margin: 10px auto 100px;
  }
  .logo{
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .header > .el-image{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: lightgray 1px solid;
  }
  .header>p{
    font-size: 12px;
    color: #333;
    margin-top: 10px;
  }
</style>
