<template>
  <div id="app">
    <h2 class='t'>系统配置<span v-if='sysConfig!==undefined'> - 共{{Object.keys(sysConfig).length}}项</span></h2>
    <table id="content">
      <thead>
        <td>键</td>
        <td>说明</td>
        <td>值</td>
      </thead>
      <tbody>
        <tr v-for="(configKey,index) in Object.keys(sysConfig)">
          <td class='t_key'>
            <el-tag size='mini' type='primary'>{{configKey}}</el-tag>
          </td>
          <td class='t_desc'>
            <el-tag size="mini" type="primary">{{sysDesc[index][0]}}</el-tag>
          </td>
          <td class='t_op'>
            <el-switch :disabled='lock' size='mini' v-if='sysDesc[index][1]=="boolean"' v-model='sysConfig[configKey]' active-text="开启" inactive-text="禁用"></el-switch>
            <el-tag size='mini' v-if='sysDesc[index][1]=="string" && lock'>{{sysConfig[configKey]}}</el-tag>
            <el-input size='mini' v-if='sysDesc[index][1]=="string" && !lock' v-model='sysConfig[configKey]'></el-input>
          </td>
        </tr>
      </tbody>
    </table>
    <div id="op">
      <el-button v-if='lock' size="small" type='primary' @click='lock=false'>更新配置</el-button>
      <el-button v-if='!lock' size="small" type='success' @click='updateSysConfig()'>提交</el-button>
      <el-button v-if='!lock' size="small" type='info' @click='lock=true'>取消</el-button>
    </div>
    <el-divider content-position="left">Tips:</el-divider>
    <ul class='tips'>
      <li v-for="tip in tips">{{tip}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ManageSysConfig',
  data(){
    return{
      tips:[
        "以上配置将决定SSO的一些运行策略。",
        "直接更改某些配置可能会使得某些服务出现异常。"
      ],
      sysDesc:[
         ["是否启用授权", 'boolean'],
         ["是否允许内部服务通过授权码调用", 'boolean'],
         ["内部服务调用所使用授权码",'string'],
         ["是否允许第三方QQ登录",'boolean'],
         ["是否允许第三方微信登录",'boolean'],
         ["是否开启注册通道",'boolean'],
         ["全局配置上次修改时间",'string'],
         ["全局配置上次修改用户账户",'string']
      ],
      sysConfig:{},
      lock:true
    }
  },
  methods:{
    getSysConfig(){
      this.$axios.get("/api/sys/config/").then(res=>{
        this.sysConfig = res.data;
        console.log(this.sysConfig);
      });
    },
    transferFormData(data){
      const formData = new FormData();
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });
      return formData;
    },
    updateSysConfig(){
      this.lock = true;
      this.$axios.post("/api/sys/config/",this.transferFormData(this.sysConfig)).then(res=>{
        this.$message({
          message:"更新成功",
          type:'success',
          showClose:false
        });
        this.getSysConfig();
      });
    }
  },
  mounted(){
    this.getSysConfig();
  }
}
</script>

<style scoped>
  #app{
    background: white;
    height: 100%;
    width: 100%;
  }
  .t{
    padding-left:5px;
    border-left: deepskyblue 5px solid;
    color: deepskyblue;
  }
  .t>span{
    font-weight: normal;
    font-size: 15px;
  }
  #op{
    text-align: right;
    padding: 0 10px;
  }
  #content{
    width: 100%;
    border: lightskyblue 1px dashed;
    padding: 10px;
    margin: 15px 0;
  }
  #content td{
    user-select: text;
    padding: 5px;
    text-align: center;
    background-color: ghostwhite;
    transition: linear 200ms all;
  }
  #content thead td{
    background: lightskyblue;
    font-weight: bold;
  }
  #content tbody td:hover{
    background: whitesmoke;
  }
  .tips{
    font-size: 13px;
    list-style: none;
    margin: 5px 50px;
    padding-left: 5px;
    border-left: lightslategray 2px solid;
  }
</style>
