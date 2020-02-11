<template>
  <div id="app">
    <el-container>
        <el-header>
            <div>
              <div id="logo">
                <el-image :src='appInfo.logo'></el-image>
              </div>
              <ul id="menu">
                  <router-link :to="{name: 'ManageApp'}" tag="li">授权应用</router-link>
                  <el-divider direction="vertical"></el-divider>
                  <router-link :to="{name: 'ManageSysConfig'}" tag="li">系统配置</router-link>
                  <el-divider direction="vertical"></el-divider>
                  <router-link :to="{name: 'ManageUser'}" tag="li">用户管理</router-link>
                  <el-divider direction="vertical"></el-divider>
                  <el-dropdown size="small" split-button>
                    <span v-if='baseInfo!=undefined'>{{baseInfo.nickname}}</span>
                    <span v-else>未登录</span>
                    <el-dropdown-menu slot="dropdown" v-if='baseInfo!=undefined'>
                      <el-dropdown-item>
                        <el-image :src='baseInfo.logo' class='userLogo' style='vertical-align: top;'></el-image>
                        <div style="display: inline-block; margin:0 5px;">
                          <el-tag type='primary' size='mini'>身份:{{baseInfo.identity}}</el-tag>
                          <el-tag type='primary' size='mini'>账户:{{baseInfo.account}}</el-tag>
                          <el-tag style="display: block;" type='primary' size='mini'>上次登录:{{baseInfo.lastLoginTime}}</el-tag>
                        </div>
                      </el-dropdown-item>
                      <div style="margin: 5px 0; text-align: center;">
                        <el-button size='mini' round type='primary' @click='myInfo()'>我的信息</el-button>
                        <el-button size='mini' round type='warning' @click="logout()">注销登录</el-button>
                      </div>
                    </el-dropdown-menu>
                  </el-dropdown>
              </ul>
            </div>
        </el-header>
        <el-main class='content'>
            <router-view></router-view>
        </el-main>
        <Footer></Footer>
    </el-container>
  </div>
</template>

<script>
import Footer from '../components/Footer'
export default {
  name: 'Manage',
  components: {
    Footer
  },
  data(){
    return{
      appInfo:{
        logo:'http://oss.bestbigkk.com/halo/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200118021000_1579284614302.jpg'
      },
      baseInfo:undefined
    }
  },
  methods:{
    loadUserBaseInfo(){
      const baseInfo = window.sessionStorage.getItem("current_user");
      if(baseInfo!=null){
        this.baseInfo = JSON.parse(baseInfo);
      }
    },
    myInfo(){
      this.$router.push({path:'/manage/user/update/'+this.baseInfo.account});
    },
    logout(){
      this.$axios.get('/api/sso/logout').then(res=>{
        console.log(res);
        if(res.status){
          window.localStorage.removeItem("token");
          window.localStorage.removeItem("token_md5");
          window.sessionStorage.removeItem("current_user");
          window.sessionStorage.removeItem("active_menu_index");
          window.open("/","_self");
        }
      });
    }
  },
  mounted(){
    this.loadUserBaseInfo();
  }
}
</script>

<style scoped>
  #app{
    user-select: none;
    background: whitesmoke;
  }
  .el-header{
    position: fixed;
    width: 100%;
    min-width: 70rem;
    height: 60px;
    background: #2689EE;
    box-shadow: #ccc 0px 1px 5px;
    z-index: 10;
  }
  .el-header>div{
    width: 70rem;
    margin: 0 auto;
  }
  #logo{
    display: inline-block;
    vertical-align: top;
  }
  #logo>.el-image{
    margin: 2.5px 10px 0;
    width: 55px;
    height: 55px;
    border-radius: 50%;
  }
  #menu{
    list-style: none;
    display: inline-block;
    float: right;
    max-width: 50rem;
    height: 60px;
    line-height: 60px;
  }
  #menu>li{
    display: inline-block;
    padding: 0 10px;
    transition: linear 200ms all;
    color: gainsboro;
    margin:0;
  }
  #menu>li:hover{
    cursor: pointer;
    color: white;
    line-height: 50px;
  }
  .active_menu{
    border-bottom: white 5px solid;
    border-radius: 3px;
    line-height: 50px;
  }
  .userLogo{
    width: 50px;
    height: 50px;
  }
  .content{
    width: 70rem;
    margin: 80px auto 50px;
    border-radius: 5px;
    min-height: 600px;
    background-color: white;
  }
</style>
