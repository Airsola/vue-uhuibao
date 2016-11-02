<style scoped>
  .form-table>li{position:relative;}
  .form-table>li>label{display:block;padding:.16rem 0 .16rem .3rem;height:.16rem;position:relative;}
  .form-table>li>label.short{margin-right:1rem;}
  .form-table>li>label:before{font-size:.16rem;color:#c7d1da;line-height:1em;position:absolute;left:0;top:50%;margin-top:-.5em;}
  .form-table>li>label>input{border:none;height:.16rem;width:100%;line-height:.16rem;font-size:.14rem;}

  .form-link{padding-top:.2rem;}
  label.privacy{line-height:.16rem;display:inline-block;padding-left:.2rem;position:relative;}
  label.privacy:before{content:'';display:block;width:.14rem;height:.14rem;position:absolute;left:0;top:50%;margin-top:-.07rem;border-radius:.03rem;z-index:0;border:solid .01rem rgba(0,0,0,0.1);background-color:#eee;transition:background-color .2s ease;}
  label.privacy:after{position:absolute;left:.03rem;top:.04rem;z-index:1;line-height:1em;font-size:.1rem;color:#fff;opacity:0;transition:opacity .2s ease;}
  label.privacy.agreed:before{background-color:#2dbcff;}
  label.privacy.agreed:after{opacity:1;}
  label.privacy>a{color:#2dbcff;}

  .form-submit>a{border-radius:.03rem;margin-top:.2rem;display:block;line-height:.4rem;text-align:center;color:#666;border:solid 1px #f0f0f0;font-size:.14rem;}
  .form-submit>a.important{background-color:#2dbcff;color:#fff;border:none;}
  .form-submit>a.disabled{background-color:#eee;color:#ccc;text-shadow:1px 1px 0 rgba(255,255,255,.3);border:none;}
</style>
<template>
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
      <a v-if="timeout > 0" class="disabled">{{lang.signUpSuccess[0]}}{{timeout}}{{lang.signUpSuccess[1]}}</a>
      <a v-if="submiting && timeout === 0" class="disabled">{{lang.passwordSaveIng}}</a>
      <a v-if="!agreed && !submiting && timeout === 0" class="disabled" @click="$message(lang.noAgreePrivacy)">{{lang.resetPassword}}</a>
      <a v-if="agreed && !submiting && timeout === 0" @click="setPasswordAction(password, repassword)" class="important">{{lang.resetPassword}}</a>
    </div>
  </div>
</template>

<script>
import {Http, LANG_TYPE} from 'config';

const Language = {
  'zh-cn': {
    typePassword: '请输入密码',
    typePasswordAgain: '请再次输入密码',
    resetPassword: '重置密码重置',
    noTypePassword: '嘿，你还没有输入密码！',
    passwordLengthError: '密码的长度为6-16位字符！',
    noTypeConfirmPassword: '请再次输入确认密码！',
    passwordDiff: '两次密码不一样啊！',
    signUpSuccess: ['密码重置成功，', '秒后回到登录窗！'],
    passwordSaveIng: '密码重置中…'
  },
  'zh-tw': {
    typePassword: '請輸入密碼',
    typePasswordAgain: '請再次輸入密碼',
    resetPassword: '重置密碼重置',
    noTypePassword: '嘿，你還沒有輸入密碼！ ',
    passwordLengthError: '密碼的長度為6-16位字符！ ',
    noTypeConfirmPassword: '請再次輸入確認密碼！ ',
    passwordDiff: '兩次密碼不一樣啊！ ',
    signUpSuccess: ['密碼重置成功，', '秒後回到登錄窗！ '],
    passwordSaveIng: '密碼重置中…'
  }
};
const language = Language[LANG_TYPE];

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
    setPasswordAction: function(password, repassword) {
      if (this.submiting) return;

      if (!password) return this.$message(language.noTypePassword);
      if (password.length < 6 || password.length > 16) return this.$message(language.passwordLengthError);
      if (!repassword) return this.$message(language.noTypeConfirmPassword);
      if (password !== repassword) return this.$message(language.passwordDiff);

      this.submiting = true;

      Http.fetch('api/reset_pwd', {
        password: password
      }).then(response => {
        if (response.ok) {
          response.json().then(result => {
            this.submiting = false;

            if (result.status === 0) {
              this.$message(result.msg);
            } else {
              this.timeout = 3;
              this.timer = window.setInterval(() => {
                this.timeout --;
                if (this.timeout === 0) window.clearInterval(this.timer);
                this.$router.replace({
                  name: 'passport:signin',
                  query: {
                    url: this.url
                  }
                });
              }, 1000);
            };
          });
        };
      });
    }
  }
};
</script>
