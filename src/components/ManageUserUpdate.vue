<template>
  <div id="app">
    <h2 class='t'>修改用户信息</h2>
    <UserForm :obj='user' model='update' @submit="update" identity='admin'></UserForm>
  </div>
</template>

<script>
import UserForm from './UserForm.vue'
import qs from 'qs'
export default {
  name: 'ManageUserUpdate',
  components:{
    UserForm
  },
  data(){
    return{
      user:null
    }
  },
  methods:{
    queryUser(account){
      this.$axios.get("/api/user/"+account).then(res=>{
        console.log("加载")
        console.log(res);
        if(res.data!=null){
          this.user = res.data;
        }
      });
    },
    isExist(val){
      try{
        return val!==undefined && val!==null && val!=='' && val!=='null' && val!='undefined';
      }catch(e){
        return false;
      }
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
    const id = this.$route.params['account'];
    this.queryUser(id);
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
