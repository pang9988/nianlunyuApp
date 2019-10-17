<template>
  <div class="page-navbar">
    <div class="caption">
      <i class="iconfont" @click="$router.go(-1)">&#xe732;</i>
      <h1 class="caption-info">结算</h1>
    </div>
    <mt-navbar class="page-part" v-model="selected">
      <mt-tab-item id="1">
        <span class="top_btn">同城配送</span>
      </mt-tab-item>
      <mt-tab-item id="2">
        <span class="top_btn">到店自取</span>
      </mt-tab-item>
    </mt-navbar>
    <mt-tab-container v-model="selected">
      <mt-tab-container-item class="box" id="1">
        <div class="site" @click="showAddressPicker">
          <span v-show="!active">请选择收货地址</span>
          <span v-show="active">收货地址为:</span>
          <span class="right" v-show="!active">&gt;</span>
          <span class="right" v-show="active" v-text="site"></span>
        </div>
        <div class="myshop">
          <span>门店名称：××蛋糕</span>
          <span>门店电话：0000-00000000</span>
          <span
            class="line_height"
          >配送门店：1.地址：越秀区侨光路8号华厦大厦B座7楼达内&nbsp;2.营业时间：8:30-18:00 每周一至周五公休。3.蛋糕预约三年起，请填写预约时间。</span>
        </div>
        <div class="sub">
          <span class="noborder">预约专用</span>
          <div @click="showDateTimePicker">
            <i>*&nbsp;</i>
            <span>预&nbsp;约&nbsp;日&nbsp;期</span>
            <span class="right">{{time}}&nbsp;&gt;</span>
          </div>
          <mt-field label="备注："></mt-field>
        </div>
        <div class="product" v-for="(item,index) of list" :key="index">
          <img :src="`http://127.0.0.1:5050/${item.pic}`" alt />
          <span class="product_title" v-text="item.pname"></span>
          <span class="product_details">
            <span :class="{none:item.is_state=='-1'}" v-text="`状态:\n${item.is_state}`"></span>
            <span :class="{none:item.size==null}" v-text="`尺寸:\n${item.size}`"></span>
            <span :class="{none:item.fruit==null}" v-text="`水果:\n${item.fruit}`"></span>
            <span :class="{none:item.else_message==null}" v-text="`套餐:\n${item.else_message}`"></span>
            <span :class="{none:item.style==null}" v-text="`款式:\n${item.style}`"></span>
          </span>
          <span class="jiesuan_shuliang" v-text="`×${item.count}`"></span>
          <span class="price" v-text="`¥${item.price}`"></span>
        </div>
        <div class="method">
          <span class="pay">
            <span>支付方式</span>
            <span class="right">微信支付&nbsp;&gt;</span>
          </span>
          <span>
            <span>运费</span>
            <span class="right pay_site">请先选择收货地址</span>
          </span>
        </div>
      </mt-tab-container-item>

      <mt-tab-container-item class="box" id="2">
        <div class="contact">
          <mt-field class="pro" label="收货人：" placeholder="可以手动填写"></mt-field>
          <mt-field class="phone" label="联系电话：" placeholder="可以手动填写"></mt-field>
        </div>
        <div class="myshop">
          <span>门店名称：××蛋糕</span>
          <span>门店电话：0000-00000000</span>
          <span
            class="line_height"
          >配送门店：1.地址：越秀区侨光路8号华厦大厦B座7楼达内&nbsp;2.营业时间：8:30-18:00 每周一至周五公休。3.蛋糕预约三年起，请填写预约时间。</span>
          <span class="attention">*自提订单请去以上门店提货</span>
        </div>
        <div class="sub">
          <span class="noborder">预约专用</span>
          <div @click="showDateTimePicker">
            <i>*&nbsp;</i>
            <span>预&nbsp;约&nbsp;日&nbsp;期</span>
            <span class="right">{{time}}&nbsp;&gt;</span>
          </div>
          <mt-field label="备注："></mt-field>
        </div>
        <div class="product" v-for="(item,index) of list" :key="index">
          <img :src="`http://127.0.0.1:5050/${item.pic}`" alt />
          <span class="product_title" v-text="item.pname"></span>
          <span class="product_details">
            <span :class="{none:item.is_state=='-1'}" v-text="`状态:\n${item.is_state}`"></span>
            <span :class="{none:item.size==null}" v-text="`尺寸:\n${item.size}`"></span>
            <span :class="{none:item.fruit==null}" v-text="`水果:\n${item.fruit}`"></span>
            <span :class="{none:item.else_message==null}" v-text="`套餐:\n${item.else_message}`"></span>
            <span :class="{none:item.style==null}" v-text="`款式:\n${item.style}`"></span>
          </span>
          <span class="jiesuan_shuliang" v-text="`×${item.count}`"></span>
          <span class="price" v-text="`¥${item.price}`"></span>
        </div>
        <div class="method">
          <span class="pay">
            <span>支付方式</span>
            <span class="right">微信支付&nbsp;&gt;</span>
          </span>
          <span>
            <span>运费</span>
            <span class="right attention">包邮</span>
          </span>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
    <div class="bottom">
      <span class="money" v-text="Summoney()"></span>
      <label class="submit" @click="submit_order">提交订单</label>
    </div>
  </div>
