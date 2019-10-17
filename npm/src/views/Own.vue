<template>
  <div class="total" v-cloak>
    <!-- 未登录状态下 -->
    <div class="not_login" v-if="!$store.getters.getIslogin">
      <div class="logo">
        <img src="../../public/images/avatar.png" alt />
      </div>
      <mt-button class="myButton" @click="login">登录</mt-button>
    </div>
    <!-- 登录状态下 -->
    <div class="is_login" v-if="$store.getters.getIslogin" v-cloak>
      <div class="avatar_wrap">
        <router-link to="Infornation" class="logo">
          <img :src="pic" alt />
        </router-link>
      </div>
      <div class="info">
        <span class="phone" v-text="uphone"></span>
        <i class="iconfont logout" @click="logout">&#xe799;</i>
      </div>
    </div>

    <div class="order">
      <div class="own">
        <p class="section_title">我的订单</p>
        <router-link to="/OrderForm">待付款</router-link>
        <router-link to="/OrderForm">待发货</router-link>
        <router-link to="/OrderForm">待收货</router-link>
        <router-link to="/OrderForm">待评价</router-link>
      </div>
    </div>
    <div class="service">
      <div class="own">
        <p class="section_title">我的服务</p>
        <a href="javascript:;" class="birth">生日助手</a>
        <router-link to="/Infornation" class="detail">个人资料</router-link>
        <a href="javascript:;" class="card">储值卡专享兑换券</a>
        <router-link to="/Save" class="shoucang">我的收藏</router-link>
        <a href="javascript:;" class="online">在线客服</a>
        <a href="javascript:;" class="ticket">我的发票</a>
        <a href="javascript:;" class="our">关于我们</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      uphone: "",
      pic: "images/avatar/avatar.png"
    };
  },
  created() {
    this.load();
  },
  methods: {
    load() {
      this.axios.post("/user/own").then(result => {
        // console.log(result.data);
        if (result.data.code == 200) {
          this.pic = `http://127.0.0.1:5050/${result.data.data[0].avatar}`;
          this.uphone = result.data.data[0].phone;
        }
      });
    },
    login() {
      // 跳转到登陆页
      this.$router.push("/Login");
    },
    // 退出登录
    logout() {
      this.$messagebox("", "是否退出登录").then(action => {
        this.uphone = "";
        this.$store.commit("setIslogin", false);
        sessionStorage.removeItem("token");
        this.$router.push("/Login");
      });
    }
  },
  activated() {
    // keepAlive(缓存)开启时 重新刷新数据
    this.load();
    if (this.$router.history.current.query.imgSrc != null) {
      this.pic = this.$router.history.current.query.imgSrc;
    }
  }
};
</script>
<style scoped>
[v-cloak] {
  display: none;
}
.total {
  background: #f5f5f5;
  /* position: fixed; */
  top: -2%;
  background-image: url("../../public/images/bcfa076fd26e7285e70c848ef0fb1a0.jpg");
}
.not_login {
  text-align: center;
  background: #fff;
  margin-bottom: 15px;
  height: 170px;
}
.logo {
  position: relative;
  margin-top: 0px;
}
.logo img {
  /* position: absolute;
  top:20px;
  right:0px; */
  margin-top: 26%;
  width: 65px;
  height: 65px;
  object-fit: cover;
}
.myButton {
  width: 80px;
  height: 35px;
  background: #a38d6b;
  color: #fff;
  font-size: 13px;
  margin-top: 10px;
}
.not_login .mint-button {
  /* position: absolute;
  right:150px;
  top:120px; */
  margin-top: 5%;
}

.order {
  font: 13px "Hiragino Sans GB", STFangsong, "Microsoft YaHei", Helvetica,
    STXihei, Arial, serif !important;
  background: #fff;
}
.service {
  font: 13px "Hiragino Sans GB", STFangsong, "Microsoft YaHei", Helvetica,
    STXihei, Arial, serif !important;
  background: #fff;
}
.section_title {
  padding: 10px;
}
.own {
  margin-bottom: 10px;
  overflow: hidden;
  margin: 10px 20px;
  background: #fff;
}
.own a {
  position: relative;
  float: left;
  width: 25%;
  height: 25px;
  text-align: center;
  margin: 10px 0;
  color: #000;
  padding-top: 30px;
}
.own a::before {
  content: "";
  position: absolute;
  width: 1.2rem;
  height: 1.2rem;
  background: url(../../public/images/20190723190115.png) no-repeat center;
  background-size: 10rem 10rem;
  top: -25%;
  left: 24%;
}
.own a:nth-of-type(1):before {
  background-position: -15px -56px;
}
.own a:nth-of-type(2):before {
  background-position: -71px -56px;
}
.own a:nth-of-type(3):before {
  background-position: -128px -56px;
}
.own a:nth-of-type(4):before {
  background-position: -183px -56px;
}
.own a.birth:before {
  background-position: -17px -109px;
}
.own a.detail:before {
  background-position: -72px -109px;
}
.own a.card:before {
  background-position: -127px -109px;
}
.own a.our:before {
  background-position: -29px -109px;
}
.own a.shoucang:before {
  background-position: -15px -163px;
}
.own a.online:before {
  background-position: -183px -109px;
}
.own a.ticket:before {
  background-position: -240px -109px;
}
.own a.our:before {
  background-position: -298px -109px;
}
.is_login {
  overflow: hidden;
  clear: both;
  padding-top: 20px;
  padding-left: 20px;
  padding-bottom: 5%;
  /* background-image: url("../../public/images/bcfa076fd26e7285e70c848ef0fb1a0.jpg"); */
}
.avatar_wrap {
  float: left;
}
.info {
  float: left;
  width: 75%;
  position: relative;
  margin-top: 7%;
  margin-left: 10px;
}
.info .phone {
  font-size: 14px;
}
.info .logout {
  position: absolute;
  right: 6px;
  top: 38%;
}
</style>