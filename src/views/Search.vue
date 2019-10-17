<template>
  <div>
    <div class="mt">
      <div class="fl">
        <i class="iconfont" @click="$router.go(-1)">&#xe732;</i>
      </div>
      <div>
        <p class="search_title">搜索</p>
      </div>
    </div>
    <div class="search">
      <input type="text" id="keyword" v-model="kw" @focus="search_show" />
      <i class="iconfont">&#xe65f;</i>
      <button @click="search">搜索</button>
    </div>
    <div class="hot_search" v-show="show">
      <div class="h_title">热门搜索</div>
      <div class="h_content">
        <ul class="key_word">
          <li v-for="(item,i) of list" :key="i" v-text="item.pname" @click="find(item.pname)"></li>
        </ul>
      </div>
      <div class="history">
        <div class="h_title">
          搜索历史
          <i class="iconfont" v-if="history!=''" @click="clear_history">&#xe618;</i>
        </div>
        <ul class="key_word">
          <li v-for="(item,i) of history" :key="i" v-text="item.pname" @click="find(item.pname)"></li>
        </ul>
      </div>
    </div>
    <div class="prolist" v-show="product_show">
      <div class="pro-item" v-for="(item,i) of search_list" :key="i">
        <router-link :to="`/Details/${item.pid}`">
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
      list: [],
      kw: "",
      show: true,
      product_show: false,
      search_list: [],
      history: []
    };
  },
  created() {
    this.axios.get("/product/search").then(result => {
      // console.log(result.data);
      this.list = result.data;
      // console.log(this.list);
    });
    this.load();
  },
  methods: {
    load() {
    if(this.$store.getters.getIslogin){      
      this.axios.get("/user/history").then(result => {
        // 该用户的历史搜索记录
        this.history = result.data;
        // console.log(this.history);
        this.history = this.deteleObject(this.history, "pname");
      });
    }
    },
    // 去除数组里重复的有重复名称的对象
    deteleObject(arr, name) {
      var hash = {};
      return arr.reduce(function(item, next) {
        hash[next[name]] ? "" : (hash[next[name]] = true && item.push(next));
        return item;
      }, []);
    },
    // 用find函数封装发送的请求,param为传入的参数值
    find(param) {
      this.show = false; //控制显示搜索
      this.product_show = true; //控制显示商品信息
      this.kw = param;
      var uid = sessionStorage.getItem("uid");
      this.axios
        .get("/product/keyword", { params: { pname: param } })
        .then(result => {
          // console.log(result.data);
          this.search_list = result.data;
          // console.log(this.search_list);
        });
    },
    // 搜索关键词
    search() {
      // 搜索栏输入的值
      if (this.kw) {
        this.find(this.kw);
      }
    },
    // 获得焦点就显示搜索框
    search_show() {
      this.show = true;
      this.product_show = false;
      this.load();
      this.search_list = [];
    },
    // 点击删除,清空历史搜索记录
    clear_history() {
      var uid = sessionStorage.getItem("uid");
      this.axios.get("/user/clearhis").then(result => {
        //删除后,刷新历史搜索记录
        this.load();
      });
    }
  }
};
</script>

<style scoped>
.mt {
  margin: 10px 0;
  overflow: hidden;
}
.fl {
  float: left;
}
.fl .iconfont {
  font-weight: bolder;
  font-size: 25px;
  margin-left: 6px;
}
.search_title {
  font-size: 18px;
  text-align: center;
  margin-top: 5px;
}
.search input {
  border: 1px solid #ddd;
  width: 80%;
  height: 33px;
  position: relative;
  margin-left: 15px;
  outline: none;
  font-size: 16px;
  text-indent: 26px;
}
/* 搜索框 */
.search {
  position: relative;
}
.search button {
  width: 15%;
  height: 33px;
  border: 0;
  background: transparent;
  outline: none;
  position: absolute;
  top: 2px;
  font-size: 14px;
  font-weight: lighter;
}
.search .iconfont {
  position: absolute;
  left: 15px;
  top: 35%;
  margin-left: 5px;
}
/* 热门搜索 */
.h_title {
  font-size: 17px;
  margin: 15px 0 15px 15px;
}
.key_word {
  overflow: hidden;
  margin-left: 15px;
}
.key_word li {
  float: left;
  background: #ddd;
  margin-right: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 13px;
  margin-bottom: 10px;
  padding: 5px;
}
/* 商品 */
.prolist {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 7px;
}
.prolist .pro-item {
  width: 49.5%;
  background: rgba(239, 239, 239, 0.9);
  margin-bottom: 0.12rem;
}
.prolist .pro-item img {
  width: 4.95rem;
  height: 4.95rem;
}
.repertory {
  width: 100%;
  font-size: 0.43rem;
  padding: 0.1rem 0;
  background: #ccc;
  color: #fff;
  margin-top: -0.13rem;
  text-indent: 0.2rem;
}
.pro-item .pName {
  font-size: 0.43rem;
  text-indent: 0.3rem;
  line-height: 0.66rem;
}
.pro-item span.price {
  display: inline-block;
  font-size: 0.4rem;
  font-weight: 600;
  text-indent: 0.12rem;
  color: #ed143d;
}
.pro-item span.volume {
  float: right;
  margin-right: 0.2rem;
  font-size: 0.38rem;
  color: #000;
  opacity: 0.5;
}
.history .h_title i {
  position: absolute;
  right: 30px;
  bottom: 56%;
  font-size: 17px;
  font-weight: lighter;
  color: #9c9c9c;
}
</style>

