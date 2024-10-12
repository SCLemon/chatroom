
<template>
  <div class="main">
    <div class="top">即時聊天室</div>
    <div class="msgBlock" ref="list">
      <div class="msgs" v-for="(obj,id) in messages" :key="id">
        <div class="user">
          <i class="fa-solid fa-user"></i>
          <div class="username">{{ obj.username }}</div>
        </div>
        <div class="userMsg">{{ obj.msg }}</div>
      </div>
    </div>
    <div class="footer">
      <input type="text" class="input" placeholder="請輸入欲發送之聊天訊息" v-model="inputText">
      <i class="fa-solid fa-paper-plane sendIcon" @click="sendMessage()"></i>
    </div>
  </div>
</template>

<script>

export default {
  name:'Main',
  data(){
    return{
      username:'',
      socket:{},
      inputText:'',
      messages:[],
    }
  },
  computed:{
    location(){
      return (window.location.href).split('//')[1].split(":")[0]
    }
  },
  watch:{
    messages:{
      deep:true,
      handler(){
        this.setWindowScroll();
      }
    }
  },
  mounted(){
    this.socket = new WebSocket(`ws://${this.location}:3000`);
    this.socket.onopen = () => {
        console.log('Connected to WebSocket server');
    };

    this.socket.onmessage = (event) => {
        var received = JSON.parse(event.data); 
        if(received.type == 'init') this.messages = received.msg; // {username:'',type:'init',msg:[{},{}]}
        else this.messages.push(received); // {username:'',type:'broadcast',msg:''}
    };
    this.setUserName()

  },
  methods:{
    sendMessage(){
      if(this.username.trim()=='') this.setUserName();
      else{
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
          if(this.inputText.trim()!=''){
            this.socket.send(JSON.stringify({ username:this.username, type:'broadcast', msg:this.inputText}));
            this.inputText = '';
          }
        } 
        else console.error('WebSocket is not open. Ready state:', this.socket.readyState);
      }
    },
    setUserName(){
      this.$prompt('請輸入使用者暱稱', '提示', {
        confirmButtonText: '確認',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        this.username = value;
        this.sendMessage();
      }).catch(({value}) => {
        this.username = value?value:'';
      });
    },
    setWindowScroll(){
      var el = this.$refs.list;
      this.$nextTick(function(){
        el.scrollTop = el.scrollHeight;
      })
    },
  }
}
</script>

<style scoped>
  .main{
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
  .top{
    width: 100%;
    height: 60px;
    border-bottom: 1px solid rgba(210,210,210,0.9);
    line-height: 60px;
    text-align: center;
    font-size: 24px;
  }
  .msgBlock{
    width: 100%;
    height: calc(100vh - 130px);
    overflow-y: scroll;
  }
  .msgs{
    width: 100%;
    min-height: calc(100% /10);
    display: flex;
    padding-top: 5px;
    padding-bottom: 5px;
    align-items: center;
    justify-content: space-evenly;
    border-bottom: 0.1px solid rgba(210,210,210,0.3);
  }
  .user{
    width: 18%;
    height: 100%;
    overflow-x: scroll;
    display: flex;
    flex-direction: column;
    text-align: center;
    overflow: hidden;
  }
  .username{
    margin-top: 9px;
    font-size: 10px;
    overflow-x: scroll;
    overflow-y: hidden;
    text-wrap: nowrap;
  }
  .userMsg{
    width: 77%;
    text-align: justify;
    word-wrap: break-word;
    padding: 5px;
    font-size: 13px;
    line-height: 1.5;
  }
  .footer{
    width: 100%;
    height: 70px;
    border-top: 1px solid rgba(210,210,210,0.9);
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding-left: 5px;
    padding-right: 5px;
  }
  .input{
    width: 80%;
    height: 40px;
    font-size: 14px;
    border: 0;
    border-radius: 0;
    padding-left: 10px;
    border-bottom:1px solid rgba(210,210,210,0.9);
  }
  .input:focus{
    outline: 0;
  }
  .sendIcon{
    width: 15%;
    text-align: center;
    font-size: 20px;
  }

</style>