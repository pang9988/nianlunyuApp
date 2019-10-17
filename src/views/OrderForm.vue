<template>
  <div class="container">
    <div style="height:50px;width:100%;">
      <i class="iconfont" @click="rollback" style="font-size:27px;">&#xe732;</i>
    </div>
    <!-- 订单状态 -->
    <div slot="content" class="nav-scroll-list-wrap scroll-wrapper">
      <cube-scroll
        ref="scroll"
        :data="navTxts"
        direction="horizontal"
        class="horizontal-scroll-list-wrap"
      >
        <ul class="nav-wrapper">
          <li
            v-for="(item,i) of navTxts"
            :key="i"
            class="nav_item"
            :style="active[i].isSelect?'color:#fa7b7a;':''"
            @click="isActive(i)"
          >{{item}}</li>
        </ul>
      </cube-scroll>
    </div>
    <div style="min-height:8px;width:100%;"></div>
    <!-- 订单表 -->
    <div class="order-form" v-for="(item,i) of data" :key="i">
      <router-link to>
        <div class="form-item">
          <span>
            支付订单
            <span class="order-code" v-text="item.order_id"></span>
          </span>
          <span class="order-time" v-text="item.order_time"></span>
        </div>
        <div class="form-box">
          <div class="form-info" v-for="(item2,j) of order[i]" :key="j">
            <img :src="`http://127.0.0.1:5050/${item2.pic}`" alt style />
            <span class="pName" v-text="item2.pname"></span>
            <span class="state">
              <span
                :class="{none:item2.is_state=='-1'}"
                v-text="`状态:\n${item2.is_state==0?'预定':'现货'}`"
              ></span>
              <span :class="{none:item2.size==null}" v-text="`尺寸:\n${item2.size}`"></span>
              <span :class="{none:item2.fruit==null}" v-text="`水果:\n${item2.fruit}`"></span>
              <span :class="{none:item2.else_message==null}" v-text="`套餐:\n${item2.else_message}`"></span>
              <span :class="{none:item2.style==null}" v-text="`款式:\n${item2.style}`"></span>
            </span>
            <span class="count" v-text="`×${item2.count}`"></span>
            <span class="subtotal" v-text="`￥${item2.price}`"></span>
          </div>
        </div>
      </router-link>
      <div class="end">
        <span>
          合计：
          <span class="total" v-text="Summoney(i)"></span>
        </span>
        <div class="over" v-if="item.status!=5">
          <span class="off" @click="Delorder(item.order_id)">取消</span>
          <span class="pay">付款</span>
        </div>
        <span class="cancel" v-if="item.status==5">已取消</span>
      </div>
    </div>
  </div>
