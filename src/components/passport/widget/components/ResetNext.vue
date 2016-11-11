<template>
  <transition name="slide-up">
    <div class="form-animate">
      <div class="from-wrap">
        <div class="form-box">
          <h5 class="form-title">{{lang.title}}</h5>
          <ul class="form-table">
            <li class="underline">
              <label class="iconfont i-password-bfo">
                <input type="password" v-model="password" :placeholder="lang.typePassword">
              </label>
            </li>
            <li class="underline">
              <label class="iconfont i-password-bfo">
                <input type="password" v-model="repassword" :placeholder="lang.typePasswordAgain">
              </label>
            </li>
          </ul>
          <div class="form-submit">
            <a :class="[!password || password.length < 6 || password.length > 16 || !repassword || password !== repassword || submiting || timeout > 0 ? 'disabled' : 'important']" @click="submitAction(password, repassword)">{{submiting ? lang.passwordSaveIng : (timeout > 0 ? lang.resetSuccess[0] + timeout + lang.resetSuccess[1] : lang.resetPassword)}}</a>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {Http, translate} from 'methods';

const language = translate({
  'zh-cn': {
    title: '重置游惠宝密码',
    typePassword: '请输入密码',
    typePasswordAgain: '请再次输入密码',
    resetPassword: '重置密码',
    noTypePassword: '嘿，你还没有输入密码！',
    passwordLengthError: '密码的长度为6-16位字符！',
    noTypeConfirmPassword: '请再次输入确认密码！',
    passwordDiff: '两次密码不一样啊！',
    resetSuccess: ['密码重置成功，', '秒后回到登录窗！'],
    passwordSaveIng: '密码重置中…'
  },
  'zh-tw': {
    title: '重置遊惠寶密碼',
    typePassword: '請輸入密碼',
    typePasswordAgain: '請再次輸入密碼',
    resetPassword: '重置密碼',
    noTypePassword: '嘿，你還沒有輸入密碼！',
    passwordLengthError: '密碼的長度為6-16位字符！',
    noTypeConfirmPassword: '請再次輸入確認密碼！',
    passwordDiff: '兩次密碼不一樣啊！',
    resetSuccess: ['密碼重置成功，', '秒後回到登錄窗！'],
    passwordSaveIng: '密码重置中…'
  }
});

export default {
  props: ['swipeTo'],
  data() {
    return {
      lang: language,
      password: '',
      repassword: '',
      submiting: false,
      timeout: 0,
      timer: null
    };
  },
  methods: {
    submitAction(password, repassword) {
      if (this.submiting || this.timeout > 0) return;

      if (!password) return this.$message(language.noTypePassword);
      if (password.length < 6 || password.length > 16) return this.$message(language.passwordLengthError);
      if (!repassword) return this.$message(language.noTypeConfirmPassword);
      if (password !== repassword) return this.$message(language.passwordDiff);

      this.submiting = true;

      Http.fetch('api/reset_pwd', {password}).then(response => {
        this.submiting = false;

        Http.resolve(response).then(result => {
          this.timeout = 3;
          this.timer = window.setInterval(() => {
            this.timeout --;
            if (this.timeout === 0) {
              window.clearInterval(this.timer);
              this.swipeTo(0);
            };
          }, 1000);
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
