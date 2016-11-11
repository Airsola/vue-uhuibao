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
              <label class="iconfont i-verify-bfo short">
                <input v-model="verifycode" :placeholder="lang.typeVerifyCode" type="text" maxlength="4">
              </label>
              <span :class="[!telphone || !isTelphone(telphone) || msgSending || timeout > 0 ? 'disabled' : '']" @click="sendMsgAction(telphone)">{{msgSending ? lang.verifyCodeSending : (timeout > 0 ? timeout + lang.waitSendVerifyCodeAgain : lang.getVerifyCode)}}</span>
            </li>
          </ul>
          <div class="form-submit clearfix">
            <span>
              <a @click="swipeTo(0)">{{lang.signIn}}</a>
            </span>
            <span>
              <a :class="[!telphone || !isTelphone(telphone) || !verifycode || verifycode.length !== 4 || codeVerifying ? 'disabled' : 'important']" @click="submitAction(telphone, verifycode)">{{codeVerifying ? lang.codeVerifying : lang.nextStep}}</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {Http, translate} from 'methods';
import Helper from 'helper';

const language = translate({
  'zh-cn': {
    title: '找回游惠宝账号',
    typePhoneNumber: '请输入手机号',
    typeVerifyCode: '请输入验证码',
    getVerifyCode: '获取验证码',
    verifyCodeSending: '验证信息发送中…',
    waitSendVerifyCodeAgain: '秒后重新获取',
    signIn: '登录',
    nextStep: '下一步',
    codeVerifying: '验证中…',
    noTypePhoneNumber: '嘿，要先输入手机号码！',
    phoneNumberError: '亲，手机号码写错了，改一改！',
    noTypeVerifyCode: '请输入短信验证码！',
    verifyCodeError: '验证码为四位数字',
    verifyCodeSendSuccess: '验证信息已经发送至该手机号码'
  },
  'zh-tw': {
    title: '找回游惠寶賬號',
    typePhoneNumber: '請輸入手機號',
    typeVerifyCode: '請輸入驗證碼',
    getVerifyCode: '獲取驗證碼',
    verifyCodeSending: '驗證信息發送中…',
    waitSendVerifyCodeAgain: '秒後重新獲取',
    signIn: '登錄',
    nextStep: '下一步',
    codeVerifying: '驗證中…',
    noTypePhoneNumber: '嘿，要先輸入手機號碼！',
    phoneNumberError: '親，手機號碼寫錯了，改一改！',
    noTypeVerifyCode: '請輸入短信驗證碼！',
    verifyCodeError: '驗證碼為四位數字',
    verifyCodeSendSuccess: '驗證信息已經發送至該手機號碼'
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
      verifycode: '',
      timeout: 0,
      timer: null,
      msgSending: false,
      codeVerifying: false
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
    sendMsgAction(telphone) {
      if (this.msgSending || this.timeout > 0) return;

      if (!telphone) return this.$message(language.noTypePhoneNumber);
      if (!this.isTelphone(telphone)) return this.$message(language.phoneNumberError);

      this.msgSending = true;

      Http.fetch('api/send_code', {
        mobile: telphone,
        type: 2
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
    submitAction(telphone, verifycode) {
      if (this.codeVerifying) return;

      if (!telphone) return this.$message(language.noTypePhoneNumber);
      if (!this.isTelphone(telphone)) return this.$message(language.phoneNumberError);
      if (!verifycode) return this.$message(language.noTypeVerifyCode);
      if (!Helper.is('integer', verifycode) || verifycode.length !== 4) return this.$message(language.verifyCodeError);

      this.codeVerifying = true;

      Http.fetch('api/check_code', {
        mobile: telphone,
        code: verifycode,
        type: 3
      }).then(response => {
        this.codeVerifying = false;

        Http.resolve(response).then(result => {
          this.swipeTo(4);
        }).catch(error => {
          if (response.ok) this.$message(error);
          throw new Error(error);
        });
      });
    }
  },
  beforeDestroy() {
    window.clearInterval(this.timer);
  }
};
</script>
