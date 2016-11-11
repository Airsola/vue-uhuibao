<style lang="stylus" scoped>
label {
  &.privacy {
    line-height: .16rem;
    display: inline-block;
    padding-left: .2rem;
    position: relative;
    &:before {
      content: '';
      display: block;
      width: .14rem;
      height: .14rem;
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: -.07rem;
      border-radius: .03rem;
      z-index: 0;
      border: solid .01rem rgba(0,0,0,0.1);
      background-color: #eee;
      transition: background-color .2s ease;
    }
    &:after {
      position: absolute;
      left: .03rem;
      top: .04rem;
      z-index: 1;
      line-height: 1em;
      font-size: .1rem;
      color: #fff;
      opacity: 0;
      transition: opacity .2s ease;
    }
    &.agreed {
      &:before {
        background-color: #2dbcff;
      }
      &:after {
        opacity: 1;
      }
    }
    & > a {
      color: #2dbcff;
    }
  }
}
</style>

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
        <div class="form-link">
          <label :class="['privacy', 'iconfont', 'i-success-aft', agreed ? 'agreed' : '']" @click="agreed = !agreed">已阅读并同意<router-link :to="{name: 'passport:privacy'}">《游惠宝用户协议》</router-link></label>
        </div>
        <div class="form-submit">
          <a :class="[!password || password.length < 6 || password.length > 16 || !repassword || password !== repassword || !agreed || submiting || timeout > 0 ? 'disabled' : 'important']" @click="submitAction(password, repassword)">{{submiting ? lang.passwordSaveIng : (timeout > 0 ? lang.signUpSuccess[0] + timeout + lang.signUpSuccess[1] : lang.setPasspord)}}</a>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import 'assets/passport.styl';

import {Http, translate} from 'methods';
import {checkRepassword, setPasswordAction, Language} from '../methods';

const language = {
  ...translate(Language.signupNext)
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
      if (!this.agreed) return this.$message(language.noAgreePrivacy);

      if (!checkRepassword(password, repassword)) return;

      this.submiting = true;

      setPasswordAction(password, response => {
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
