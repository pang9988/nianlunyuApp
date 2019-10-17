<template>
  <div>
    <div>
      <mt-tab-container v-model="active">
        <!-- 首页 -->
        <mt-tab-container-item id="myIndex">
          <div class="myIndexBotton" style="text-align: center;;width:100%">
            <!-- 搜索 -->
            <div class="my_search">
              <span class="iconfont sousuo" @click="$router.push('/Search')">&#xe65f;&nbsp;搜索</span>
              <div style="background:#ddd;height:1px;width:100%;margin:12px 0"></div>
            </div>
            <!-- 产品导航 -->
            <div class="product-nav">
              <div class="list-nav" @click="detail">
                <!-- <i class="iconfont">&#xe6be;</i> -->
                <img src="/images/product/_20190722205301_14.png" style="width:45px;" alt />
                <span class="list-menu">蛋糕</span>
              </div>
              <div class="list-nav" @click="detail">
                <!-- <i class="iconfont font">&#xe666;</i> -->
                <img src="/images/product/_20190722205301_26.png" style="width:45px;" alt />
                <span class="list-menu">甜点</span>
              </div>
              <div class="list-nav" @click="detail">
                <!-- <i class="iconfont font">&#xe613;</i> -->
                <img src="/images/product/_20190722205301_34.png" style="width:45px;" alt />
                <span class="list-menu">小食</span>
              </div>
              <div class="list-nav" @click="detail">
                <!-- <i class="iconfont">&#xe601;</i> -->
                <img src="/images/product/_20190722205301_28.png" style="width:45px;" alt />
                <span class="list-menu">礼盒</span>
              </div>
            </div>
            <mt-swipe :auto="3000" :defaultIndex="0" :speed="800" :show-indicators="true">
              <mt-swipe-item v-for="(carousel,i) of carousel_list" :key="i">
                <router-link :to="`/Details/${carousel.pid}`">
                  <img :src="`http://127.0.0.1:5050/${carousel.img}`" alt />
                </router-link>
              </mt-swipe-item>
            </mt-swipe>
            <!-- 公告 -->
            <div class="gonggao">
              <p class="iconfont">
                <span class="up">
                  <i class="iconfont">&#xe61a;</i>
                </span>
                <span to="#" class="slide">
                  <!--   -->
                  <i
                    data-text="店铺营业时间为：8:30-18:00,对每一份甜点心怀敬意,为保证最佳赏味,请提前预约制作。"
                    :class="[isRun?'run':'',!isRun?'paused':'']"
                  >店铺营业时间为：8:30-18:00,对每一份甜点心怀敬意,为保证最佳赏味,请提前预约制作。</i>
                </span>
              </p>
            </div>
            <!-- 推荐 -->
            <router-link to="Details/29">
              <img src="images/product/1451241729614010049.png" />
            </router-link>
            <!-- 小食 -->
            <div class="snack-list clearfix">
              <span class="snack-title" v-text="series_name"></span>
              <router-link :to="`/ProductList/${cid}`" class="product-more">更多&gt;</router-link>
            </div>
            <div class="snack-list clearfix">
              <ul
                class="mylist"
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="loading"
                infinite-scroll-distance="10"
                infinite-scroll-throttle-delay="false"
                infinite-scroll-immediate-check="false"
              >
                <li class="snack-item" v-for="(item,i) of product_list" :key="i">
                  <router-link :to="`/Details/${item.pid}`">
                    <img :src="`http://127.0.0.1:5050/${item.pic}`" alt />
                    <span class="title" v-text="item.pname"></span>
                    <span class="price" v-text="`￥${item.price}`"></span>
                  </router-link>
                </li>
              </ul>
            </div>
            <cube-loading :size="40" v-if="toBottom" v-show="loading"></cube-loading>
            <div v-if="!toBottom" style="color:#555;font-size:16px;">已经到底了</div>
            <div style="height:1.7rem;"></div>
            <!-- index -->
          </div>
        </mt-tab-container-item>
        <!-- 分类 -->
        <mt-tab-container-item id="myProduct" :style="`height:${resizeHeight}px`">
          <classify></classify>
        </mt-tab-container-item>
        <!-- 购物车 -->
        <mt-tab-container-item id="myCart">
          <cart></cart>
        </mt-tab-container-item>
        <!-- 个人中心 :style="`height:${resizeHeight}px` -->
        <mt-tab-container-item id="me" :style="`height:${resizeHeight}px`">
          <own></own>
        </mt-tab-container-item>
      </mt-tab-container>

      <!-- 底部 -->
      <mt-tabbar v-model="active" fixed>
        <mt-tab-item id="myIndex">
          <!-- <img slot="icon" src="images/1.jpg" /> -->
          <span slot="icon" class="iconfont myicon">&#xe604;</span>首页
        </mt-tab-item>
        <mt-tab-item id="myProduct">
          <span slot="icon" class="iconfont myicon">&#xe632;</span>所有商品
        </mt-tab-item>
        <mt-tab-item id="myCart">
          <span slot="icon" class="iconfont myicon">&#xe611;</span>购物车
        </mt-tab-item>
        <mt-tab-item id="me">
          <span slot="icon" class="iconfont myicon">&#xe609;</span>个人中心
        </mt-tab-item>
      </mt-tabbar>
    </div>
  </div>
