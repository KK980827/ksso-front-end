<template>
  <div id="app">
    <h2 class='t'>授权用户</h2>
    <div id="op">
      <div>
        <span>身份：</span>
        <el-select style="width: 100px;" v-model="filterCondtion.identity" placeholder="请选择" size='mini' @change="enableChange">
            <el-option
              v-for="item in identityList"
              :key="item.key"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </div>
      <div>
        <span>账户：</span>
        <el-input style="width: 170px;" v-model='filterCondtion.account' placeholder="输入账户名称"size='mini' clearable=""></el-input>
        <el-divider direction="vertical"></el-divider>
        <el-switch inactive-text="精确查找账户" active-text="模糊匹配" v-model="filterCondtion.blurSearchAccount"></el-switch>
      </div>
      <div>
        <span>过期时间：</span>
        <el-radio-group v-model="filterCondtion.expireTimeStrategy" size='mini'>
          <el-radio-button label="null">无</el-radio-button>
          <el-radio-button label="0">小于</el-radio-button>
          <el-radio-button label="1">等于</el-radio-button>
          <el-radio-button label="2">大于</el-radio-button>
        </el-radio-group>
        <el-date-picker size='mini' format="yyyy-MM-dd 00:00:00" v-model="filterCondtion.rawExpireTime" align="right" type="date" placeholder="选择过期日期" :picker-options="pickerOptions"></el-date-picker>
      </div>
      <div class='btns'>
        <el-button type='primary' size='mini' circle @click='addUser'>
          <i class="el-icon-plus"></i>
        </el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button type='info' size='mini' round @click='resetCondition'>重置</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button type='success' size='mini' round @click='queryUser(1)'>查找</el-button>
      </div>
    </div>
    <div id="list">
      <el-table :data="userList" style="width: 100%" >
          <el-table-column align='center' prop="id" label="ID" width="160" :show-overflow-tooltip='true'>
            <template slot-scope="scope">
              <el-tag type="primary" size='mini'>{{scope.row.id}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align='center' prop="account" label="账户" width="100">
            <template slot-scope="scope">
              <el-tag type="primary" size='mini'>{{scope.row.account}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align='center' label="身份" width="65">
            <template slot-scope="scope">
              <el-tag size='mini' type="primary" v-if='scope.row.identity=="NORMAL"'>普通</el-tag>
              <el-tag size='mini' type="success" v-if='scope.row.identity=="ADMIN"'>管理员</el-tag>
              <el-tag size='mini' type="info" v-if='scope.row.identity!="ADMIN" && scope.row.identity!="NORMAL"'>{{scope.row.identity}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align='center' label="头像" width="50">
            <template slot-scope="scope">
              <el-popover placement="top-start" width="100" trigger="click">
                  <el-image :src="scope.row.logo"></el-image>
                  <i class="el-icon-picture" slot="reference" style="cursor: pointer;"></i>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align='center' prop="expireTime" label="过期时间" :show-overflow-tooltip='true' width="150">
            <template slot-scope="scope">
              <el-tag size='mini'>{{scope.row.expireTime}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align='center' label="登录通知" width="80">
            <template slot-scope="scope">
              <el-tag size='mini'>{{scope.row.loginNotice? '开启' : '不通知'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align='center' label="状态" width="80">
            <template slot-scope="scope">
              <el-tag size='mini' v-if='scope.row.enable' type="primary">启用中</el-tag>
              <el-tag size='mini' v-if='!scope.row.enable' type="danger">未启用</el-tag>
            </template>
          </el-table-column>
          <el-table-column align='center' label="禁止" width="80">
            <template slot-scope="scope">
              <el-tag size='mini' v-if='!scope.row.forbid' type="primary">正常</el-tag>
              <el-tag size='mini' v-if='scope.row.forbid' type="danger">已禁止</el-tag>
            </template>
          </el-table-column>
          <el-table-column align='center' label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click='editUserInfo(scope.row)'>编辑</el-button>
              <el-button type="danger" size="mini" @click='deleteUser(scope.row)'>删除</el-button>
            </template>
          </el-table-column>
          <el-table-column align='center' type="expand">
            <template slot-scope="scope">
              <ul class="detail">
                <el-col :span="6">
                  <li>
                   <span>昵称：</span><el-tag size='mini'>{{scope.row.nickname==null ? '未设置' : scope.row.nickname}}</el-tag>
                  </li>
                  <li>
                    <span>年龄：</span><el-tag size='mini'>{{scope.row.age==null ? '未设置' : scope.row.age}}</el-tag>
                  </li>
                  <li>
                   <span>性别：</span><el-tag size='mini'>{{scope.row.sex==null ? '未设置' : scope.row.sex}}</el-tag>
                  </li>
                  <li>
                    <span>生日：</span><el-tag size='mini'>{{scope.row.birthday==null ? '未设置' : scope.row.birthday}}</el-tag>
                  </li>
                </el-col>
                <el-col :span="6">
                  <li>
                   <span>学校：</span><el-tag size='mini'>{{scope.row.school==null ? '未设置' : scope.row.school}}</el-tag>
                  </li>
                  <li>
                   <span>工作：</span><el-tag size='mini'>{{scope.row.job==null ? '未设置' : scope.row.job}}</el-tag>
                  </li>
                  <li>
                    <span>地址：</span><el-tag size='mini'>{{scope.row.address==null ? '未设置' : scope.row.address}}</el-tag>
                  </li>
                  <li>
                   <span>个人简介：</span><el-tag size='mini'>{{scope.row.introduce==null ? '未设置' : scope.row.introduce}}</el-tag>
                  </li>
                </el-col>
                <el-col :span="6">
                  <li>
                   <span>邮件地址：</span><el-tag size='mini'>{{scope.row.email==null ? '未设置' : scope.row.email}}</el-tag>
                  </li>
                  <li>
                    <span>注册时间：</span><el-tag size='mini'>{{scope.row.registerTime==null ? '未设置' : scope.row.registerTime}}</el-tag>
                  </li>
                  <li>
                    <span>上次登录：</span><el-tag size='mini'>{{scope.row.lastLoginTime==null ? '未设置' : scope.row.lastLoginTime}}</el-tag>
                  </li>
                </el-col>
                <el-col :span="6">
                  <li>
                    <span>星座：</span><el-tag size='mini'>{{scope.row.constellation==null ? '未设置' : scope.row.constellation}}</el-tag>
                  </li>
                  <li>
                   <span>家乡：</span><el-tag size='mini'>{{scope.row.hometown==null ? '未设置' : scope.row.hometown}}</el-tag>
                  </li>
                  <li>
                   <span>座右铭：</span><el-tag size='mini'>{{scope.row.motto==null ? '未设置' : scope.row.motto}}</el-tag>
                  </li>
                </el-col>
              </ul>
            </template>
          </el-table-column>
        </el-table>
      <el-pagination background layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        :page-sizes="[5, 10, 50, 100]"
        :current-page="pagination.currentPage"
        @current-change="paginationLoad"
        @size-change="paginationSizeChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  name: 'ManageUser',
  data(){
    return{
      pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
      },
      identityList:[
        {
          value:null,
          label:"全部",
          key:1
        },
        {
          value:'ADMIN',
          label:"管理员",
          key:2
        },
        {
          value:'NORMAL',
          label:"普通",
          key:3
        }
      ],
      filterCondtion:{
        account: null,
        blurSearchAccount: false,
        identity: null,
        rawExpireTime: null,
        expireTime: null,
        expireTimeStrategy: null,
      },
      pagination:{
        currentPage: 1,
        pageSize: 5,
        total:0,
        pages:0,
      },
      userList:[],
      rawTempUser:{

      },
      tempUser:{

      }
    }
  },
  watch:{
    'filterCondtion.rawExpireTime':{
      handler:function(newV, oldV){
        if(newV===undefined){return;}
        this.filterCondtion.expireTime = newV.Format("yyyy-MM-dd hh:mm:ss");
      }
    }
  },
  methods:{
    addUser(){
      this.$router.push({path:'/manage/user/new'}).catch(data=>{});
    },
    editUserInfo(userInfo){
      this.$router.push({path:'/manage/user/update/'+userInfo.account}).catch(data => {})
    },
    deleteUser(user){
      this.$confirm('此操作将永久删除用户:'+user.name+', 是否继续?删除成功之后，该用户将不再允许登录SSO，这将会对该用户以及该用户所属的应用造成很大影响！', '警告', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        center:true,
        showClose:false
      }).then(() => {
        this.$axios.delete('/api/user/'+user.account).then(res=>{
          console.log(res);
          if(res.status){
            this.$notify({
              title: '删除用户:'+user.name+'成功',
              message: '将在后续通知该用户以告知该操作。',
              type: 'success',
              position: 'top-left'
            });
            this.queryUser(this.pagination.currentPage);
          }
        });
      }).catch(() => {});
    },
    cancelDialog(){
      this.tempUser = this.deepClone(this.rawTempUser);
      this.ui.showDialog = false;
      this.ui.dialogTitle = "";
    },
    submitDialog() {
      this.$refs['dialog_form'].validate((valid) => {
        if (valid) {
          if(this.ui.model=='add'){
            console.log("新增");
            this.$axios.post('/api/user/', this.transferFormData(this.tempUser)).then(res=>{
              console.log("as");
              console.log(res);
              if(res.status){
                this.$notify({
                  title: '新增用户成功',
                  message: 'AppId:'+res.data.id,
                  type: 'success',
                  position: 'top-left'
                });
                this.cancelDialog();
                this.queryUser();
              }
            });
            return true;
          }
          if(this.ui.model=='update'){
            console.log("更新");
            this.$axios.put('/api/user/?'+qs.stringify(this.tempUser)).then(res=>{
              console.log("as");
              console.log(res);
              if(res.status){
                this.$notify({
                  title: '更新用户信息成功',
                  message: '用户ID:'+res.data.id,
                  type: 'success',
                  position: 'top-left'
                });
                this.cancelDialog();
                this.queryUser();
              }
            });
            return true;
          }
        }
        return false;
      });
    },
    //筛选条件中，启用状态条件更改之后触发。
    enableChange(nV){
      this.filterCondtion.enable = nV;
    },
    //筛选条件中，重置筛选条件。
    resetCondition(){
      this.filterCondtion = {
        account: null,
        blurSearchAccount: false,
        identity: null,
        expireTime: null,
        expireTimeStrategy: null,
      };
    },
    deepClone(obj) {
      var _obj = JSON.stringify(obj),
      objClone = JSON.parse(_obj);
      return objClone;
    },
    transferFormData(data){
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
          formData.append(key, data[key]);
      });
      return formData;
    },
    mergeObj(source, target){
      var t = this.deepClone(target);
      Object.keys(source).forEach((key) => {
          t[key] = source[key];
      });
      return t;
    },
    paginationLoad(currentPage){
      this.pagination.currentPage = currentPage;
      this.queryUser();
    },
    paginationSizeChange(size){
      this.pagination.pageSize = size;
      this.paginationLoad(this.pagination.currentPage);
    },
    queryUser(currentPage){
     if(currentPage!==undefined){
       this.pagination.currentPage = 1;
     }
     this.filterCondtion.account = this.filterCondtion.account=='' ? null : this.filterCondtion.account;
     this.filterCondtion.expireTimeStrategy = this.filterCondtion.expireTimeStrategy=='null' ? null : this.filterCondtion.expireTimeStrategy;
     this.$axios.get("/api/user/list",{
       params:this.mergeObj(this.pagination, this.filterCondtion)
     }).then(res=>{
       console.log(res);
       if(res.status){
         this.filterCondtion = res.data.searchCondition;
         this.pagination = res.data.pagination;
         this.userList = res.data.userList;
       }
     });
    }
  },
  mounted(){
    this.queryUser();
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
  #op{
    margin: 10px;
    background: whitesmoke;
    padding: 5px;
  }
  #op>div{
    margin: 5px 0;
  }
  #op>div>span{
    font-size: 13px;
    display: inline-block;
    width:80px;
    padding-left:5px;
    border-left: deepskyblue 2px solid;
  }
  .btns{
    text-align: right;
  }
  .el-col{

  }
  li{
    list-style: none;
    margin: 5px;
  }
  li>span:nth-child(1){
    display: inline-block;
    width: 70px;
    font-size: 11px;
  }
  .el-table{
    margin-bottom: 10px;
  }
  .el-pagination{
    text-align: center;
  }
</style>
