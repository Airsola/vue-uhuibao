<style lang="stylus" scoped>
.popup-animate {
  position: absolute;
  width: 85%;
  top: 50%;
  left: 50%;
  background-color: #fff;
  box-shadow: 0 .01rem .03rem rgba(0,0,0,.2);
  z-index: 2;
  border-radius: .03rem;
  transition: all .5s cubic-bezier(.55,0,.1,1);
  transform: translate(-50%, -50%);
  & > a {
    width: .28rem;
    height: .28rem;
    line-height: .28rem;
    text-align: center;
    display: block;
    position: absolute;
    z-index: 1;
    top: -.14rem;
    right: -.14rem;
    border-radius: 50%;
    background-color: #fff;
    &:before {
      color: #999;
    }
  }
}
.slide-up-enter {
  opacity: 0;
  transform: translate(-50%, -45%);
}
.slide-up-leave-active {
  opacity: 0;
  transform: translate(-50%, -45%);
}
.from-wrap {
  padding: .2rem;
}
.form-title {
  font-size: .16rem;
  text-align: center;
  padding-bottom: .1rem;
}
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
  padding-top: .2rem;
  & > span {
    float: left;
    width: 50%;
    &:nth-of-type(1) {
      & > a {
        margin-right: .1rem;
      }
    }
    &:nth-of-type(2) {
      & > a {
        margin-left: .1rem;
      }
    }
  }
  a {
    border-radius: .03rem;
    text-align: center;
    line-height: .4rem;
    font-size: .14rem;
    display: block;
    color: #666;
    border: solid 1px #f2f2f2;
    transition: background-color .2s ease,border-color .2s ease,color .2s ease;
    &.disabled {
      background-color: #f2f2f2;
      border-color: #f2f2f2;
      color: #ccc;
    }
    &.important {
      background-color: #5fb8f1;
      border-color: #5fb8f1;
      color: #fff;
    }
  }
}

</style>

<template>
  <transition name="slide-up">
    <div class="popup-animate">
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
              <span v-if="msgSending">{{lang.verifyCodeSending}}</span>
              <span v-else ></span>
              <span v-if="timeout === 0 && !msgSending" @click="sendMsgAction">{{lang.getVerifyCode}}</span>
              <span v-if="timeout === 0 && msgSending" class="disabled">{{lang.verifyCodeSending}}</span>
              <span v-if="timeout > 0 && !msgSending" class="disabled">{{timeout}}{{lang.waitSendVerifyCodeAgain}}</span>
            </li>
          </ul>
          <div class="form-submit clearfix">
            <span>
              <a @click="swipeTo(0)">{{lang.signIn}}</a>
            </span>
            <span>
              <a v-if="codeVerifying" class="disabled">{{lang.codeVerifying}}</a>
              <a v-else class="important" @click="signUpAction">{{lang.nextStep}}</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {Http, LANG_TYPE} from 'config';
import Helper from 'helper';

const Language = {
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
};
const language = Language[LANG_TYPE];
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
    sendMsgAction() {
      if (this.msgSending) return;

      if (!this.telphone) return this.$message(language.noTypePhoneNumber);
      if (!Helper.is('cell', this.telphone) && !isTWPhone(this.telphone)) return this.$message(language.phoneNumberError);

      this.msgSending = true;

      Http.fetch('api/send_code', {
        mobile: this.telphone,
        type: 2
      }).then(response => {
        this.msgSending = false;

        Http.resolve(response, (error, result) => {
          if (error) {
            throw result;
          } else {
            if (result.status === 1) {
              this.$message(language.verifyCodeSendSuccess);
              this.timeout = 60;
              this.timer = window.setInterval(() => {
                this.timeout --;
                if (this.timeout === 0) window.clearInterval(this.timer);
              }, 1000);
            } else {
              this.$message(result.msg);
              throw result.msg;
            };
          };
        });
      });
    },
    signUpAction() {
      if (this.codeVerifying) return;

      if (!this.telphone) return this.$message(language.noTypePhoneNumber);
      if (!Helper.is('cell', this.telphone) && !isTWPhone(this.telphone)) return this.$message(language.phoneNumberError);
      if (!this.verifycode) return this.$message(language.noTypeVerifyCode);
      if (!Helper.is('integer', this.verifycode) || this.verifycode.length !== 4) return this.$message(language.verifyCodeError);

      this.codeVerifying = true;

      Http.fetch('api/check_code', {
        mobile: this.telphone,
        code: this.verifycode,
        type: 3
      }).then(response => {
        this.codeVerifying = false;

        Http.resolve(response, (error, result) => {
          if (error) {
            throw result;
          } else {
            if (result.status === 1) {
              this.swipeTo(4);
            } else {
              this.$message(result.msg);
              throw result.msg;
            };
          };
        });
      });
    }
  },
  beforeDestroy() {
    window.clearInterval(this.timer);
  }
};
</script>
