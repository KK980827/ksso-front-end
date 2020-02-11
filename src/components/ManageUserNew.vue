<template>
  <div id="app">
    <h2 class='t'>新增用户信息</h2>
    <UserForm :obj='user' model='add' @submit="add" identity='admin'></UserForm>
  </div>
</template>

<script>
import UserForm from './UserForm.vue'
export default {
  name: 'ManageUserNew',
  components:{
    UserForm
  },
  data(){
    return{
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
  methods:{
    add(user){
      if(!this.isExist(user.phoneCode)){
        this.$alert('请输入手机：'+user.account+'接收到的短信验证码。','校验不通过',{type:'warning',showClose:false});
        return;
      }
      if(!this.isExist(user.password) || !this.isExist(user.rePassword) || user.password!=user.rePassword || user.password.length>12 || user.password.length<6){
        this.$alert('保证两次输入的密码一致，且密码长度在6~12之间。','校验不通过',{type:'warning',showClose:false});
        return;
      }
      this.$axios.post('/api/user/',this.transferFormData(user)).then(res=>{
        console.log(res);
      });
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
    }
  },
  mounted() {

  }
}
</script>

<style scoped>
  #app{
    background: white;
    height: 100%;
  }
  .t{
    padding-left:5px;
    border-left: deepskyblue 5px solid;
    color: deepskyblue;
  }
</style>
