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
    }
  }
}
.from-link {
  font-size: .14rem;
  color: #ffaa18;
  padding-top: .2rem;
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
              <a v-if="submiting" class="disabled">{{lang.signIng}}</a>
              <a v-else @click="loginAction(telphone, password)" class="important">{{lang.signIn}}</a>
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
import {Http, LANG_TYPE, USER_AUTH} from 'config';
import Helper from 'helper';

const Language = {
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
    loginAction(telphone, password) {
      if (this.submiting) return;

      if (!telphone) return this.$message(language.noTypePhoneNumber);
      if (!Helper.is('cell', telphone) && !isTWPhone(telphone)) return this.$message(language.phoneNumberError);
      if (!password) return this.$message(language.noTypePassword);
      if (password.length < 6 || password.length > 16) return this.$message(language.passwordLengthError);

      this.submiting = true;

      Http.fetch('api/check_login', {
        mobile: telphone,
        password: password
      }).then(response => {
        this.submiting = false;

        Http.resolve(response, (error, result) => {
          if (error) {
            throw result;
          } else {
            if (result.status === 1) {
              USER_AUTH.user_auth = true;
              this.close(false);
            } else {
              this.$message(language.signInEorror);
              throw result.msg;
            };
          };
        });
      });
    },
    syncTelphone(evt) {
      this.telphone = evt.target.value.replace(/ /g, '');
    }
  }
};
</script>