</template>
<script>
// 导入eventBus 兄弟之间通信
import { eventBus } from "../eventBus.js";
// 导入需要的子组件(分类,购物车,个人中心)
import Classify from "./Classify.vue";
import Cart from "./Cart";
import Own from "./Own";
export default {
  data() {
    return {
      active: "myIndex",
      // 屏幕的高度
      resizeHeight: 650,
      // 屏幕的宽度
      resizeWeight: 0,
      // 轮播图的数据
      carousel_list: [],
      // 首页显示某个系列的商品数据
      product_list: [],
      // 某个系列下的id
      cid: 2,
      // 系列名称
      series_name: "小食",
      // 公告动画
      isRun: true,
      // 数据当前页数
      pno: 1,
      // 数据每页的数量
      pageSize: 6,
      // 已经到底了
      toBottom: true,
      // 是否可以刷新
      isload: false,
      loading: false,
      show: false
    };
  },
  created() {
    this.axios.get("/index/carousel").then(result => {
      this.carousel_list = result.data.data;
    });
    this.axios
      .get("/index/index", {
        params: { cid: this.cid, pno: this.pno, pageSize: this.pageSize }
      })
      .then(result => {
        var list = result.data.data;
        this.product_list = list;
        this.series_name = list[0].cname;
      });
    this.loadMore();
    // console.log(this.scrollBehavior)
    // 屏幕可用区域变化时执行 (分类的高度需要与屏幕高度一样)
    this.resizeHeight = screen.availHeight;
    window.addEventListener("resize", () => {
      this.resizeHeight = screen.availHeight;
      this.resizeWeight = window.screen.availWidth;
      this.isRun = false;
      setTimeout(() => {
        this.isRun = true;
      }, 10);
    });
  },
  // 注册子组件
  components: {
    Classify: Classify,
    cart: Cart,
    own: Own
  },
  methods: {
    loadMore() {
      if (this.isload == true) return;
      this.loading = true;
      setTimeout(() => {
        // 获取后台数据显示 需要传入某系列的cid
        var cid = this.cid;
        this.pno++;
        this.axios
          .get("/index/index", {
            params: { cid: cid, pno: this.pno, pageSize: this.pageSize }
          })
          .then(result => {
            var list = result.data.data;
            // console.log(list);
            if (list == undefined) {
              this.toBottom = false;
              // this.$toast("已经到底了");
              this.isload = true;
            } else {
              this.product_list = this.product_list.concat(list);
            }
          });
        this.loading = false;
      }, 1500);
    },
    detail() {
      this.active = "myProduct";
    }
  },
  watch: {
    active() {
      // console.log(123)
    }
  },
  beforeRouteEnter(to, from, next) {
    // console.log(to);
    // console.log(from);
    //判断是从哪个路由过来的，
    if (from.name == "Details" && to.query.temp == "Index") {
      // to.meta.keepAlive = false;
      next(vm => {
        vm.active = "myIndex";
      });
      return;
    }
    if (from.name == "Details" && to.query.temp == "Cart") {
      next(vm => {
        vm.active = "myCart";
      });
      return;
    }
    next();
  },
  beforeRouteLeave(to, from, next) {
    // console.log("离开");
    // console.log(to);
    // if (
    //   (to.name === "OrderForm" || to.name === "Save") &&
    //   !this.$store.getters.getIslogin
    // ) {
    //   this.$router.push("/Login");
    // }
    if (to.name === "ProductList") {
      to.query.temp = "Classify";
    }
    next();
  }
};
</script>
<style scope>
body {
  background: #fff;
}
.my_search {
  width: 92%;
  margin: 12px auto;
  background: #fff;
}
.sousuo {
  display: block;
  border: 1px solid #5555;
  border-radius: 5px;
  color: #ccc;
  background-color: #fff;
  font-size: 15px;
  line-height: 32px;
}
.clearfix::before {
  content: "";
  clear: both;
  display: block;
}
.clearfix::after {
  content: "";
  clear: both;
  display: block;
}
/* 顶部食品类型 */
img {
  width: 95%;
}
.product-nav {
  margin: 0.28rem;
  text-align: center;
  display: flex;
}
.product-nav .list-nav {
  width: 24%;
  justify-content: space-around;
}
.product-nav .list-nav i {
  display: block;
  font-size: 1rem;
  margin-bottom: 0.2rem;
  opacity: 0.5;
}
.product-nav .list-nav span.list-menu {
  font-size: 0.35rem;
  color: #333;
  display: block;
}
/* 公告 */
.gonggao {
  width: 95%;
  overflow: hidden;
  margin: auto;
  padding: 10px 0;
}

