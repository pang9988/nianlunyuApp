import Vue from 'vue'
import './cube-ui'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'

// 完整引入mint-ui
import MintUI from 'mint-ui'
// 单引引入mint-ui样式
import 'mint-ui/lib/style.css'
// 将mint-ui注册vue
Vue.use(MintUI);
// 引入cube-ui
import Cube from 'cube-ui'
Vue.use(Cube)

Vue.prototype.bus = new Vue;

import axios from './axios'
Vue.use(axios);

// import axios from 'axios'
// Vue.prototype.axios = axios;
// 配置axios发送请求时保存session信息
// axios.defaults.withCredentials = true
// 配置axios基础路径  http://kirito7.applinzi.com
// axios.defaults.baseURL = "http://xiaoxuan.applinzi.com"
// axios.defaults.baseURL = "http://127.0.0.1:7000"


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
