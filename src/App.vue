<template>
  <Main class="frame"></Main>
</template>

<script>
import Main from './components/Main.vue'

export default {
  name: 'App',
  components: {
    Main
  }
}
</script>

<style>
  ::-webkit-scrollbar{
    display: none;
  }
  .frame{
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
  .el-message-box{
    width: 80% !important;
  }
</style>
