<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{

    }
  },
  mounted(){
    this.$message({type:"info", message:'接下来，使用KSSO进行统一授权验证。', center:true, duration:5000});
  }
}
</script>

<style>
*{
  padding: 0;
  margin: 0;
  outline: none;
}
.g_center{
  margin: 0 auto;
  text-align: center;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: auto;
  width: 100%;
}
body, html{
  height: 100%;
  width: 100%;
}
</style>