</template>
<script>
const txts = ["全部", "待付款", "待发货", "待收货", "已完成", "已取消", "售后"];
export default {
  data() {
    return {
      navTxts: txts,
      options: 1,
      data: [],
      order: [],
      money: 0,
      active: [
        { isSelect: true },
        { isSelect: false },
        { isSelect: false },
        { isSelect: false },
        { isSelect: false },
        { isSelect: false },
        { isSelect: false }
      ]
    };
  },
  created() {
    this.load(0);
  },
  methods: {
    load(status) {
      // console.log(status)
      if (this.$store.getters.getIslogin) {
        // 获取该用户的所有订单信息
        this.axios
          .get("/orders/order_list", { params: { status: status } })
          .then(result => {
            // console.log(result.data);
            if (result.data.code == 200) {
              var list = result.data.data;
              // console.log(list);

              //合计
              /*for (var n = 0; n < list.length; n++) {
              console.log(list[n]);
              var money = list[n].price * list[n].count;
              this.money= money;
              console.log(money)
            } */

              var hash = {};
              this.data = this.deteleObject(list, "order_id");
              // console.log(this.data);
              // var newAll = list;
              // console.log(list);  [[],[],...]
              for (var i = 0; i < this.data.length; i++) {
                this.order[i] = [];
                for (var j = 0; j < list.length; j++) {
                  if (this.data[i].order_id == list[j].order_id) {
                    this.order[i].push(list[j]);
                    // console.log(this.order[i]);
                  }
                }
              }
            } else {
              this.data = [];
              this.order = [];
            }
            // console.log(this.order);
          });
      }
    },
    deteleObject(arr, name) {
      var hash = {};
      return arr.reduce(function(item, next) {
        hash[next[name]] ? "" : (hash[next[name]] = true && item.push(next));
        return item;
      }, []);
    },
    scrollTo() {
      this.$refs.scroll.scrollTo(
        0,
        this.scrollToY,
        this.scrollToTime,
        ease[this.scrollToEasing]
      );
    },
    rollback() {
      // console.log(this.$router.history.current.query.data);
      if (this.$router.history.current.query.data == "fromClose") {
        this.$router.go(-2);
      } else {
        this.$router.go(-1);
      }
    },
    Delorder(data) {
      this.$messagebox
        .confirm("是否确认取消此订单")
        .then(action => {
          // 发送ajax请求
          this.axios
            .post("/orders/del_order", { order_id: data, status: 5 })
            .then(result => {
              // console.log(result.data);
              if (result.data.code == 200) {
                this.load(0);
              }
            });
        })
        .catch(err => {
          return;
        });
    },
    Summoney(i) {
      let money = 0;
      var list = this.order[i];
      for (let i = 0; i < list.length; i++) {
        money += list[i].count * list[i].price;
      }
      return "￥" + money;
    },
    isActive(n) {
      this.load(n);
      for (var i = 0; i < this.active.length; i++) {
        if (i == n) {
          this.active[i].isSelect = true;
        } else {
          this.active[i].isSelect = false;
        }
      }
    }
  },
  computed: {},
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
<style scoped  lang="stylus" rel="stylesheet/stylus">
.container {
  background: rgba(221, 221, 221, 0.5);
  /* width:100%; */
}

/* 状态样式 */
.Tabbar {
  justify-content: space-around;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
  display: flex;
  /* width: 120%; */
}

.Tabbar .toggle {
  background: #fff;
  box-shadow: none;
  border-radius: 0;
  border: 0;
}

.Tabbar .active {
  border-bottom: 1px solid #ea5454;
  color: #ea5454;
}

/* 订单 */
.order-form {
  background: #fff;
  /* width:95%; */
  margin: 0 auto;
}

.order-form .form-item {
  font-size: 12px;
  color: #bbb;
  padding: 12px 0;
  margin: 0 2.5%;
}

.order-form .form-item .order-time {
  float: right;
}

.order-form .form-box {
  margin: 0 10px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
  position: relative;
  color: #333;
}

.order-form .form-box img {
  width: 100px;
  height: 100px;
}

.form-box .form-info {
  position: relative;
  height: 100px;
  margin-bottom: 7px;
}

.form-box .form-info .pName {
  vertical-align: top;
  overflow: hidden;
  display: inline-block;
  font-size: 18px;
  margin-left: 10px;
}

.form-box .form-info .state {
  top: 0.8rem;
  position: absolute;
  overflow: hidden;
  word-wrap: break-word;
  font-size: 0.4rem;
  color: #7a7a7a;
  left: 2.95rem;
}

.form-box .form-info .count {
  left: 105px;
  bottom: 5px;
  position: absolute;
  vertical-align: bottom;
  font-size: 15px;
  color: #7a7a7a;
}

.form-box .form-info .subtotal {
  right: 6px;
  position: absolute;
  bottom: 5px;
  font-size: 15px;
  color: #ed143d;
}

.end {
  color: #333;
  padding: 18px 12px 25px 10px;
  font-size: 18px;
  border-bottom: 1px solid #ccc;
}

.end .total {
  color: #ed143d;
}

.end .over {
  float: right;
}

.end .over span.pay {
  margin-left: 10px;
}

.end .over span {
  padding: 6px 12px;
  font-size: 15px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* 订单导航 */
.nav-scroll-list-wrap {
  background-color: white;
  height: 39px;
  border-bottom: 2px solid #ddd;

  .cube-scroll-content {
    display: inline-block;

    .nav-wrapper {
      display: inline-block;
      white-space: nowrap;
      line-height: 36px;
      padding: 0 5px;

      .nav_item {
        font-size: 18px;
        display: inline-block;
        padding: 0 3px;
        margin: 0 5px;

        &:nth-child(1) {
          // color: #fa7b7a;
          // border-bottom: 1px solid #ea5454;
        }
      }
    }
  }
}

.cancel {
  float: right;
  color: #333;
  // padding: 0.48rem 0.32rem 0.666667rem 0.266667rem;
  font-size: 0.48rem;
}
</style>
