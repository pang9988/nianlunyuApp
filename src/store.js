import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  // vuex中全局共享数据
  state: {
    // 登录状态
    isLogin: false,
    // useName: "",
    // userId: "",
    // // 全局的loading
    // isLoading: false
  },
  // 修改vuex中全局共享数据
  mutations: {
    // 设置登陆状态
    setIslogin(state, data) {
      state.isLogin = data;
    },
    // 设置用户的名称(手机号)
    // setUname(state, data) {
    //   console.log("用户名: " + data)
    //   state.useName = data;
    // },
    // setUserId(state) {
    //   if (sessionStorage.getItem("uid") != null) {
    //     state.userId = sessionStorage.getItem("uid");
    //   } else {
    //     state.userId = "";
    //   }
    // },
    // delUserId(state) {
    //   state.userId = "";
    //   sessionStorage.removeItem("uid");
    // },
    // setIsLoading(state, data) {
    //   state.isLoading = data;
    //   console.log(data);
    // }
  },
  // 获取vuex中全局共享数据
  getters: {
    // 获取登陆状态
    getIslogin: state => {
      return state.isLogin;
    },
    // 获取用户姓名
    // getUname: state => {
    //   return state.useName
    // },
    // getUserId: function (state) {
    //   return state.userId;
    // },
    // getIsLoading: state => {
    //   return state.isLoading;
    // }
  },
  actions: {

  }
})
