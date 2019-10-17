<template>
  <div class="page-navbar">
    <p class="return_text" @click="$router.push('/Index')">
      <i class="iconfont return">&#xe732;</i>
    </p>
    <mt-navbar class="page-part" v-model="selected">
      <mt-tab-item id="1">注册</mt-tab-item>
      <mt-tab-item id="2">登录</mt-tab-item>
    </mt-navbar>
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="1">
        <mt-field placeholder="请输入常用手机号" class="float-left" v-model="phone">
          <input type="button" @click="createCode" class="verification" v-model="checkCode" />
        </mt-field>
        <mt-field placeholder="请输入验证码" label="验证码" class="float-left" v-model="code"></mt-field>
        <mt-field type="password" label="密码" placeholder="8~16位,数字、字母、字符包含两种" v-model="password"></mt-field>
        <mt-button @click="resign">注册</mt-button>
      </mt-tab-container-item>
      <mt-tab-container-item id="2">
        <mt-field placeholder="你的手机号" label="账号" v-model="phone"></mt-field>
        <mt-field type="password" placeholder="请输入密码" label="密码" v-model="password"></mt-field>
        <mt-button @click="login">登录</mt-button>
        <div class="loseP">
          <p @click="$router.push('/ResetPwd')">忘记密码?</p>
        </div>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selected: "2",
      phone: "",
      checkCode: "获取验证码",
      code: "",
      password: ""
    };
  },
  created() {
    // 不需要公共的头部和尾部
    this.$emit("show_footer", false);
  },
  methods: {
    resign() {
      var phone = this.phone;
      var code = this.code;
      var password = this.password;
      var reg1 = /^1[3-9]\d{9}$/;
      var reg2 = /^(?![0-9]+$)(?![a-zA-Z]+$)(?![\W_]+$)[0-9A-Za-z\W_]{8,16}$/;
      if (!phone) {
        this.$toast("手机号不能为空");
        return;
      } else if (reg1.test(phone) == false) {
        this.$toast("手机号格式不正确");
        return;
      }
      if (!code) {
        this.$toast("验证码格式不正确");
        return;
      }
      if (!password) {
        this.$toast("密码不能为空");
        return;
      }
      if (reg2.test(password) == false) {
        this.$toast("8~16位,数字、字母、字符至少包含两种");
        return;
      } else {
        this.axios
          .post("/user/reg", { phone: this.phone, upwd: this.password })
          .then(result => {
            // console.log(result.data);
            // 失败弹出提示消息
            if (result.data.code == 400) {
              this.$toast(result.data.msg);
            }
            // 成功弹出消息点击确定跳至首页
            if (result.data.code == 200) {
              this.$messagebox
                .confirm("是否直接登录到首页")
                .then(action => {
                  // 确定--跳首页
                  this.$store.commit("setIslogin", true);
                  this.$router.push("/Index");
                })
                .catch(err => {
                  if (err == "cancel") {
                    setTimeout(() => {
                      this.selected = "2";
                      this.password = "";
                    }, 3000);
                  }
                });
            }
          });
      }
    },
    createCode() {
      var phone = this.phone;
      var reg = /^1[3-9]\d{9}$/;
      if (!phone) {
        this.$toast("请输入合法手机号");
        return;
      }
      if (reg.test(phone) == false) {
        this.$toast("手机号格式不正确");
        return;
      }
      if (reg.test(phone) == true) {
        this.code = "";
        this.checkCode = "获取验证码";
        //验证码的长度
        var codeLength = 4;
        //随机数
        var random = new Array(
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "O",
          "P",
          "Q",
          "R",
          "S",
          "T",
          "U",
          "V",
          "W",
          "X",
          "Y",
          "Z"
        );
        for (var i = 0; i < codeLength; i++) {
          //取得随机数的索引（0~35）
          var index = Math.floor(Math.random() * 36);
          //根据索引取得随机数加到code上
          this.code += random[index];
        }
        //把code值赋给验证码
        this.checkCode = this.code;
      }
    },
    // 登录
    login() {
      var phone = this.phone;
      var password = this.password;
      var reg1 = /^1[3-9]\d{9}$/;
      var reg2 = /^(?![0-9]+$)(?![a-zA-Z]+$)(?![\W_]+$)[0-9A-Za-z\W_]{8,16}$/;
      if (!phone) {
        this.$toast("手机号不能为空");
        return;
      } else if (reg1.test(phone) == false) {
        this.$toast("手机号格式不正确");
        return;
      }
      if (!password) {
        this.$toast("密码不能为空");
        return;
      }
      if (reg2.test(password) == false) {
        this.$toast("8~16位,数字、字母、字符至少包含两种");
        return;
      } else {
        this.axios
          .post("/user/login", { phone: this.phone, upwd: this.password })
          .then(result => {
            // console.log(result.data);
            if (result.data.code == 200) {
              // 跳转主页
              this.$store.commit("setIslogin", true);
              this.$router.push("/Index");
            } else {
              this.$toast(result.data.msg);
            }
          });
      }
    }
  },
  // 选中×清空验证码信息
  watch: {
    phone() {
      if (this.phone == "") {
        this.checkCode = "获取验证码";
        this.code = "";
      }
    },
    selected() {
      this.phone = "";
      this.checkCode = "获取验证码";
      this.code = "";
      this.password = "";
    }
  }
};
</script>
<style>
.page-navbar {
  margin-top: 20px;
}
.page-navbar .mint-tab-item-label {
  font-size: 16px !important;
}
.mint-field-other {
  color: #fb7299;
  border-left: 1px solid #e7e7e7;
  text-align: center;
}
.mint-cell-text {
  color: #212121;
}
.mint-field-core {
  font-size: 15px !important;
}
.mint-button--normal {
  width: 100%;
  background: #ff4001 !important;
  color: #fff !important;
}
.verification {
  background: none;
  outline: none;
}
.clear {
  position: absolute;
  left: 0;
  top: 50%;
}
.iconfont.return {
  font-size: 25px;
  margin-left: 20px;
  margin-top: 20px;
  vertical-align: bottom;
}
.return_text span {
  font-size: 18px;
  vertical-align: middle;
}
/* 忘记密码 */
.loseP p {
  font-size: 0.4rem;
  color: #666;
  margin-top: 20px;
  margin-left: 10px;
}
</style>