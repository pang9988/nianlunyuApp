<template>
  <div class="reset">
    <mt-field placeholder="请输入常用手机号" class="float-left" v-model="phone">
      <input type="button" @click="createCode" class="verification" v-model="checkCode" />
    </mt-field>
    <mt-field placeholder="请输入验证码" label="验证码" class="float-left" v-model="code"></mt-field>
    <mt-field type="password" label="新密码" placeholder="8~16位,数字、字母、字符包含两种" v-model="password"></mt-field>
    <div class="button">
      <mt-button class="sign" @click="sign">确定</mt-button>
      <p @click="$router.push('/Login')" class="login_jump">返回登录</p>
    </div>
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
  methods: {
    createCode() {
      var phone = this.phone;
      var reg = /^1[3-9]\d{9}$/;
      if (!phone) {
        this.$toast("请输入合法手机号");
        return;
      } else if (reg.test(phone) == false) {
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
    //  重置密码
    sign() {
      if (!this.phone) {
        this.$toast("手机号不能为空");
        return;
      }
      if (!this.code) {
        this.$toast("验证码格式不正确");
        return;
      }
      if (!this.password) {
        this.$toast("密码不能为空");
        return;
      } else {
        this.axios
          .post("/user/loseP", { phone: this.phone, upwd: this.password })
          .then(result => {
            console.log(result.data);
            if (result.data.code == 200) {
              this.$toast("修改成功");
            } else {
              this.$toast("修改失败");
            }
          });
      }
    }
  }
};
</script>
<style>
.reset .verification {
  background: none;
  outline: none;
}
.button {
  margin-top: 20px;
}
.reset .sign {
  width: 100%;
  background: #ff4001 !important;
  color: #fff;
  font-size: 15px;
}
.login_jump {
  font-size: 0.4rem;
  color: #666;
  margin-top: 20px;
  margin-left: 10px;
}
</style>


