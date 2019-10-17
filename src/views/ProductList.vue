<template>
  <div>
    <div class="caption">
      <i class="iconfont" @click="$router.go(-1)">&#xe732;</i>
      <h1 class="caption-info">商品列表</h1>
    </div>
    <!-- 搜索 -->
    <div class="my_search">
      <span class="iconfont sousuo" @click="$router.push('/Search')">&#xe65f;&nbsp;搜索</span>
      <div style="background:#ddd;height:1px;width:100%;margin:12px 0"></div>
    </div>
    <ul class="order">
      <li>
        <span :class="{active:currentIndex[0].isSelect}" @click="selectActive(0)">综合</span>
      </li>
      <li>
        <span :class="{active:currentIndex[1].isSelect}" @click="selectActive(1)">最新</span>
      </li>
      <li>
        <span :class="{active:currentIndex[2].isSelect}" @click="selectActive(2)">价格</span>
        <i class="add iconfont" :class="{serect:activeSelect[0]}">&#xe630;</i>
        <i class="cut iconfont" :class="{serect:activeSelect[1]}">&#xe6aa;</i>
      </li>
      <li>
        <span :class="{active:currentIndex[3].isSelect}" @click="selectActive(3)">销量</span>
      </li>
      <li>
        <span :class="{active:currentIndex[4].isSelect}" @click="selectActive(4)">阅读量</span>
      </li>
    </ul>
    <!-- <div style="height:0.2rem;background:#bbb;opacity:0.3;"></div> -->
    <div class="proList">
      <div class="pro-item" v-for="(item,i) of product_list" :key="i">
        <router-link :to="`/Details/${item.pid}`" style="position:relative;">
          <img :src="`http://127.0.0.1:5050/${item.pic}`" alt />
          <p class="repertory">
            <i class="iconfont">&#xe661;</i>&nbsp;
            <span v-text="item.read_num"></span>
          </p>
          <h4 class="pName" v-text="item.pname"></h4>
          <span class="price" v-text="`￥${item.price}`"></span>
          <span class="volume" v-text="`已售${item.sales_volume}件`"></span>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 页面显示的数据
      product_list: [],
      // 默认保存的数据
      list: [],
      // isFirstEnter: false // 是否第一次进入，默认false
      // 控制选中的数组
      currentIndex: [
        { isSelect: true },
        { isSelect: false },
        { isSelect: false },
        { isSelect: false },
        { isSelect: false }
      ],
      // 价格的选中
      activeSelect: [false, false],
      // 单数 上 复数 下
      odd_even: 1,
      nowIdex: 0
    };
  },
  props: ["cid"],
  methods: {
    load() {
      var cid = this.cid;
      this.axios
        .get("/product/series", { params: { cid: cid } })
        .then(result => {
          // console.log(result.data.data);
          if (result.data.code == 200) {
            this.product_list = result.data.data;
            this.list = result.data.data;
            this.sort(this.nowIdex);
            // console.log(odd_even);
          } else {
            // this.$messagebox("", "没有该系列商品").then(action => {
            //   this.$router.push("/Index");
            // });
            this.list = [];
            this.product_list = [];
          }
        });
    },
    sort(n) {
      if (n == 2) {
        this.odd_even += 1;
        if (this.odd_even % 2 == 0) {
          this.activeSelect[0] = true;
          this.activeSelect[1] = false;
          if (n == 2) {
            this.product_list = this.orderingRule(this.list, "price", true);
          }
        } else {
          this.activeSelect[0] = false;
          this.activeSelect[1] = true;
          if (n == 2) {
            this.product_list = this.orderingRule(this.list, "price", false);
          }
        }
      } else {
        this.activeSelect[0] = false;
        this.activeSelect[1] = false;
      }
      if (n == 0) {
        this.product_list = this.list;
      }
      if (n == 1) {
        this.product_list = this.orderingRule(this.list, "shelf_time", false);
      }
      if (n == 3) {
        this.product_list = this.orderingRule(this.list, "sales_volume", false);
      }
      if (n == 4) {
        this.product_list = this.orderingRule(this.list, "read_num", true);
      }
    },
    // 切换排序方式
    selectActive(n) {
      this.nowIdex = n;
      this.sort(n);
      for (var i = 0; this.currentIndex.length; i++) {
        if (n == i) {
          this.currentIndex[i].isSelect = true;
        } else {
          this.currentIndex[i].isSelect = false;
        }
        if (i == 4) return;
      }
    },
    // arr:要排序的数组 name:按什么排序 order:是否逆序(true降序,false升序)默认升序
    orderingRule(arr, name, order) {
      var arr_list = [];
      var newArr = [];
      // 不改变list保存的数组,另起一个数组操作
      var Arr = [];
      for (let i = 0; i < arr.length; i++) {
        Arr.push(arr[i]);
        if (arr[i][name] == 0) {
          arr_list.push(arr[i]);
        } else {
          newArr.push(arr[i][name]);
        }
      }
      newArr = newArr.sort(function(a, b) {
        // 升序(小到大)
        return a - b;
      });
      // console.log(Arr)
      for (var i = 0; i < newArr.length; i++) {
        for (var j = 0; j < Arr.length; j++) {
          if (newArr[i] == Arr[j][name]) {
            if (order) {
              arr_list.unshift(Arr[j]);
              // 相同的删除,下次不会再有相同的
              Arr.splice(j, 1);
              continue;
            } else {
              arr_list.push(Arr[j]);
              Arr.splice(j, 1);
              continue;
            }
          }
        }
      }
      // console.log(arr_list.length);
      return arr_list;
    }
  },
  created() {
    // this.isFirstEnter = true;
    this.load();
  },
  activated() {
    this.load();
    // this.selectActive(this.nowIdex);
  },
  beforeRouteEnter(to, from, next) {
    // console.log(to)
    //判断是从哪个路由过来的，
    if (from.name == "Index" && to.query.temp == "Classify") {
      // to.meta.keepAlive = false;
      next(vm => {
        vm.currentIndex = [
          { isSelect: true },
          { isSelect: false },
          { isSelect: false },
          { isSelect: false },
          { isSelect: false }
        ];
        vm.activeSelect = [false, false];
        vm.nowIdex = 0;
      });
      return;
    }
    next();
  }
};
</script>
<style scoped>
/* 搜索框的文字样式 */
.my_search {
  width: 92%;
  margin: 12px auto;
  background: #fff;
}
.my_search .mint-searchbar-cancel {
  font-size: 14px !important;
  color: #000 !important;
}
.my_search .mint-searchbar-core {
  font-size: 14px !important;
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
/* 头部 */
.caption {
  width: 100%;
  padding: 10px 0 5px 0;
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
.order {
  display: flex;
  justify-content: space-around;
  padding: 0.4rem 0;
}
.order li {
  float: left;
  font-size: 17px;
  position: relative;
}
.order li span.active {
  color: #ed143d;
}
.order li .add {
  position: absolute;
  right: -15px;
  top: -5px;
  opacity: 0.5;
}
/*
.order li .add:before {
  content: "\25B2";
  font-size: 12px;
} */
.order li .cut {
  position: absolute;
  right: -14.75px;
  opacity: 0.5;
  top: 2px;
}
.order li .serect {
  color: #ed143d;
}
/*
.order li .cut:before {
  content: "\25Bc";
  font-size: 12px;
} */
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
  padding: 0.1rem 0;
  color: #fff;
  text-indent: 0.2rem;
  position: absolute;
  bottom: 4px;
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
