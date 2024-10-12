import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

// Element UI 組件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './registerServiceWorker'
Vue.use(ElementUI);

new Vue({
  render: h => h(App),
}).$mount('#app')