.gonggao span.up {
  width: 5%;
  margin-right: 3px;
  background: #fff;
  color: #243f4c;
  overflow: hidden;
  float: left;
}
.gonggao .slide {
  width: 94%;
  color: #795548;
  float: left;
  overflow: hidden;
}
.gonggao .slide i {
  font-style: normal;
  display: inline-block;
  animation: translatex 10s linear infinite;
  white-space: nowrap;
}
.gonggao .slide i.run {
  animation-play-state: running;
}
.gonggao .slide i.paused {
  animation-play-state: paused;
}
.slide i:after {
  position: absolute;
  left: 100%;
  content: attr(data-text);
  margin-left: 50px;
}
@keyframes translatex {
  0% {
    transform: translateX(0px);
  }
  100% {
    transform: translateX(-670px);
  }
}

/* 轮播 */
.mint-swipe {
  height: 200px !important;
  width: 95%;
  margin: 0 auto;
  overflow: hidden;
}
.mint-swipe img {
  width: 100%;
}
/* classify */
.mem {
  height: 15.333333rem;
}
/* 小食 */
.snack-list {
  width: 95%;
  font-size: 0.45rem;
  margin: 0.28rem auto;
  box-sizing: border-box;
  letter-spacing: 1px;
}
/* 弹性布局 首页商品 */
.mylist {
  display: flex;
  /* 换行 */
  flex-wrap: wrap;
  /* 周抽起点对齐 */
  justify-content: flex-start;
  width: 100%;
}
.mylist > li {
  /* width: 33.3%; */
  width: 31.2%;
  margin-bottom: 0.2rem;
  margin-right: 10px;
}
.mylist > li:nth-child(3n) {
  margin-right: 0;
}
/* 图片 */
.snack-item img {
  width: 100%;
  /* width: 116px; */
  height: 116px;
}
.snack-list .snack-title {
  float: left;
  text-align: left;
  width: 50%;
}
.snack-list .product-more {
  width: 50%;
  text-align: right;
  float: right;
  color: #824e3b;
  font-size: 0.45rem;
}
.snack-list .snack-item {
  /* float: left;
  width: 33.3%; */
  text-align: left;
}
.snack-item span {
  margin: 0.12rem 0 0 0;
  white-space: pre-wrap;
  font-size: 0.4rem;
  display: block;
}
.snack-item .title {
  display: inline-block;
  color: #333;
  height: 21px;
}
.snack-item .price {
  color: crimson;
  font-size: 0.35rem;
}
/* 搜索框的高 */

.mint-searchbar {
  background-color: #efeff4 !important;
}
/* 取消的文字样式 */
.my_search .mint-searchbar-cancel {
  font-size: 14px !important;
  color: #000 !important;
}
/* 搜索框的文字样式 */
.my_search .mint-searchbar-core {
  font-size: 14px !important;
}
/* 底部icon图标 */
.myicon {
  font-size: 22px;
}
/* 底部选项卡的高度 */
.mint-tabbar.is-fixed {
  height: 1.464rem;
}
.cube-loading-spinners {
  margin: 0 auto;
}
</style>