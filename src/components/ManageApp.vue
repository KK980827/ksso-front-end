<template>
  <div id="app">
    <h2 class='t'>授权应用</h2>
    <div id="op">
      <div>
        <span>应用状态：</span>
        <el-select style="width: 100px;" v-model="filterCondtion.enable" placeholder="请选择" size='mini' @change="enableChange">
            <el-option
              v-for="item in enableStatus"
              :key="item.key"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </div>
      <el-divider direction="vertical"></el-divider>
      <div>
        <span>名称：</span>
        <el-input style="width: 170px;" v-model='filterCondtion.name' placeholder="输入名称以模糊查找"size='mini' clearable=""></el-input>
      </div>
      <el-divider direction="vertical"></el-divider>
      <div>
        <span>域名：</span>
        <el-input style="width: 200px;" v-model='filterCondtion.domain' placeholder="输入域名以模糊查找"size='mini' clearable=""></el-input>
      </div>
      <div>
        <el-button type='info' size='mini' round @click='resetCondition'>重置</el-button>
        <el-button type='success' size='mini' round @click='queryApp(1)'>查找</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button type='primary' size='mini' circle @click='addApp'>
          <i class="el-icon-plus"></i>
        </el-button>
      </div>
    </div>
    <el-divider></el-divider>
    <div id="list">
      <el-table :data="appList" border style="width: 100%" >
          <el-table-column align='center' prop="id" label="AppID" width="180">
            <template slot-scope="scope">
              <el-tag type="primary" size='mini'>{{scope.row.id}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align='center' prop="name" label="名称" :show-overflow-tooltip='true' width="150"></el-table-column>
          <el-table-column align='center' label="图标" width="80">
            <template slot-scope="scope">
              <el-image :src='scope.row.logo'></el-image>
            </template>
          </el-table-column>
          <el-table-column align='center' label="图标类型" width="80">
            <template slot-scope="scope">
              <el-tag size='mini'>{{scope.row.logoType==1? 'URL' : 'Base64'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align='center' prop="domain" label="域名" width="150" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column align='center' prop="contactPhone" label="联系方式" width="110"></el-table-column>
          <el-table-column align='center' label="状态" width="80">
            <template slot-scope="scope">
              <el-tag size='mini' type="success" v-if='scope.row.enable'>启用</el-tag>
              <el-tag size='mini' type="danger" v-else>已禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column align='center' label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click='editApp(scope.row)'>编辑</el-button>
              <el-button type="danger" size="mini" @click="deleteApp(scope.row)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column align='center' type="expand">
            <template slot-scope="scope">
              <ul class="detail">
                <li>
                  名称：<el-tag size='mini'>{{scope.row.name}}</el-tag>
                </li>
                <li>
                  通信密钥：<el-tag size='mini'>{{scope.row.aesKey}}</el-tag>
                </li>
                <li>
                  注册时间：<el-tag size='mini'>{{scope.row.registerTime}}</el-tag>
                </li>
                <li>
                  应用简述：<span>{{scope.row.introduce}}</span>
                </li>
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
    <el-dialog :title="ui.dialogTitle" :visible.sync="ui.showDialog" width="80%" center :show-close="false" :close-on-click-modal='false'>
      <el-form label-width="100px" :model="tempApp" ref='dialog_form'>
        <el-form-item label="目标应用ID:" v-if="tempApp.id!==undefined">
          <el-tag type="primary">{{tempApp.id}}</el-tag>
        </el-form-item>
        <el-form-item label="名称" :rules="[{required:true, message:'必须输入App的名称,一经设置不可更改', trigger:'blur'},{ min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }]" prop='name'>
          <el-input :disabled="ui.model=='update'" v-model="tempApp.name" placeholder="输入应用名称,一经设置不可更改" ></el-input>
        </el-form-item>
        <el-form-item label="联系方式" :rules="[{required:true, message:'必须输入App的相关联系方式', trigger:'blur'}]" prop='contactPhone'>
          <el-input v-model="tempApp.contactPhone" placeholder="输入该应用的相关联系方式"></el-input>
        </el-form-item>
        <el-form-item label="短信验证码" :rules="[{required:true, message:'必须输入短信验证码', trigger:'blur'},{min:1, max:10, message: '长度最大为10个字符', trigger: 'blur' }]" prop='phoneCode'>
          <div>
            <el-input v-model="tempApp.phoneCode" placeholder="必须输入短信验证码" style="width: 200px;"></el-input>
            <el-button type="info">点击获取</el-button>
          </div>
        </el-form-item>
        <el-form-item label="域名" :rules="[{required:true, message:'必须输入App的域名地址', trigger:'blur'}]" prop='domain'>
          <el-input v-model="tempApp.domain" placeholder="输入该应用所部署的域名地址"></el-input>
        </el-form-item>
        <el-form-item label="通信密钥" :rules="[{required:true, message:'必须输入App的通信密钥', trigger:'blur'}]" prop='aesKey'>
          <el-input v-model="tempApp.aesKey" placeholder="输入该应用与SSO通信时使用的密钥"></el-input>
        </el-form-item>
        <el-form-item label="Logo类型">
          <el-radio-group v-model="tempApp.logoType" size="mini">
            <el-radio-button label=1 >URL</el-radio-button>
            <el-radio-button label=2 >Base64图片</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Logo预览" v-if="tempApp.logo!==undefined && tempApp.logo!=null">
          <div>
            <el-image :src=tempApp.logo style="width: 80px; height: 80px;"></el-image>
          </div>
        </el-form-item>
        <el-form-item label="Logo" :rules="[{max:2000, message: '长度最大为2000个字符', trigger: 'blur' }]" prop="logo">
          <div>
            <el-input v-model="tempApp.logo" placeholder="输入与Logo类型匹配的值"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="启用状态">
          <el-switch v-model='tempApp.enable' inactive-text="不启用" active-text="启用"></el-switch>
        </el-form-item>
        <el-form-item label="简介" :rules="[{max:2000, message: '长度最大为1000个字符', trigger: 'blur' }]" prop="introduce">
          <el-input show-word-limit maxlength="1000" v-model="tempApp.introduce" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="cancelDialog">取 消</el-button>
        <el-button type="primary" @click='submitDialog'>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  name: 'ManageApp',
  data(){
    return{
      ui:{
        showDialog: false,
        dialogTitle: '',
        model:''
      },
      enableStatus:[
        {
          value:null,
          label:"全部",
          key:1
        },
        {
          value:true,
          label:"启用",
          key:2
        },
        {
          value:false,
          label:"已禁用",
          key:3
        }
      ],
      filterCondtion:{
        name:null,
        domain:null,
        enable:null
      },
      pagination:{
        currentPage: 1,
        pageSize: 5,
        total:0,
        pages:0,
      },
      appList:[],
      rawTempApp:{
        id:undefined,
        name: '',
        domain: '',
        aesKey:'',
        logo:'',
        logoType:1,
        enable:true,
        introduce:'',
        contactPhone: '',
        phoneCode:''
      },
      tempApp:{
        name: '',
        domain: '',
        aesKey:'',
        logo:'',
        logoType:1,
        enable:true,
        introduce:'',
        contactPhone: '',
        phoneCode:''
      }
    }
  },
  methods:{
    addApp(){
      this.tempApp = this.deepClone(this.rawTempApp);
      this.ui.showDialog = true;
      this.ui.dialogTitle = "新增应用";
      this.ui.model = "add";
    },
    editApp(app){
      this.ui.showDialog = true;
      this.ui.dialogTitle = "更新应用"+app.name+"信息,不可修改项已禁用";
      this.tempApp = this.deepClone(app);
      this.ui.model = "update";
    },
    deleteApp(app){
      this.$confirm('此操作将永久删除App:'+app.name+', 是否继续?删除成功之后，SSO将不再接管该应用的授权请求，这将会对该应用造成很大影响！', '警告', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        center:true,
        showClose:false
      }).then(() => {
        this.$axios.delete('/api/app/'+app.id).then(res=>{
          console.log(res);
          if(res.status){
            this.$notify({
              title: '删除App:'+app.name+'成功',
              message: '将在后续通知该APP的联系人以告知该操作。',
              type: 'success',
              position: 'top-left'
            });
            this.queryApp(this.pagination.currentPage);
          }
        });
      }).catch(() => {});
    },
    cancelDialog(){
      this.tempApp = this.deepClone(this.rawTempApp);
      this.ui.showDialog = false;
      this.ui.dialogTitle = "";
    },
    submitDialog() {
      this.$refs['dialog_form'].validate((valid) => {
        if (valid) {
          if(this.ui.model=='add'){
            console.log("新增");
            this.$axios.post('/api/app/', this.transferFormData(this.tempApp)).then(res=>{
              console.log("as");
              console.log(res);
              if(res.status){
                this.$notify({
                  title: '新增App成功',
                  message: 'AppId:'+res.data.id,
                  type: 'success',
                  position: 'top-left'
                });
                this.cancelDialog();
                this.queryApp();
              }
            });
            return true;
          }
          if(this.ui.model=='update'){
            console.log("更新");
            this.$axios.put('/api/app/?'+qs.stringify(this.tempApp)).then(res=>{
              console.log("as");
              console.log(res);
              if(res.status){
                this.$notify({
                  title: '更新App信息成功',
                  message: 'AppId:'+res.data.id,
                  type: 'success',
                  position: 'top-left'
                });
                this.cancelDialog();
                this.queryApp();
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
        name:null,
        domain:null,
        enable:null
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
      this.queryApp();
    },
    paginationSizeChange(size){
      this.pagination.pageSize = size;
      this.paginationLoad(this.pagination.currentPage);
    },
    queryApp(currentPage){
     if(currentPage!==undefined){
       this.pagination.currentPage = 1;
     }
     this.$axios.get("/api/app/list",{
       params:this.mergeObj(this.pagination, this.filterCondtion)
     }).then(res=>{
       if(res.status){
         this.filterCondtion = res.data.searchCondition;
         this.pagination = res.data.pagination;
         this.appList = res.data.appList;
       }
     });
    }
  },
  mounted(){
    this.queryApp();
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
    text-align: right;
  }
  #op>div{
    display: inline-block;
  }
  .detail>li{
    margin: 10px;
  }
  .el-table{
    margin-bottom: 10px;
  }
  .el-pagination{
    text-align: center;
  }
</style>
