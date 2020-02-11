<template>
  <div id="resetPwd">
    <el-card shadow='always'>
      <div class="g_center">
        <el-image :src=appInfo.logo fit="fit" class='logo'></el-image>
      </div>
      <el-divider>{{appInfo.name}}</el-divider>
      <el-form :model="form" ref="resetForm" label-width="100px" >
        <el-form-item label="账户" prop="account" :rules="[{required:true, message:'必须输入要登陆的账户', trigger:'blur'}]">
          <el-input  v-model="form.account"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password" :rules="[{min:6, max:12, message:'密码长度6~12位', trigger:'blur'},{required:true, message:'必须输入要登陆账户的密码', trigger:'blur'}]">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword" :rules="[{min:6, max:12, message:'密码长度6~12位', trigger:'blur'},{required:true, message:'必须输入要登陆账户的密码', trigger:'blur'}]">
          <el-input v-model="form.rePassword"></el-input>
        </el-form-item>
        <el-form-item label="短信验证码:" prop="rePassword" :rules="[{required:true, message:'必须输入收到的手机验证码', trigger:'blur'}]">
          <el-input style='width: 200px;' v-model="form.phoneCode"></el-input>
          <el-divider direction="vertical"></el-divider>
          <el-button type="primary" size="small">获取验证码</el-button>
        </el-form-item>
      </el-form>
      <div class="g_center">
        <el-button type="info" size="small" round @click='$router.go(-1)'>返回</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button type="primary" size="small" round @click='reset()'>重置密码</el-button>
      </div>
    </el-card>
    <Footer></Footer>
  </div>
</template>

<script>
import { Loading } from 'element-ui';
import Footer from '../components/Footer'
import qs from 'qs'
export default {
  name: 'ResetPwd',
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
        rePassword:'',
        phoneCode:''
      },
    }
  },
  methods: {
    reset(){
      this.$refs['resetForm'].validate((valid) => {
        if (valid) {
           if(!this.isExist(this.form.phoneCode)){
             this.$alert('请输入手机：'+this.form.account+'接收到的短信验证码。','校验不通过',{type:'warning',showClose:false});
             return;
           }
           if(!this.isExist(this.form.password) || !this.isExist(this.form.rePassword) || this.form.password!=this.form.rePassword || this.form.password.length>12 || this.form.password.length<6){
             this.$alert('保证两次输入的密码一致，且密码长度在6~12之间。','校验不通过',{type:'warning',showClose:false});
             return;
           }
           this.$axios.put('/api/user/?'+qs.stringify(this.form)).then(res=>{
             if(res.status){
               this.$notify({
                 title: '重置成功',
                 message: '您已经修改了账户：'+res.data.account+"的密码，现在可使用新的密码登录。",
                 type: 'success'
               });
               this.$router.push({path:'/'});
             }
           });
        }
        return false;
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
    loadApp(){
      this.$axios.get("/api/app/ksso").then(res=>{
        console.log(res);
        if(res.status){
          this.appInfo = res.data;
        }
      }).catch(error=>{
        console.log(error);
      });
    }
  },
  mounted() {
    this.loadApp();
  }
}
</script>

<style scoped>
  #resetPwd{
    background:whitesmoke;
    height: 100%;
    min-width: 70rem;
  }
  .el-card{
    width: 500px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
  }
  .logo{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: lightgray 1px solid;
  }
</style>
