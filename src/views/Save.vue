<template>
  <div>
    <div class="caption">
      <i class="iconfont" @click="$router.go(-1)">&#xe732;</i>
      <h1 class="caption-info">我的收藏</h1>
    </div>
    <div class="proList">
      <div class="pro-item" v-for="(item,i) of save_list" :key="i">
        <router-link :to="`/Details/${item.pid}`" style="position:relative;">
          <img :src="`http://127.0.0.1:5050/${item.pic}`" alt />
          <h4 class="pName" v-text="item.pname"></h4>
          <span class="price" v-text="`￥${item.price}`"></span>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      save_list: []
    };
  },
  props: ["pid"],
  created() {
    this.axios.get("/user/save_list").then(result => {
      this.save_list = result.data;
      // console.log(result.data);
    });
  },
  beforeRouteEnter(to, from, next) {
    // 没有登录就跳到登录页面
    next(vm => {
      if (!vm.$store.getters.getIslogin) {
        vm.$router.push("/Login");
      }
    });
  }
};
</script>

<style scoped>
/* 头部 */
.caption {
  width: 100%;
  padding: 10px 0 5px 0;
  overflow: hidden;
}
.caption i.iconfont {
  position: relative;
  top: -3px;
  float: left;
  font-size: 28px;
  text-indent: 0.26rem;
  font-weight: bolder;
}
.caption-info {
  font-size: 20px;
  text-align: center;
  margin-right: 0.63rem;
}
.proList {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.proList .pro-item {
  position: relative;
  width: 49.5%;
  background: rgba(239, 239, 239, 0.9);
  margin-bottom: 3px;
}
.proList .pro-item img {
  width: 4.95rem;
  height: 4.95rem;
}
.repertory {
  width: 100%;
  font-size: 0.43rem;
  /* padding: 0.1rem 0; */
  color: #fff;
  /* margin-top: -0.13rem; */
  text-indent: 0.2rem;
  position: absolute;
  bottom: 6px;
  background: rgba(204, 204, 204, 0.8);
}
.pro-item .pName {
  font-size: 16px;
  text-indent: 0.3rem;
  line-height: 0.66rem;
  color: #333333;
}
.pro-item span.price {
  display: inline-block;
  font-size: 0.4rem;
  font-weight: 600;
  text-indent: 0.12rem;
  color: #ed143d;
  padding-left: 6px;
}
.pro-item span.volume {
  float: right;
  margin-right: 0.2rem;
  margin-top: 10px;
  font-size: 14px;
  color: #000;
  opacity: 0.5;
}
</style>

