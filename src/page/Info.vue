<template>
  <div id="info">
    <Footer></Footer>
    <el-card shadow='never'>
      <div class="g_center header" v-if="appInfo!==undefined">
        <el-image :src="appInfo.logo"></el-image>
        <p>- 这是您在KSSO系统的身份信息 -</p>
      </div>
      <el-divider></el-divider>
      <UserForm :obj='user' model='update' @submit="update" identity='normal'></UserForm>
    </el-card>
  </div>
</template>

<script>
import { Loading } from 'element-ui';
import Footer from '../components/Footer.vue'
import UserForm from '../components/UserForm.vue'
import qs from 'qs'
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
    loadUserInfo(){
      this.$axios.get('/api/user/').then(res=>{
        if(res.status){
          this.user = res.data;
        }
      })
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
    update(user){
      let u = {};
      Object.keys(user).forEach((key) => {
          if(this.isExist(user[key])){
            u[key] = user[key];
          }
      });
      console.log(user);
      console.log(u);
      this.$axios.put('/api/user/?'+qs.stringify(u)).then(res=>{
        if(res.status){
          this.$notify({
            title: '更新用户信息成功',
            message: 'UserID:'+res.data.id,
            type: 'success',
            position: 'top-left'
          });
        }
      });
    }
  },
  mounted() {
    this.loadApp();
    this.loadUserInfo();
  }
}
</script>

<style scoped>
  #info{
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
