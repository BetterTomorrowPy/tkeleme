<template>
  <div class="loginContainer">
    <head-top v-bind:head-title="loginWay ? '登录':'密码登录'" goBack="true">
      <div slot="changeLogin" class="change_login" @click="changeLoginWay">
        {{loginWay ? "密码登录" : "短信登录"}}
      </div>
    </head-top>

    <form class="loginForm" v-if="loginWay">
      <section class="input_container phone_number">
        <input type="text" placeholder="手机号码" name="phone"
               maxlength="11" v-model="phoneNumber">
        <button @click.prevent="getVerifyCode"
                :class="{right_phone_number:rightPhoneNumber}" v-show="!computedTime">获取验证码
        </button>
        <button @click.prevent v-show="computedTime">已发送({{computedTime}}s)</button>
      </section>
      <section class="input-container">
        <input type="text" placeholder="验证码" name="mobileCode"
               maxlength="6" v-model="mobileCode">
      </section>
    </form>

    <form class="loginForm" v-else>
      <section class="input_container">
        <input type="text" placeholder="手机号/邮箱/用户名"
               v-model.lazy="userAccount">
      </section>
      <section class="input-container">
        <input v-if="!showPassword" type="password" placeholder="密码" v-model="passWord">
        <input v-else type="text" placeholder="密码" v-model="passWord">
        <div class="button_switch" :class="{change_to_text: showPassword}">
          <div class="circel_button"
               :class="{trans_to_right: showPassword}" @click="changePassWordType"></div>
          <span>abc</span>
          <span>...</span>
        </div>
      </section>
      <section class="input_container captcha_code_container">
        <input type="text" placeholder="验证码" maxlength="6" v-model="codeNumber">
        <div class="img_change_img">
          <img :src="captchaCodeImg" v-show="captchaCodeImg">
          <div class="change_img" @click="getCaptchaCode">
            <p>看不清</p>
            <p>换一张</p>
          </div>
        </div>
      </section>
    </form>

    <p class="login_tips">
      温馨提示：未注册饿了么账号的手机号，登录时将自动注册，且代表您已同意
      <a href="https://h5.ele.me/service/agreement/">《用户服务协议》</a>
    </p>

    <div class="login_container" @click="mobileLogin">登录</div>
    <router-link to="/forget" class="to_forget" v-if="!loginWay">忘记密码?</router-link>
    <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
  </div>
</template>

<script>
  import headTop from './header'
  import alertTip from './register'
  import {mapState, maxMutations} from 'vuex'
  import {
    mobileCode, checkExsis, sendLogin, getcaptchas, accountLogin
  } from
    '../services/getData'

  export default {
    data() {
      return {
        loginWay: true, //登录方式，默认短信登录
        showPassword: false, // 是否显示密码
        phoneNumber: '12345678900', //电话号码
        mobileCode: '123456', //短信验证码
        validate_token: null, //获取短信时返回的验证值，登录时需要
        computedTime: 0, //倒数记时
        userInfo: null, //获取到的用户信息
        userAccount: null, //用户名
        passWord: null, //密码
        captchaCodeImg: null, //验证码地址
        codeNumber: null, //验证码
        showAlert: false, //显示提示组件
        alertText: null, //提示的内容
      }
    },
    created: function () {
      this.getCaptchaCode();
    },
    components: {
      headTop,
      alertTip
    },
    computed: {
      // Check phone.
      rightPhoneNumber: function (phoneNumber = this.phoneNumber) {
        return /^1\d{10}$/gi.test(phoneNumber)
      }
    },
    methods: {
      ...maxMutations(['RECORD_USERINFO',]),
      changeLoginWay: function () {
        this.loginWay = !this.loginWay;
      },
      changePasswordType: function () {
        this.showPassword = !this.showPassword
      },
      getCaptchaCode: async function () {
        let res;
        try {
          res = await getcaptchas();
          this.captchaCodeImg = 'https://mainsite-restapi.ele.me/v1/captchas/' + res.code;
        }
//        catch (error) {
//
//        }
        if (!res) {
          this.captchaCodeImg = 'http://test.fe.ptdev.cn/elm/yzm.jpg'
        }
      },
      getVerifyCode: async function () {
        // 获取验证码
        if (this.rightPhoneNumber) {
          this.computedTime = 30;
          this.timer = setInterval(() => {
            this.computedTime--;
            if (0 == this.computedTime) {
              clearInterval(this.timer)
            }
          }, 1000)

          let exsits = await checkExsis();
          if (exsits.message) {
            this.showAlert = true;
            this.alertText = exsits.message;
            return
          } else if (!exsits.is_exists) {
            this.showAlert = true;
            this.alertText = '您输入的手机号尚未绑定';
            return
          }

          let res = await mobileCode(this.phoneNumber);
          if (res.message) {
            this.showAlert = true;
            this.alertText = res.message;
            return
          }
          this.validate_token = res.validate_token;
        }
      },
      mobileLogin: async function () {
        if (this.loginWay) {
          if (!this.rightPhoneNumber) {
            this.showAlert = true;
            this.alertText = '手机号码不正确';
            return
          } else if (!(/^\d{6}$/gi.test(this.mobileCode))) {
            this.showAlert = true;
            this.alertText = '短信验证码不正确';
            return
          }

          this.userInfo = await sendLogin(this.mobileCode, this.phoneNumber, this.validate_token);
        } else {
          if (!this.userAccount) {
            this.showAlert = true;
            this.alertText = '请输入手机号/邮箱/用户名';
            return
          } else if (!this.passWord) {
            this.showAlert = true;
            this.alertText = '请输入密码';
            return
          } else if (!this.codeNumber) {
            this.showAlert = true;
            this.alertText = '请输入验证码';
            return
          }
          //用户名登录
          this.userInfo = await accountLogin(this.userAccount, this.passWord, this.codeNumber);
        }
        if (!this.userInfo.user_id) {
          this.showAlert = true;
          this.alertText = this.userInfo.message;
          if (!this.loginWay) {
            this.getCaptchaCode();
          }
        } else {
          this.RECORD_USERINFO(this.userInfo);
          this.$router.go(-1);
        }
      },
      closeTip: function () {
        this.showAlert = false;
      }
    }
  }
</script>
