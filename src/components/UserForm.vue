<template>
  <div id="app">
    <el-form :model="user" status-icon ref="form" label-width="100px" :disabled="ui.lock" :rules="rules">
      <el-card shadow="hover">
        <el-col :span="10">
          <el-form-item label="用户ID:" prop="id">
            <el-tag size="small" type="primary">{{model=='add' ? '注册成功后自动分配': user.id}}</el-tag>
          </el-form-item>
          <el-form-item label="账户:" prop="account">
            <el-input size="mini" v-model="user.account" :disabled="model=='update'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" v-if='identity=="admin"'>
          <el-form-item label="新密码:">
            <el-input size="mini" v-model="user.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码:">
            <el-input size="mini" v-model="user.rePassword" type="password"></el-input>
          </el-form-item>
        </el-col>
      </el-card>
      <el-card shadow="hover">
        <el-col :span="10">
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="user.nickname" size="mini" placeholder="输入昵称"></el-input>
          </el-form-item>
          <el-form-item label="头像" prop="logo">
            <el-input v-model="user.logo" size="mini" placeholder="输入头像地址"></el-input>
          </el-form-item>
          <el-form-item label="头像预览">
            <el-image v-if="user.logo!==undefined" :src="user.logo" style="width: 100px;height: 100px;"></el-image>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="user.sex" size="mini">
              <el-radio-button label="男"></el-radio-button>
              <el-radio-button label="女"></el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="工作" prop="job">
            <el-input v-model="user.job" size="mini" placeholder="输入工作"></el-input>
          </el-form-item>
          <el-form-item label="学校" prop="school">
            <el-input v-model="user.school" size="mini" placeholder="输入学校"></el-input>
          </el-form-item>
          <el-form-item label="座右铭" prop="motto">
            <el-input v-model="user.motto" type="textarea" :autosize="{minRows:2, maxRows:5}"  maxlength="120" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="年龄:" prop="age">
            <el-input-number size='small' v-model="user.age" :min="1" :max="120" label=""></el-input-number>
          </el-form-item>
          <el-form-item label="生日">
            <el-date-picker size='mini' format="yyyy年MM月dd日" v-model="rawBirthday" align="right" type="date" placeholder="选择生日" ></el-date-picker>
          </el-form-item>
          <el-form-item label="星座" prop="constellation">
             <el-select size="mini" v-model="user.constellation" placeholder="请选择星座">
               <el-option v-for="item in constellations" :key="item" :label="item" :value="item"></el-option>
             </el-select>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" :rules="[{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
            <el-input size="mini" v-model="user.email" placeholder="输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="家乡" prop="hometown">
            <el-input v-model="user.hometown" size="mini" placeholder="输入家乡"></el-input>
          </el-form-item>
          <el-form-item label="地址:" prop="address">
            <el-input v-model="user.address" type="textarea" :autosize="{minRows:2, maxRows:5}"  maxlength="120" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="个人简介:" prop="introduce">
            <el-input v-model="user.introduce" type="textarea" :autosize="{minRows:5, maxRows:5}"  maxlength="120" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-card>
      <el-card shadow="hover">
        <el-col :span="7">
          <el-form-item label="启用账户:" prop="enable" v-if="model=='update'">
            <el-switch v-model='user.enable' active-text="启用" inactive-text="未启用" :disabled="identity=='normal'"></el-switch>
          </el-form-item>
          <el-form-item label="身份" prop="identity">
            <el-select size="mini" v-model="user.identity" placeholder="请设置身份" :disabled="identity=='normal'">
             <el-option v-for="item in identities" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="禁用账户:" prop="forbid" v-if="model=='update'">
            <el-switch v-model='user.forbid' active-text="禁止" inactive-text="不禁止" :disabled="identity=='normal'"></el-switch>
          </el-form-item>
          <el-form-item label="登录通知:" prop="loginNotice">
            <el-switch v-model='user.loginNotice' active-text="开启通知" inactive-text="不开启"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="过期时间">
            <el-date-picker size='mini' format="yyyy年MM月dd日" v-model="rawExpireTime" align="right" type="date" placeholder="选择过期时间"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-card>
      <el-card shadow='hover' v-if="identity=='normal'">
        <el-form-item label="短信验证码:">
          <el-input style='width: 150px;' size="mini" v-model="user.phoneCode"></el-input>
          <el-divider direction="vertical"></el-divider>
          <el-button type="primary" size="mini">获取验证码</el-button>
        </el-form-item>
      </el-card>
      <el-card class="opp" shadow="hover">
          <el-button size="small" @click="resetForm('form')">重 置</el-button>
          <el-button type="primary" size="small" @click="submit('form')">提 交</el-button>
          <el-button type="info" size="small" @click="cancel()">取 消</el-button>
      </el-card>
    </el-form>
  </div>
</template>

<script>
import { Loading } from 'element-ui';
export default {
  name: 'UserForm',
  props: {
    model: {
      type: String,
      default: 'update'
    },
    identity:{
      type: String,
      default: 'normal'
    },
    obj:{
      type: Object,
      default:null
    }
  },
  data(){
    return{
       ui:{
         lock:false
       },
       rawBirthday:'',
       rawExpireTime:'',
       user: {},
       rawUser: {},
       identities:["ADMIN",'NORMAL'],
       constellations:["白羊座","金牛座","双子座",'巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座','魔蝎座','水瓶座','双鱼座'],
       rules: {
           account: [
             { required: true, message: '必须指定手机号码作为账户', trigger: 'blur' },
             { min: 11, max: 11, message: '输入手机号码', trigger: 'blur' }
           ],
           nickname: [
             { min: 0, max: 32, message: '昵称长度在1~16字符之间', trigger: 'blur' }
           ],
           logo: [
             { type:"url", message: '输入正确的头像地址', trigger: 'blur' }
           ],
           email: [
             { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
           ],
           job: [
              { min: 0, max: 32, message: '长度在0~32字符之间', trigger: 'blur' }
           ],
           school: [
              { min: 0, max: 32, message: '长度在0~32字符之间', trigger: 'blur' }
           ],
           address: [
             { min: 0, max: 256, message: '长度在0~256字符之间', trigger: 'blur' }
           ]
       }
    }
  },
  watch:{
    'rawBirthday':{
      handler:function(newV, oldV){
        if(newV===undefined){return;}
        this.user.birthday = newV.Format("yyyy-MM-dd 00:00:00");
      }
    },
    'rawExpireTime':{
      handler:function(newV, oldV){
        console.log(newV);
        if(newV===undefined){return;}
        this.user.expireTime = newV.Format("yyyy-MM-dd 00:00:00");
      }
    },
    'obj':{
      handler:function(newV){
        this.initInfo(newV);
      }
    }
  },
  methods:{
    cancel(){
      this.$router.go(-1);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.user = this.deepClone(this.rawUser);
      this.rawBirthday = new Date(Date.parse(this.user.birthday.replace(/-/g, "/")));
      this.rawExpireTime = new Date(Date.parse(this.user.expireTime.replace(/-/g, "/")));
    },
    deepClone(obj) {
      var _obj = JSON.stringify(obj),
      objClone = JSON.parse(_obj);
      return objClone;
    },
    submit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('submit', this.user)
        }
        return false;
      });
    },
    initInfo(obj){
       this.user = this.obj;
       this.rawUser = this.deepClone(this.user);
       this.rawUser.rawBirthday = this.rawBirthday = new Date(Date.parse(this.user.birthday.replace(/-/g, "/")));
       this.rawUser.rawExpireTime = this.rawExpireTime = new Date(Date.parse(this.user.expireTime.replace(/-/g, "/")));
       this.ui.lock = false;
    }
  },
  mounted(){
    if(this.obj==null){
      this.ui.lock = true;
      return;
    }
    this.initInfo(this.obj);
  },
  destroyed() {
    this.user = null;
    this.rawUser = null;
  }
}
</script>

<style scoped>
  #app{
    background: white;
  }
  .el-card{
    margin-top: 10px;
    border: lightgray 1px dashed;
  }
  .op{
    text-align: right;
  }
</style>
