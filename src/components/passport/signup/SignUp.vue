<style lang="stylus" scoped>
.form-table {
  & > li {
    position: relative;
    & > label {
      display: block;
      padding: .16rem 0 .16rem .3rem;
      height: .16rem;
      position: relative;
      &.short {
        margin-right: 1rem;
      }
      &:before {
        font-size: .16rem;
        color: #c7d1da;
        line-height: 1em;
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -.5em;
      }
      & > input {
        border: none;
        height: .16rem;
        width: 100%;
        line-height: .16rem;
        font-size: .14rem;
      }
    }
    & > span {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      line-height: .3rem;
      padding: 0 .1rem;
      font-size: .14rem;
      border-radius: .03rem;
      background-color: #2dbcff;
      color: #fff;
      z-index: 1;
      &.disabled {
        background-color: #f2f2f2;
        color: #ccc;
      }
    }
  }
}
.form-submit {
  & > a {
    border-radius: .03rem;
    margin-top: .2rem;
    display: block;
    line-height: .4rem;
    text-align: center;
    color: #666;
    border: solid 1px #f0f0f0;
    font-size: .14rem;
    &.important {
      background-color: #2dbcff;
      color: #fff;
      border: none;
    }
    &.disabled {
      background-color: #eee;
      color: #ccc;
      text-shadow: 1px 1px 0 rgba(255,255,255,.3);
      border: none;
    }
  }
}

</style>
<template>
  <div class="ui-card ui-card-padd ui-card-underline">
    <ul class="form-table">
      <li class="underline">
        <label class="iconfont i-cellphone-bfo">
          <input :placeholder="lang.typePhoneNumber" @keyup="syncTelphone($event)" :value="formated" type="text" maxlength="13">
        </label>
      </li>
      <li class="underline">
        <label class="iconfont i-verify-bfo short">
          <input v-model="verifycode" :placeholder="lang.typeVerifyCode" type="text" maxlength="4">
        </label>
        <span v-if="timeout === 0 && !msgSending" @click="sendMsgAction(telphone)">{{lang.getVerifyCode}}</span>
        <span v-if="timeout === 0 && msgSending" class="disabled">{{lang.verifyCodeSending}}</span>
        <span v-if="timeout > 0 && !msgSending" class="disabled">{{timeout}}{{lang.waitSendVerifyCodeAgain}}</span>
      </li>
    </ul>
    <div class="form-submit clearfix">
      <a v-if="codeVerifying" class="disabled">{{lang.codeVerifying}}</a>
      <a v-else @click="signUpAction(telphone, verifycode)" class="important">{{lang.nextStep}}</a>
      <router-link :to="{name: 'passport:signin', query: {url: url}}">{{lang.signIn}}</router-link>
    </div>
  </div>
</template>

<script>
import Helper from 'helper';
import {Http, translate} from 'methods';

const language = translate({
  'zh-cn': {
    typePhoneNumber: '请输入手机号',
    typeVerifyCode: '请输入验证码',
    getVerifyCode: '获取验证码',
    verifyCodeSending: '验证信息发送中…',
    waitSendVerifyCodeAgain: '秒后重新获取',
    signIn: '登录',
    nextStep: '立即注册',
    codeVerifying: '验证中…',
    noTypePhoneNumber: '嘿，要先输入手机号码！ ',
    phoneNumberError: '亲，手机号码写错了，改一改！ ',
    noTypeVerifyCode: '请输入短信验证码！ ',
    verifyCodeError: '验证码为四位数字',
    verifyCodeSendSuccess: '验证信息已经发送至该手机号码'
  },
  'zh-tw': {
    typePhoneNumber: '請輸入手機號',
    typeVerifyCode: '請輸入驗證碼',
    getVerifyCode: '獲取驗證碼',
    verifyCodeSending: '驗證信息發送中…',
    waitSendVerifyCodeAgain: '秒後重新獲取',
    signIn: '登錄',
    nextStep: '立即註冊',
    codeVerifying: '驗證中…',
    noTypePhoneNumber: '嘿，要先輸入手機號碼！ ',
    phoneNumberError: '親，手機號碼寫錯了，改一改！ ',
    noTypeVerifyCode: '請輸入短信驗證碼！ ',
    verifyCodeError: '驗證碼為四位數字',
    verifyCodeSendSuccess: '驗證信息已經發送至該手機號碼'
  }
});
const TWPhoneRegex = new RegExp('^09(\\d{8})$');
const isTWPhone = function(string) {
  return TWPhoneRegex.test(string);
};

export default {
  props: ['swipeTo', 'url'],
  data() {
    return {
      telphone: '',
      formated: '',
      verifycode: '',
      timeout: 0,
      timer: null,
      msgSending: false,
      codeVerifying: false,
      lang: language
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
    sendMsgAction(telphone) {
      if (this.msgSending) return;

      if (!telphone) return this.$message(language.noTypePhoneNumber);
      if (!Helper.is('cell', telphone) && !isTWPhone(telphone)) return this.$message(language.phoneNumberError);

      this.msgSending = true;

      Http.fetch('api/send_code', {
        mobile: telphone,
        type: 1
      }).then(response => {
        this.msgSending = false;

        Http.resolve(response).then(result => {
          this.$message(language.verifyCodeSendSuccess);
          this.timeout = 60;
          this.timer = window.setInterval(() => {
            this.timeout --;
            if (this.timeout === 0) window.clearInterval(this.timer);
          }, 1000);
        }).catch(error => {
          if (response.ok) this.$message(error);
          throw new Error(error);
        });
      });
    },
    signUpAction(telphone, verifycode) {
      if (this.codeVerifying) return;

      if (!telphone) return this.$message(language.noTypePhoneNumber);
      if (!Helper.is('cell', telphone) && !isTWPhone(telphone)) return this.$message(language.phoneNumberError);
      if (!verifycode) return this.$message(language.noTypeVerifyCode);
      if (!Helper.is('integer', verifycode) || verifycode.length !== 4) return this.$message(language.verifyCodeError);

      this.codeVerifying = true;

      Http.fetch('api/check_code', {
        mobile: telphone,
        code: verifycode,
        type: 0
      }).then(response => {
        this.codeVerifying = false;

        Http.resolve(response).then(result => {
          this.swipeTo(2);
        }).catch(error => {
          if (response.ok) this.$message(error);
          throw new Error(error);
        });
      });
    }
  }
};
</script>
