<template>
  <transition name="slide-up">
    <div class="form-animate">
      <a class="iconfont i-close-bfo" @click="close(true)"></a>
      <div class="from-wrap">
        <div class="form-box">
          <h5 class="form-title">{{lang.title}}</h5>
          <ul class="form-table">
            <li class="underline">
              <label class="iconfont i-cellphone-bfo">
                <input :placeholder="lang.typePhoneNumber" @keyup="syncTelphone($event)" :value="formated" type="text" maxlength="13">
              </label>
            </li>
            <li class="underline">
              <label class="iconfont i-password-bfo">
                <input :placeholder="lang.typePassword" v-model="password" type="password" maxlength="16">
              </label>
            </li>
          </ul>
          <div class="from-link">
            <span @click="swipeTo(3)">{{lang.forgotPassword}}</span>
          </div>
          <div class="form-submit clearfix">
            <span>
              <a :class="[!telphone || !isTelphone(telphone) || !password || password.length < 6 || password.length > 16 || submiting ? 'disabled' : 'important']" @click="submitAction(telphone, password)">{{submiting ? lang.signIng : lang.signIn}}</a>
            </span>
            <span>
              <a @click="swipeTo(1)">{{lang.signUp}}</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {USER_AUTH} from 'config';
import {Http, translate} from 'methods';
import Helper from 'helper';

const language = translate({
  'zh-cn': {
    title: '游惠宝账号登录',
    typePhoneNumber: '请输入手机号',
    typePassword: '请输入密码',
    forgotPassword: '忘记登录密码',
    signIn: '登录',
    signIng: '登录中…',
    signUp: '注册',
    noTypePhoneNumber: '嘿，要先输入手机号码！',
    phoneNumberError: '亲，手机号码写错了，改一改！',
    noTypePassword: '嘿，你还没有输入密码！',
    passwordLengthError: '密码的长度为6-16位字符！',
    signInEorror: '您输入的账号或密码不正确！'
  },
  'zh-tw': {
    title: '遊惠寶賬號登錄',
    typePhoneNumber: '請輸入手機號',
    typePassword: '請輸入密碼',
    forgotPassword: '忘記登錄密碼',
    signIn: '登錄',
    signIng: '登錄中…',
    signUp: '註冊',
    noTypePhoneNumber: '嘿，要先輸入手機號碼！',
    phoneNumberError: '親，手機號碼寫錯了，改一改！',
    noTypePassword: '嘿，你還沒有輸入密碼！',
    passwordLengthError: '密碼的長度為6-16位字元！',
    signInEorror: '您輸入的賬號或密碼不正確！'
  }
});
const TWPhoneRegex = new RegExp('^09(\\d{8})$');
const isTWPhone = function(string) {
  return TWPhoneRegex.test(string);
};

export default {
  props: ['swipeTo', 'close'],
  data() {
    return {
      lang: language,
      telphone: '',
      formated: '',
      password: '',
      submiting: false
    };
  },
  watch: {
    telphone(newVal) {
      this.formated = Helper.formatStr(newVal, newVal.slice(0, 2) === '09' ? 'xx;xxxx;xxxx' : 'xxx;xxxx;xxxx');
    }
  },
  methods: {
    syncTelphone(evt) {
      this.telphone = evt.target.value.replace(/ /g, '');
    },
    isTelphone: (telphone) => Helper.is('cell', telphone) || isTWPhone(telphone),
    submitAction(telphone, password) {
      if (this.submiting) return;

      if (!telphone) return this.$message(language.noTypePhoneNumber);
      if (!this.isTelphone(telphone)) return this.$message(language.phoneNumberError);
      if (!password) return this.$message(language.noTypePassword);
      if (password.length < 6 || password.length > 16) return this.$message(language.passwordLengthError);

      this.submiting = true;

      Http.fetch('api/check_login', {
        mobile: telphone,
        password: password
      }).then(response => {
        this.submiting = false;

        Http.resolve(response).then(result => {
          USER_AUTH.user_auth = true;
          this.close(false);
        }).catch(error => {
          if (response.ok) this.$message(language.signInEorror);
          throw new Error(error);
        });
      });
    }
  }
};
</script>
