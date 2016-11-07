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
      <a v-if="timeout > 0" class="disabled">{{lang.signUpSuccess[0]}}{{timeout}}{{lang.signUpSuccess[1]}}</a>
      <a v-if="submiting && timeout === 0" class="disabled">{{lang.passwordSaveIng}}</a>
      <a v-if="!submiting && timeout === 0" @click="setPasswordAction(password, repassword)" class="important">{{lang.resetPassword}}</a>
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
    setPasswordAction(password, repassword) {
      if (this.submiting) return;

      if (!password) return this.$message(language.noTypePassword);
      if (password.length < 6 || password.length > 16) return this.$message(language.passwordLengthError);
      if (!repassword) return this.$message(language.noTypeConfirmPassword);
      if (password !== repassword) return this.$message(language.passwordDiff);

      this.submiting = true;

      Http.fetch('api/reset_pwd', {password).then(response => {
        this.submiting = false;

        Http.resolve(response, (error, result) => {
          if (error) {
            throw result;
          } else {
            if (result.status === 1) {
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
            } else {
              this.$message(result.msg);
              throw result.msg;
            };
          };
        });
      });
    }
  }
};
</script>