</template>
<script>
import { provinceList, cityList, areaList } from "../data/area";
const addressData = provinceList;
addressData.forEach(province => {
  province.children = cityList[province.value];
  province.children.forEach(city => {
    city.children = areaList[city.value];
  });
});
export default {
  data() {
    return {
      selected: "1",
      pickerValue: "",
      time: "",
      list: [],
      // 地址
      site: "",
      active: false
    };
  },
  created() {
    if (this.$router.history.current.name == "Close") {
      this.list = this.$router.history.current.query.data;
      // console.log(this.list);
    }
    var time = new Date();
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var date = time.getDate();
    var current = year + "-" + month + "-" + date;
    var hours = time.getHours();
    var minutes =
      time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
    var second =
      time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
    this.time =
      year +
      "-" +
      month +
      "-" +
      date +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      second;
  },
  mounted() {
    this.addressPicker = this.$createCascadePicker({
      title: "请选择地址",
      data: addressData,
      onSelect: this.selectHandle,
      onCancel: this.cancelHandle
    });
  },
  methods: {
    //提交订单
    submit_order() {
      // console.log("提交订单");
      //获取当前时间
      var time = new Date();
      var u_order_time = time.getTime();
      //获取年
      var year = time.getFullYear();
      year = year.toString();
      //获取月
      var month = time.getMonth() + 1;
      if (month < 10) {
        month = 0 + month.toString();
      }
      month = month.toString();
      //获取日
      var date = time.getDate();
      date = date.toString();
      //var order_time=year+month+date;
      //console.log(order_time)
      //随机取9个数
      var arr = [];
      for (var i = 0; i < 8; i++) {
        var index = Math.floor(Math.random() * 10);
        arr.push(index);
      }
      arr = arr.join("");
      //订单号
      var order_time = year + month + date + arr;
      // console.log(order_time);
      //遍历得到每一个商品的信息
      for (var i of this.list) {
        // console.log(i);
        // console.log(i.sid);
        // 结算的商品生成同一个订单号
        this.axios
          .get("/orders/order", {
            params: {
              product_id: i.pid,
              count: i.count,
              order_id: order_time,
              difference: i.sid
            }
          })
          .then(result => {});
      }
      // 生成一个用户订单
      this.axios("/orders/user_order", {
        params: {
          status: 1,
          order_time: u_order_time,
          order_id: order_time
        }
      }).then(result => {
        // console.log(result);
        // 去到订单页
        this.$router.push({
          path: "/OrderForm",
          query: {
            data: "fromClose"
          }
        });
      });
      if (this.list[0].cid != null) {
        var str = "";
        // 创建循环拼接字符串内容
        for (var item of this.list) {
          // 选中状态
          str += item.cid + ",";
        }
        str = str.substring(0, str.length - 1);
        // console.log(this.list);
        this.axios.post("/cart/del_cart", { cids: str }).then(result => {});
      }
    },
    showDateTimePicker() {
      if (!this.dateTimePicker) {
        this.dateTimePicker = this.$createDatePicker({
          title: "预约日期",
          min: new Date(2019, 0, 1, 1, 0, 0),
          max: new Date(2020, 7, 1, 1, 0, 0),
          value: new Date(),
          columnCount: 6,
          onSelect: this.selectHandle,
          onCancel: this.cancelHandle
        });
      }

      this.dateTimePicker.show();
    },
    selectHandle(date, selectedVal, selectedText) {
      this.time =
        selectedText[0] +
        "-" +
        selectedText[1] +
        "-" +
        selectedText[2] +
        " " +
        selectedText[3] +
        ":" +
        selectedText[4] +
        ":" +
        selectedText[5];
    },
    Summoney() {
      let money = 0;
      var list = this.list;
      for (let i = 0; i < list.length; i++) {
        money += list[i].count * list[i].price;
      }
      return "总计：¥" + money;
    },
    // 选择地址
    showAddressPicker() {
      this.addressPicker.show();
    },
    selectHandle(selectedVal, selectedIndex, selectedText) {
      // this.$createDialog({
      //   type: "warn",
      //   content: `Selected Item: <br/> - value: ${selectedVal.join(
      //     ", "
      //   )} <br/> - index: ${selectedIndex.join(
      //     ", "
      //   )} <br/> - text: ${selectedText.join(" ")}`,
      //   icon: "cubeic-alert"
      // }).show();
      // console.log(selectedText.join(" "));
      this.site = selectedText.join("/");
      this.active = true;
    },
    cancelHandle() {
      this.$createToast({
        type: "correct",
        txt: "取消选择",
        time: 1000
      }).show();
      this.active = false;
    }
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
body {
  background: #f9f9f9;
}
.none {
  display: none !important;
}
.page-navbar {
  margin-top: 10px;
}
/*头部*/
.caption {
  width: 100%;
  /* padding: 0px 0 5px 0; */
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
.page-part {
  border-bottom: 1px solid #ccc;
  position: relative;
  /* top: 0px; */
  width: 100%;
  z-index: 1;
}
.box {
  margin-bottom: 55px;
  margin-top: 0px;
}
.page-navbar .mint-tab-item-label {
  font-size: 16px;
}

.top_btn {
  display: inline-block;
}
.right {
  float: right;
}
.site {
  display: block;
  height: 35px;
  font-size: 16px;
  margin-top: 2px;
  color: #3e3e3e;
  line-height: 35px;
  background-color: #fff;
  padding: 0 10px 0 10px;
}
.contact {
  display: block;
  height: 95px;
  font-size: 16px;
  margin-top: 2px;
  color: #3e3e3e;
  /* margin-bottom: 15px; */
  line-height: 30px;
  background-color: #fff;
  padding: 0 10px 0 10px;
  border-bottom: 1px solid #ccc;
}
.myshop {
  /* line-height: 35px; */
  margin-top: 10px;
  background-color: #fff;
  color: #3e3e3e;
  padding: 5px 10px 0 10px;
  font-size: 14px;
  border-bottom: 1px solid #ccc;
}
.myshop span {
  display: block;
  margin-top: 10px;
  padding-bottom: 10px;
}
.line_height {
  line-height: 17px;
}
.attention {
  color: #e1465b;
}
.sub {
  display: block;
  background-color: #fff;
  color: #3e3e3e;
  padding: 0 10px 0 10px;
  margin-top: 10px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}
.sub > span {
  display: block;
  /* padding: 5px 10px 0 10px; */
  height: 35px;
  line-height: 35px;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
}
.sub > div {
  display: block;
  /* padding: 5px 10px 0 10px; */
  height: 35px;
  line-height: 35px;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
}
.sub i {
  color: #f00;
}
.sub .noborder {
  border: 0;
}
.product {
  position: relative;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
  padding: 0 10px 0 10px;
  /* margin-top: px; */
  background-color: #fff;
  color: #5558;
}
.product img {
  width: 95px;
  height: 90px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.product_title {
  color: #3e3e3e;
  font-size: 16px;
  margin-bottom: 5px;
  display: inline-block;
  line-height: 25px;
  position: absolute;
  top: 15px;
  left: 120px;
}
.product_details {
  position: absolute;
  top: 43px;
  left: 110px;
  margin-left: 5px !important;
}
.product_details span {
  display: inline-block;
  line-height: 25px;
  margin-left: 5px;
}
.jiesuan_shuliang {
  position: absolute;
  top: 80px;
  left: 120px;
}
.product .price {
  position: absolute;
  color: #e1465b;
  top: 80px;
  right: 10px;
}
.method {
  margin-top: 10px;
  background-color: #fff;
  color: #3e3e3e;
  font-size: 14px;
}
.method > span {
  display: block;
  line-height: 35px;
  border-bottom: 1px solid #ddd;
  padding: 0px 10px 0 10px;
}
.pay_site {
  color: #5558;
}
.bottom {
  position: fixed;
  bottom: 0;
  padding: 0px 10px 0 10px;
  background-color: #fff;
}
.money {
  display: inline-block;
  font-size: 16px;
  margin-bottom: 10px;
  line-height: 10px;
  color: #ff5150;
}
.submit {
  position: relative;
  display: inline-block;
  text-align: center;
  width: 120px;
  line-height: 50px;
  background: #fe7951 !important;
  color: #fff;
  font-size: 14px;
  left: 161px;
}
</style>
