<style lang="stylus" scoped>
.form-link {
  padding-top: .2rem;
  & > a {
    text-decoration: underline;
  }
}
</style>

<template>
  <div class="ui-passport">
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
        <router-link :to="{name: 'passport:forgot', query: {url: url}}">{{lang.forgotPassword}}</router-link>
      </div>
      <div class="form-submit clearfix">
        <a :class="[!telphone || !isTelphone(telphone) || !password || password.length < 6 || password.length > 16 || submiting ? 'disabled' : 'important']" @click="submitAction(telphone, password, url)">{{submiting ? lang.signIng : lang.signIn}}</a>
        <router-link :to="{name: 'passport:signup', query: {url: url}}" class="submit-btn">{{lang.signUp}}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import 'assets/passport.styl';

import Helper from 'helper';
import {USER_AUTH} from 'config';
import {Http, translate} from 'methods';
import {isTelphone, checkTelphone, checkPassword, sginInAction, Language} from '../methods';

const language = {
  ...translate(Language.signin)
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
    isTelphone,
    submitAction(telphone, password, url) {
      if (this.submiting) return;

      if (!checkTelphone(telphone)) return;
      if (!checkPassword(password)) return;

      this.submiting = true;

      sginInAction(telphone, password, response => {
        Http.resolve(response).then(result => {
          USER_AUTH.user_auth = true;

          // 如果有来源地址，则返回来源地址，否则则回到用户中心页面！
          if (url) {
            window.location.replace(url);
          } else {
            this.$router.replace({
              name: 'ucenter'
            });
          };
        }).catch(error => {
          if (response.ok) this.$message(language.signInEorror);
          throw new Error(error);
        });
      });
    }
  }
};
</script>
