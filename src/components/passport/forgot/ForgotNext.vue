<template>
  <transition name="slide-left">
    <div class="ui-passport">
      <div class="ui-card ui-card-padd ui-card-underline">
        <ul class="form-table">
          <li class="underline">
            <label class="iconfont i-password-bfo">
              <input v-model="password" :placeholder="lang.typePassword" type="password" maxlength="16">
            </label>
          </li>
          <li class="underline">
            <label class="iconfont i-password-bfo">
              <input v-model="repassword" :placeholder="lang.typePasswordAgain" type="password" maxlength="16">
            </label>
          </li>
        </ul>
        <div class="form-submit">
          <a :class="[!password || password.length < 6 || password.length > 16 || !repassword || password !== repassword || submiting || timeout > 0 ? 'disabled' : 'important']" @click="submitAction(password, repassword)">{{submiting ? lang.passwordSaveIng : (timeout > 0 ? lang.resetSuccess[0] + timeout + lang.resetSuccess[1] : lang.resetPassword)}}</a>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import 'assets/passport.styl';

import {Http, translate} from 'methods';
import {checkRepassword, resetPasswordAction, Language} from '../methods';

const language = {
  ...translate(Language.forgotNext)
};

export default {
  props: ['url'],
  data() {
    return {
      password: '',
      repassword: '',
      agreed: true,
      submiting: false,
      timeout: 0,
      timer: null,

      lang: language
    };
  },
  methods: {
    submitAction(password, repassword) {
      if (this.submiting || this.timeout > 0) return;

      if (!checkRepassword(password, repassword)) return;

      this.submiting = true;

      resetPasswordAction(password, response => {
        this.submiting = false;

        Http.resolve(response).then(result => {
          this.timeout = 3;
          this.timer = window.setInterval(() => {
            this.timeout --;
            if (this.timeout === 0) {
              window.clearInterval(this.timer);
              this.$router.replace({
                name: 'passport:signin',
                query: {
                  url: this.url
                }
              });
            };
          }, 1000);
        }).catch(error => {
          if (response.ok) this.$message(error);
          throw new Error(error);
        });
      });
    }
  }
};
</script>
