<template>
  <div id="footer" class='g_center'>
    <span>BestBigKK-SSO</span>
    <el-divider direction="vertical"></el-divider>
    <span>统一授权验证中心</span>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  data () {
    return {

    }
  }
}
</script>

<style scoped>
    #footer{
      position: fixed;
      bottom: 0px;
      height: 20px;
      width: 100%;
      background: #303133;
      padding: 10px;
      color: darkgrey;
      z-index: 9999;
    }
</style>
