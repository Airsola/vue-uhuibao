<style scoped>
  .form-table>li{position:relative;}
  .form-table>li>label{display:block;padding:.16rem 0 .16rem .3rem;height:.16rem;position:relative;}
  .form-table>li>label.short{margin-right:1rem;}
  .form-table>li>label:before{font-size:.16rem;color:#c7d1da;line-height:1em;position:absolute;left:0;top:50%;margin-top:-.5em;}
  .form-table>li>label>input{border:none;height:.16rem;width:100%;line-height:.16rem;font-size:.14rem;}

  .form-link{font-size:.14rem;color:#ffaa18;padding-top:.2rem;}
  .form-link>a{text-decoration:underline;}

  .form-submit>a{border-radius:.03rem;margin-top:.2rem;display:block;line-height:.4rem;text-align:center;color:#666;border:solid 1px #f0f0f0;font-size:.14rem;}
  .form-submit>a.important{background-color:#2dbcff;color:#fff;border:none;}
  .form-submit>a.disabled{background-color:#eee;color:#ccc;text-shadow:1px 1px 0 rgba(255,255,255,.3);border:none;}
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
        <label class="iconfont i-password-bfo">
          <input :placeholder="lang.typePassword" v-model="password" type="password" maxlength="16">
        </label>
      </li>
    </ul>
    <div class="form-link">
      <router-link :to="{name: 'passport:forgot'}">{{lang.forgotPassword}}</router-link>
    </div>
    <div class="form-submit clearfix">
      <a v-if="submiting" class="disabled">{{lang.signIng}}</a>
      <a v-else @click="loginAction(telphone, password, url)" class="important">{{lang.signIn}}</a>
      <router-link :to="{name: 'passport:signup'}" class="submit-btn">{{lang.signUp}}</router-link>
    </div>
  </div>
</template>

<script>
import Helper from 'helper';
import {Http, LANG_TYPE, USER_AUTH} from 'config';

const Language = {
  'zh-cn': {
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
    typePhoneNumber: '請輸入手機號',
    typePassword: '請輸入密碼',
    forgotPassword: '忘記登錄密碼',
    signIn: '登錄',
    signIng: '登錄中…',
    signUp: '註冊',
    noTypePhoneNumber: '嘿，要先輸入手機號碼！ ',
    phoneNumberError: '親，手機號碼寫錯了，改一改！ ',
    noTypePassword: '嘿，你還沒有輸入密碼！ ',
    passwordLengthError: '密碼的長度為6-16位字符！ ',
    signInEorror: '您輸入的賬號或密碼不正確！ '
  }
};
const language = Language[LANG_TYPE];
const TWPhoneRegex = new RegExp('^09(\\d{8})$');
const isTWPhone = function(string) {
  return TWPhoneRegex.test(string);
};

export default {
  props: ['url'],
  data() {
    return {
      telphone: '',
      formated: '',
      password: '',
      submiting: false,
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
    loginAction(telphone, password, url) {
      if (this.submiting) return;

      if (!telphone) return this.$message(language.noTypePhoneNumber);
      if (!Helper.is('cell', telphone) && !isTWPhone(telphone)) return this.$message(language.phoneNumberError);
      if (!password) return this.$message(language.noTypePassword);
      if (password.length < 6 || password.length > 16) return this.$message(language.passwordLengthError);

      this.submiting = true;

      Http.fetch('api/check_login', {
        mobile: telphone,
        password
      }).then(response => {
        this.submiting = false;

        Http.resolve(response, (error, result) => {
          if (error) {
            throw result;
          } else {
            if (result.status === 0) {
              this.$message(language.signInEorror);
            } else if (result.status === 1) {
              USER_AUTH.user_auth = true;

              // 如果有来源地址，则返回来源地址，否则则回到用户中心页面！
              if (url) {
                window.location.href = url;
              } else {
                this.$router.replace({
                  name: 'ucenter'
                });
              };
            };
          };
        });
      });
    }
  }
};
</script>
