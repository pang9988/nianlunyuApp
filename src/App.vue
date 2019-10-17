<template>
  <div id="app">
    <loading></loading>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive">
        <!-- 这里是会被缓存的视图组件，比如 page1,page2 -->
      </router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive">
      <!-- 这里是不被缓存的视图组件，比如 page3 -->
    </router-view>
  </div>
</template>
<script>
import loading from "./components/loading";
export default {
  data() {
    return {
      footer_show: true
    };
  },
  components: { loading },
  created() {
    // console.log(this.$store.getters.getIslogin)
    if (sessionStorage.getItem("token")) this.$store.commit("setIslogin", true);
  },
  methods: {}
};
</script>
<style >
@import "./assets/iconfont/iconfont.css";
@import "./assets/iconfont/iconfont2.css";
@import "./assets/iconfont/iconfont3.css";
</style>
<style lang="stylus" rel="stylesheet/stylus">
.horizontal-scroll-list-wrap {
  border: 0 !important;

  .cube-scroll-content {
    display: inline-block;
  }

  .list-wrapper {
    padding: 0 10px;
    line-height: 60px;
    white-space: nowrap;
  }

  .list-item {
    display: inline-block;
  }
}
</style>
