<template>
  <div>
    <!-- 点击搜索框后要跳到一个新的组件页面 -->
    <div class="my_search">
      <span class="iconfont sousuo" @click="$router.push('/Search')">&#xe65f;&nbsp;搜索</span>
      <div style="background:#ddd;height:1px;width:100%;margin:12px 0"></div>
    </div>
    <!-- <h1>dsadsa</h1> -->
    <!-- 左侧边栏 -->
    <!-- <div></div> -->
    <div class="let-tabbar">
      <div class="left-panel">
        <!-- <cube-scroll type="scroll-tab-view" title="ScrollTab"> -->
        <cube-tab-bar
          class="mycube_tab_bar"
          v-model="selectedLabel"
          :data="Object.keys(left_list).map(label => ({label}))"
          @change="changeHandler"
        ></cube-tab-bar>
        <!-- </cube-scroll> -->
      </div>
    </div>
    <!-- 右边 -->
    <div class="right-panel">
      <!-- <cube-scroll ref="scroll"> -->
      <ul v-if="!noClassify">
        <li v-for="(elem,i) of right_list" :key="i">
          <router-link :to="`/ProductList/${elem.cid}`" v-if="elem.series!='NULL'">
            <img :src="`http://127.0.0.1:5050/${elem.pic}`" />
            <span v-text="elem.series"></span>
          </router-link>
        </li>
      </ul>
      <img
        v-if="noClassify"
        style="width:100%;"
        src="images/product/9949ccc6037a03283d42fbbcf505c33_03.png"
        alt
      />
      <!-- </cube-scroll> -->
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: "",
      // 默认数据(搜索的关键字)
      defaultResult: ["蛋糕", "123", "1", "124567"],
      left_list: {},
      right_list: [],
      selectedLabel: "",
      // 没有该分类时
      noClassify: false
    };
  },
  created() {
    // 请求数据
    this.axios.get("/product/classify").then(result => {
      // console.log(result.data);
      var data = result.data.data;
      // 请求回来的数据格式不是我想要的数据格式要转成:
      // left_list: {蛋糕:[{name:"蛋糕",pic:"images/1.jspg"},...],...,...,}
      var obj_list = {};
      var obj_name = [];
      for (var i = 0; i < data.length; i++) {
        // 如果这个对象名里没有东西就强行赋值为一个空数组
        if (obj_list[data[i].cname] == undefined) {
          obj_list[data[i].cname] = [];
        }
        // 拿到对象的属性名
        obj_name = Object.keys(obj_list);
        // 如果对象的属性名和数据里的分类名称一样就放进该对象里的数组里
        for (var name of obj_name) {
          if (name == data[i].cname) {
            obj_list[name].push(data[i]);
          }
        }
      }
      this.left_list = obj_list;
      // console.log(this.left_list)
      // 加载第一个区域
      this.selectedLabel = Object.keys(this.left_list)[0];
      this.right_list = this.left_list[this.selectedLabel];
    });
  },
  methods: {
    changeHandler(label) {
      // 点击左边后换到别的区域
      this.right_list = this.left_list[label];
      if (this.right_list[0].series == "NULL") {
        this.noClassify = true;
      } else {
        this.noClassify = false;
      }
    }
  },
  computed: {},
  watch: {}
};
</script>
<style lang="stylus" rel="stylesheet/stylus">
/* 搜索框的文字样式 */
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
  text-align: center;
}

/* 左侧导航 */
.let-tabbar {
  position: absolute;
  left: 0;
  top: 70px;
  width: 100px;
  background-color: #f9f9f9;

  .mycube_tab_bar {
    display: inline-block;
    width: 100%;

    .cube-tab {
      width: 100%;
      text-align: center;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      color: #555;

      &.cube-tab_active {
        background-color: #fff;
        color: #fe9170;

        &::after {
          content: '';
          display: block;
          border: 1px solid #fe9170;
        }
      }
    }
  }
}

.right-panel {
  position: absolute;
  top: 52px;
  left: 100px;
  right: 0;
  top: 70px;
  background-color: #f9f9f9;

  ul {
    position: absolute;
    background-color: #fff;
    top: 0;
    left: 0;
  }

  li {
    float: left;
    margin-left: 19px;
    height: 100px;
    align-items: center;
    text-align: center;
    background-color: #fff;
    width: 24%;
    margin-bottom: 30px;
    // 单行文本超出部分隐藏
    white-space: nowrap;
    // text-overflow: ellipsis;
    // overflow: hidden;
    word-break: break-all;

    img {
      display: block;
      width: 100%;
    }

    span {
      font-size: 12px;
      color: #555;
    }
  }
}
</style>


