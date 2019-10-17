<template>
  <div class="container" v-if="show">
    <!-- .icon-fenxiang -->
    <div class="caption">
      <i class="iconfont" @click="$router.go(-1);">&#xe732;</i>
      <h1 class="caption-info">商品详情</h1>
    </div>
    <!-- 去到购物车 -->
    <div @click="To('Cart')" class="iconfont toCart">&#xe611;</div>
    <!-- 大图 -->
    <div class="largeImg">
      <img v-if="list.pic!=undefined" :src="`http://127.0.0.1:5050/${list.pic}`" alt />
    </div>
    <!-- 简介 -->
    <div class="intro">
      <div class="intro-head">
        <span class="price" v-text="`￥${priceAll}`"></span>
        <span class="pname" v-text="list.pname"></span>
      </div>
      <div class="fengxiang">
        <div class="iconfont">&#xe739;</div>
        <p>分享</p>
      </div>
      <div class="clearfix countAll">
        <span v-text="`销量：${list.sales_volume}件`"></span>
        <span>
          库存:
          <i v-text="repertoryAll"></i>件
        </span>
        <span v-text="`浏览量：${list.read_num}`"></span>
      </div>
    </div>
    <div style="height:0.27rem;width:100%;background-color:#ddd;margin:0"></div>
    <div class="spec" @click="Select">
      请选择 &nbsp;
      <span v-text="have_spec"></span>
      <i class="iconfont">&#xe731;</i>
    </div>
    <div style="height:0.27rem;width:100%;background-color:#ddd;margin:0"></div>
    <div class="Tabbar">
      <mt-button
        class="toggle"
        :class="{active:active=='tab1'}"
        size="small"
        @click.native.prevent="active = 'tab1'"
      >商品详情</mt-button>
      <mt-button
        class="toggle"
        size="small"
        @click.native.prevent="active = 'tab2'"
        :class="{active:active=='tab2'}"
      >商品评论</mt-button>
    </div>
    <mt-tab-container v-model="active">
      <mt-tab-container-item id="tab1">
        <img
          v-if="list.details_pic!=undefined"
          :src="`http://127.0.0.1:5050/${list.details_pic}`"
          alt
        />
      </mt-tab-container-item>
      <mt-tab-container-item id="tab2" class="comment">
        <div style="width:100%">
          <ul class="review_ul">
            <li class="active_li">
              <span>全部</span>
              <span>
                (
                <i>2</i>)
              </span>
            </li>
            <li>
              <span>有图</span>
              <span>
                (
                <i>2</i>)
              </span>
            </li>
            <li>
              <span>好评</span>
              <span>
                (
                <i>2</i>)
              </span>
            </li>
            <li>
              <span>中评</span>
              <span>
                (
                <i>2</i>)
              </span>
            </li>
            <li>
              <span>差评</span>
              <span>
                (
                <i>2</i>)
              </span>
            </li>
          </ul>
        </div>
        <div
          style="height:0.27rem;width:100%;background-color:#ddd;margin:0;position:absolute;top:50px;left:0;"
        ></div>
        <div class="review_div"></div>
        <!-- <mt-button size="small" @click.native.prevent="review = ''">全部</mt-button>
        <mt-button size="small" @click.native.prevent="review = ''">有图</mt-button>
        <mt-button size="small" @click.native.prevent="review = ''">好评</mt-button>
        <mt-button size="small" @click.native.prevent="review = ''">中评</mt-button>
        <mt-button size="small" @click.native.prevent="review = ''">差评</mt-button>-->
      </mt-tab-container-item>
      <div style="height:500px;"></div>
    </mt-tab-container>
    <div style="position:fixed;bottom:0;width:100%;z-index:999;">
      <ul class="gat-nav">
        <li class="li-nav">
          <i class="iconfont">&#xe604;</i>
          <span @click="To('Index')">首页</span>
        </li>
        <li class="li-nav">
          <i
            class="iconfont"
            :class="{actived:isSelected==true&&save==1}"
            @click="isChange"
          >&#xe637;</i>
          <span v-text="saveStatus"></span>
        </li>
        <li class="buy">
          <span class="add-cart" @click="Select(1)">加入购物车</span>
          <span class="now-buy" @click="Select(2)">立即购买</span>
        </li>
      </ul>
    </div>
    <!-- 点击请选择尺寸后在下面弹出一个规格选择 -->
    <div class="select_spec" v-show="show_spec">
      <!-- 一层蒙板 -->
      <div class="mask" @click="Cancel"></div>
      <!-- 规格信息 -->
      <div class="Spec">
        <!-- 上面图片 价格 库存 -->
        <div class="pic_list">
          <img v-if="list.pic!=undefined" :src="`http://127.0.0.1:5050/${list.pic}`" />
          <div v-text="`￥${priceAll}`"></div>
          <div class="Repertory">
            库存
            <i style="color:green" v-text="repertoryAll"></i>件
          </div>
        </div>
        <div class="Spec_select">
          <!-- 规格 -->
          <div class="Size" v-for="(ProductItem,i) of spec_lists.specifications" :key="i">
            <span class="Spec_name" v-text="ProductItem.name"></span>
            <div class="Size_select">
              <span
                v-for="(Item,index) of ProductItem.item"
                :key="index"
                v-text="`${Item.name==0?'预定':Item.name==1?'现货':Item.name}`"
                @click="selectState(Item.name,i,index)"
                :class="[Item.isShow?'':'noneActive',subIndex[i] == index?'spec_active':'']"
              ></span>
            </div>
          </div>
        </div>
        <div class="Number">
          <span>数量</span>
          <div class="Input">
            <span @click="addNum(-1)">-</span>
            <input type="text" @blur="blurInput" v-model="number" />
            <span @click="addNum(+1)">+</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    // name:"Tabbar"
    return {
      //收藏更改颜色
      isSelected: false,
      active: "tab1",
      list: {},
      // 显示规格
      show_spec: false,
      have_spec: "",
      // 第二次以后点击加入购物车或结算可以加入购物车或结算
      add_ok: 0,
      // 有什么规格的名称
      have_spec_list: [],
      // 最低~最高价钱
      priceAll: "",
      // 库存
      repertoryAll: "",
      // 选中了那个规格
      spec_active: false,
      // 多规格 数据
      spec_lists: {
        //所有的规格可能情况都在这个数组里
        difference: [],
        // 这里是要被渲染字段
        specifications: []
      },
      selectArr: [], //存放被选中的值
      shopItemInfo: {}, //存放要和选中的值进行匹配的数据
      subIndex: [], //是否选中 因为不确定是多规格还是但规格，所以这里定义数组来判断
      // 加入购物车商品数量
      number: 1,
      // 是否有该商品的详情
      show: true,
      // 跳到首页
      toIndex: false,
      // 跳到购物车
      toCart: false,
      // 收藏的状态
      save: 0,
      saveStatus: ""
    };
  },
  props: ["pid"],
  created() {
    this.load();
  },
  methods: {
    // 点击改变收藏的颜色
    isChange() {
      if (this.$store.getters.getIslogin) {
        this.isSelected = !this.isSelected;
      } else {
        this.$toast("请先登录");
        return;
      }

      this.save = this.save == 0 ? 1 : 0;
      this.axios.post("/user/save", { pid: this.pid }).then(result => {
        // console.log(result.data);
        if (result.data.code == 200) {
        }
      });
      // console.log(this.isSelected);
      if (this.isSelected == true) {
        // 选中收藏
        // console.log("选中");
        this.saveStatus = "已收藏";
      } else {
        // 取消收藏
        // console.log("未选中");
        this.saveStatus = "收藏";
      }
    },
    load() { 
      this.axios
        .get("/product/details", { params: { pid: this.pid } })
        .then(result => {
          // console.log(result.data.code);
          if (result.data.code == 200) {
            this.list = result.data.data.product[0];
            var spec = result.data.data.spec;
            this.spec_list = spec;
            // console.log(result.data.data.save);
            // 是否有收藏
            this.save = result.data.data.save;
            this.isSelected = this.save != 0 ? true : false;
            this.saveStatus = this.isSelected == 0 ? "收藏" : "已收藏";
            // 价钱的数组
            var priceArray = [];
            // 库存
            var Repertory = 0;
            // 规格的数据
            var spec_list = [];
            // 尺寸的数据
            var size_list = [];
            // 状态的数据
            var is_state_list = [];
            // 款式的数据
            var style_list = [];
            // 水果的数据
            var fruit_list = [];
            // 其他规格数据
            var else_message_list = [];
            // difference 需要的格式是  size,is_state,style,fruit,else_message
            for (var i = 0; i < spec.length; i++) {
              var str = "";
              Repertory += spec[i].repertory;
              priceArray.push(spec[i].price);
              // 取到每个规格的数据,并添加一个是否选中状态select
              spec[i].select = false;
              if (spec[i].size != null) {
                size_list.push(spec[i]);
                str += spec[i].size + ",";
              }
              if (spec[i].is_state != "-1") {
                is_state_list.push(spec[i]);
                str += spec[i].is_state + ",";
              }
              if (spec[i].style != null) {
                style_list.push(spec[i]);
                str += spec[i].style + ",";
              }
              if (spec[i].fruit != null) {
                fruit_list.push(spec[i]);
                str += spec[i].fruit + ",";
              }
              if (spec[i].else_message != null) {
                else_message_list.push(spec[i]);
                str += spec[i].else_message;
              }
              // 去掉最后的","号 再赋值
              spec[i].difference = str.substring(0, str.length - 1);
            }
            // 最高价
            var max_price = Math.max.apply(null, priceArray);
            // 最低价
            var min_price = Math.min.apply(null, priceArray);
            if (min_price == max_price) {
              this.priceAll = min_price;
            } else {
              this.priceAll = min_price + "~" + max_price;
            }
            // 所有库存
            this.repertoryAll = Repertory;
            // 去掉数组中重复的,用于在网页中显示规格
            is_state_list = this.deteleObject(is_state_list, "is_state");
            size_list = this.deteleObject(size_list, "size");
            style_list = this.deteleObject(style_list, "style");
            fruit_list = this.deteleObject(fruit_list, "fruit");
            else_message_list = this.deteleObject(
              else_message_list,
              "else_message"
            );

            // 需要的数据格式
            this.spec_lists.difference = spec;
            this.myList(size_list, "尺寸", "size");
            this.myList(is_state_list, "状态", "is_state");
            this.myList(style_list, "款式", "style");
            this.myList(fruit_list, "水果", "fruit");
            // difference 需要的格式是  size,is_state,style,fruit,else_message
            for (var i in this.spec_lists.difference) {
              this.shopItemInfo[
                this.spec_lists.difference[i].difference
              ] = this.spec_lists.difference[i]; //修改数据结构格式，改成键值对的方式，以方便和选中之后的值进行匹配
            }
            this.checkItem();
            var str_spec = "";
            for (var n of this.spec_lists.specifications) {
              if (n.name == 0 || n.name == 1) {
                n.name = "状态";
              }
              str_spec += n.name + " ";
            }
            this.have_spec = str_spec;
          } else {
            this.show = false;
            this.$messagebox("", "没有该商品详情").then(action => {
              this.$router.push("/Index");
            });
          }
          // console.log(this.spec_lists);
        });
    },
    // 去除数组里重复的有重复名称的对象
    deteleObject(arr, name) {
      var hash = {};
      return arr.reduce(function(item, next) {
        hash[next[name]] ? "" : (hash[next[name]] = true && item.push(next));
        return item;
      }, []);
    },
    // 后台拿到的规格数据转成需要的数据格式
    myList(Arr, Name, Spec) {
      if (Arr != "") {
        var length = this.spec_lists.specifications.length;
        var list = (this.spec_lists.specifications[length] = {
          name: "",
          item: []
        });
        for (var i = 0; i < Arr.length; i++) {
          list.name = Name;
          list.item[i] = {};
          list.item[i].name = Arr[i][Spec];
        }
      }
    },
    // 点击出现选择规格
    Select(n) {
      if (this.$store.getters.getIslogin) {
        this.show_spec = true;
        var selectArr = this.selectArr;
        var shopItemInfo = this.shopItemInfo;
        // 有什么规格的名称
        var specifications = this.spec_lists.specifications;
        // 显示提示有没选中规格
        this.add_ok += 1;
        if (this.add_ok > 1) {
          for (let i = 0; i < this.spec_lists.specifications.length; i++) {
            if (selectArr[i] == undefined || selectArr[i] == "") {
              this.$toast({
                message: "请选择" + specifications[i].name,
                duration: 1000
              });
              return;
            }
          }
        }
        // 选中的规格
        var name = selectArr.toString();
        var data = [];
        // 拿到对象的属性名
        var obj_name = Object.keys(shopItemInfo);
        for (var key of obj_name) {
          if (name == key) {
            // 给结算的数据
            data.push(shopItemInfo[key]);
            data[0].pid = this.list.pid;
            data[0].pic = this.list.pic;
            data[0].count = this.number;
            // console.log(list);
            // console.log(key);
            // 该商品的规格  shopItemInfo[key].sid
            var sid = shopItemInfo[key].sid;
            if (this.number > shopItemInfo[key].repertory) {
              this.$toast("库存不足");
            } else {
              // 加入购物车
              if (n == 1) {
                this.axios
                  .post("/cart/add_cart", {
                    product_id: this.pid,
                    sid: sid,
                    count: this.number
                  })
                  .then(result => {
                    // console.log(result.data);
                    if (result.data.code == 200) {
                      this.$toast({
                        message: "加入购物车成功",
                        duration: 1000
                      });
                    } else {
                      this.$toast("加入购物车失败");
                    }
                  });
              } else if (n == 2) {
                this.$router.push({
                  path: "/Close",
                  query: {
                    data: data
                  }
                });
              }
            }
          }
        }
      } else {
        this.$toast("请先登录");
      }
    },
    // 点击遮罩层退出选择规格选择
    Cancel() {
      this.show_spec = false;
      this.add_ok = 0;
      this.selectArr = [];
      this.subIndex = [];
    },
    // 点击选中规格后变成选中状态
    selectState(item, i, index) {
      // console.log(item, i, index);
      if (this.selectArr[i] != item) {
        this.selectArr[i] = item;
        this.subIndex[i] = index;
      } else {
        this.selectArr[i] = "";
        this.subIndex[i] = -1; //去掉选中的颜色
      }
      this.checkItem();
      this.changePrice();
    },
    checkItem() {
      var self = this;
      var option = self.spec_lists.specifications;
      var result = []; //定义数组存储被选中的值
      for (var i in option) {
        result[i] = self.selectArr[i] ? self.selectArr[i] : "";
      }
      for (var i in option) {
        var last = result[i]; //把选中的值存放到字符串last去
        for (var k in option[i].item) {
          result[i] = option[i].item[k].name; //赋值，存在直接覆盖，不存在往里面添加name值
          option[i].item[k].isShow = self.isMay(result); //在数据里面添加字段isShow来判断是否可以选择
        }
        result[i] = last; //还原，目的是记录点下去那个值，避免下一次执行循环时避免被覆盖
      }
      self.$forceUpdate(); //重绘
    },
    isMay: function(result) {
      // console.log(result);
      for (var i in result) {
        if (result[i] == "") {
          return true; //如果数组里有为空的值，那直接返回true
        }
      }
      return this.shopItemInfo[result].repertory == 0 ? false : true; //匹配选中的数据的库存，若不为空返回true反之返回false
    },
    // 改变价钱和库存
    changePrice() {
      var selectArr = this.selectArr;
      var shopItemInfo = this.shopItemInfo;
      var name = selectArr.toString();
      // 拿到对象的属性名
      var obj_name = Object.keys(shopItemInfo);
      for (var key of obj_name) {
        if (name == key) {
          // 该商品的规格  shopItemInfo[key].sid
          this.priceAll = shopItemInfo[key].price;
          this.repertoryAll = parseInt(shopItemInfo[key].repertory);
        }
      }
    },
    // 数量的加减
    addNum(i) {
      if (i == -1 && this.number == 1) {
        this.number = 1;
      } else {
        var number = Number(this.number);
        this.number = number + i;
      }
    },
    // 数量框 失去焦点
    blurInput() {
      var number = Number(this.number);
      if (number.toString() == "NaN") {
        this.number = 1;
      }
      this.changePrice();
    },
    // 跳转事件
    To(n) {
      if (n == "Index") {
        this.toIndex = true;
        this.$router.push("/Index");
      } else if (n == "Cart") {
        this.toCart = true;
        this.$router.push("/Index");
      }
    }
  },
  watch: {
    $route() {
      // 清空前一次的值
      this.spec_lists = {
        difference: [],
        specifications: []
      };
      this.selectArr = []; //存放被选中的值
      this.shopItemInfo = {}; //存放要和选中的值进行匹配的数据
      this.subIndex = [];
      this.show_spec = false;
      this.number = 1;
      this.show = true;
      this.add_ok = 0;
      this.load();
    }
  },
  beforeRouteLeave(to, from, next) {
    // console.log("离开");
    if (this.toIndex) {
      if (to.name === "Index") {
        to.query.temp = "Index";
      }
      this.toIndex = false;
    }
    if (this.toCart) {
      if (to.name === "Index") {
        to.query.temp = "Cart";
      }
      this.toCart = false;
    }

    // if(to.)
    next();
  }
};
</script>
<style scoped>
/* 去到购物车 */
.toCart {
  background: #f5f5f5;
  text-align: center;
  border-radius: 50%;
  height: 1rem;
  width: 1rem;
  line-height: 1rem;
  position: fixed;
  right: 0.6rem;
  top: 6.8rem;
  font-size: 20px;
  z-index: 999;
}
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
img {
  width: 100%;
  height: 100%;
}
i {
  font-style: normal;
}
/* 大图 */
.largeImg {
  width: 100%;
  height: 350px;
}
/*  */
.container {
  font-size: 0.4rem;
  /* 遮罩层需要父级为定位 */
  position: relative;
}
/* 产品简介 */
.intro {
  margin: 0.2rem 0.2rem;
}
.intro .intro-head {
  text-align: left;
  float: left;
}
.intro .fengxiang {
  text-align: center;
  margin: 0.3rem 0.4rem 0 0;
  float: right;
}
.fengxiang .iconfont {
  font-size: 25px;
}
.intro .fengxiang p {
  margin-top: 0.1rem;
  letter-spacing: 1px;
  color: #585757;
  font-size: 13px;
}
.intro .intro-head span {
  margin: 0.3rem 0;
  font-weight: 600;
  display: block;
}
.intro .intro-head span.price {
  color: #ed143d;
}
.countAll {
  text-align: center;
}
.countAll span {
  font-size: 13px;
  color: #585757;
}
.countAll span:nth-child(1) {
  float: left;
}
.countAll span:nth-child(3) {
  float: right;
}
/* 尺寸 */
.spec {
  padding: 0.4rem;
}
.spec i {
  float: right;
  font-size: 0.5rem;
  color: #585757;
}
/* 详情/评论 */
.Tabbar {
  justify-content: space-around;
  display: flex;
  background-color: #f9f9f9;
  /* font-size:16px !important; */
}
.toggle {
  /* background: #fff; */
  box-shadow: none;
  border-radius: 0;
  outline: none;
  color: #333;
  font-size: 0.47rem;
  height: 50px;
}
.Tabbar .active {
  border-bottom: 2px solid #ea5454;
}
.comment {
  display: flex;
  justify-content: space-around;
  /* padding-top: 0.4rem; */
}

/* 底部导航 */
.gat-nav {
  width: 100%;
  height: 1.3rem;
  background-color: #fff;
  border-top: 2px solid #ccc;
  padding: 0.05rem 0;
  font-size: 0.1rem;
}
.gat-nav li {
  float: left;
  text-align: center;
}
.gat-nav li.li-nav {
  margin: 0.1rem 0 0 0.4rem;
  /* font-size: 0.2rem; */
}
.li-nav i {
  font-size: 25px;
}
.li-nav span {
  font-size: 12px;
}
.gat-nav li i {
  margin-bottom: 0.08rem;
  display: block;
}
.gat-nav li.buy {
  float: right;
  margin-right: 0.3rem;
}
.gat-nav li.buy span {
  display: inline-block;
  height: 1rem;
  color: #fff;
  margin-top: 6px;
  font-size: 0.4rem;
  line-height: 1rem;
  text-align: center;
}
.gat-nav li.buy span.add-cart {
  width: 4rem;
  background: #ff9a7c;
  border-radius: 0.53rem 0 0 0.53rem;
}
.gat-nav li.buy span.now-buy {
  width: 3rem;
  background: #fe7951;
  border-radius: 0 0.53rem 0.53rem 0;
}

/* 规格选择 */
.select_spec {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}
/* 蒙板 */
.mask {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
/* 规格信息 */
.Spec {
  width: 100%;
  position: fixed;
  bottom: 1.3rem;
  background-color: #fff;
  z-index: 9;
}
.pic_list {
  width: 100%;
  height: 70px;
  position: relative;
  border-bottom: 1px solid red;
}
.pic_list > img {
  width: 3rem;
  height: 3rem;
  position: absolute;
  top: -47px;
  left: 10px;
  background-color: #fff;
  border: 2px solid #fff;
}
.pic_list > div {
  position: absolute;
  display: block;
  left: 135px;
  top: 10px;
}
.pic_list > .Repertory {
  top: 40px;
}
.Spec_select {
  padding: 15px 10px 10px 10px;
  border-bottom: 1px solid #ccc;
}
.Spec_select .Size_select {
  margin-top: 10px;
  overflow: hidden;
}
.Spec_select .Size_select > span {
  border: 1px solid #000;
  border-radius: 5px;
  float: left;
  height: 35px;
  text-align: center;
  line-height: 35px;
  margin-right: 15px;
  margin-bottom: 10px;
  padding: 0 10px 0 10px;
}
.Spec_select .Size {
  overflow: hidden;
}
.Spec_select .Size > .Spec_name {
  display: block;
  margin-top: 10px;
}
/* 数量加减 */
.Spec .Number {
  width: 100%;
  height: 50px;
  margin-top: 12px;
}
.Spec .Number > span {
  float: left;
  margin-left: 10px;
  margin-top: 10px;
}
.Spec .Number .Input {
  float: right;
  margin-right: 5px;
}
.Spec .Number .Input > input {
  width: 35px;
  height: 30px;
  background-color: #ccc;
  margin: 0 5px 0 5px;
  outline: none;
  text-align: center;
}
.Spec .Number .Input > span {
  width: 30px;
  height: 30px;
  display: inline-block;
  text-align: center;
  line-height: 30px;
  background-color: #ccc;
}
.spec_active {
  background-color: #fe7951;
  border-color: #fe7951 !important;
  color: #fff;
}
.noneActive {
  background-color: #ccc;
  border-color: #ccc !important;
  color: #fff;
  /* 阻止点击事件 */
  pointer-events: none;
}
.actived {
  color: #ed143d;
}
/* 评论 */
.review_ul {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 50px;
  line-height: 50px;
  border-top: 1px solid #ccc;
}
.review_ul > li {
  width: 25%;
  height: 50px;
  text-align: center;
}
.active_li {
  color: red;
}
.review_div {
  position: absolute;
  top: 55px;
  background-color: #fff;
  width: 100%;
  height: 500px;
}
</style>