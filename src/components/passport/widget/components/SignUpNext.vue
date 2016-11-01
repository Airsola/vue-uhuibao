<style scoped>
.popup-animate{position:absolute;width:85%;top:50%;left:50%;background-color:#fff;box-shadow:0 .01rem .03rem rgba(0,0,0,.2);z-index:2;border-radius:.03rem;transition:all .5s cubic-bezier(.55,0,.1,1);transform:translate(-50%, -50%);}
.slide-up-enter{opacity:0;transform:translate(-50%, -45%);}
.slide-up-leave-active{opacity:0;transform:translate(-50%, -45%);}

.from-wrap{padding:.2rem;}
.form-title{font-size:.16rem;text-align:center;padding-bottom:.1rem;}

.form-table>li{position:relative;}
.form-table>li>label{display:block;padding:.16rem 0 .16rem .3rem;height:.16rem;position:relative;}
.form-table>li>label.short{margin-right:1rem;}
.form-table>li>label:before{font-size:.16rem;color:#c7d1da;line-height:1em;position:absolute;left:0;top:50%;margin-top:-.5em;}
.form-table>li>label>input{border:none;height:.16rem;width:100%;line-height:.16rem;font-size:.14rem;}
.form-table>li>span{position:absolute;right:0;top:50%;transform:translateY(-50%);line-height:.3rem;padding:0 .1rem;font-size:.14rem;border-radius:.03rem;background-color:#2dbcff;color:#fff;z-index:1;}

.form-submit{padding-top:.2rem;}
.form-submit a{border-radius:.03rem;text-align:center;line-height:.4rem;font-size:.14rem;display:block;color:#666;border:solid 1px #f2f2f2;transition:background-color .2s ease,border-color .2s ease,color .2s ease;}
.form-submit a.disabled{background-color:#f2f2f2;border-color:#f2f2f2;color:#ccc;}
.form-submit a.important{background-color:#5fb8f1;border-color:#5fb8f1;color:#fff;}
</style>

<template>
  <transition name="slide-up">
    <div class="popup-animate">
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
            <a v-if="timeout > 0 && !submiting" class="disabled">{{lang.signUpSuccess[0]}}{{timeout}}{{lang.signUpSuccess[1]}}</a>
            <a v-if="timeout === 0 && !submiting" @click="setPassword" class="important">{{lang.title}}</a>
            <a v-if="timeout === 0 && submiting" class="disabled">{{lang.title}}</a>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import {Http, LANG_TYPE} from 'config';

const Language = {
  'zh-cn': {
    title: '设置游惠宝密码',
    typePassword: '请输入密码',
    typePasswordAgain: '请再次输入密码',
    noTypePassword: '嘿，你还没有输入密码！',
    passwordLengthError: '密码的长度为6-16位字符！',
    noTypeConfirmPassword: '请再次输入确认密码！',
    passwordDiff: '两次密码不一样啊！',
    signUpSuccess: ['註冊成功，', '秒后回到登录窗！'],
    passwordSaveIng: '密码设置中…'
  },
  'zh-tw': {
    title: '設置遊惠寶密碼',
    typePassword: '請輸入密碼',
    typePasswordAgain: '請再次輸入密碼',
    noTypePassword: '嘿，你還沒有輸入密碼！',
    passwordLengthError: '密碼的長度為6-16位字元！',
    noTypeConfirmPassword: '請再次輸入確認密碼！',
    passwordDiff: '兩次密碼不一樣啊！',
    signUpSuccess: ['註冊成功，', '秒後回到登錄窗！'],
    passwordSaveIng: '密码設置中…'
  }
};
const language = Language[LANG_TYPE];

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
    setPassword: function() {
      if (this.submiting) return;

      if (!this.password) return this.$message(language.noTypePassword);
      if (this.password.length < 6 || this.password.length > 16) return this.$message(language.passwordLengthError);
      if (!this.repassword) return this.$message(language.noTypeConfirmPassword);
      if (this.password !== this.repassword) return this.$message(language.passwordDiff);

      this.submiting = true;

      Http.fetch('api/register', {
        password: this.password
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
                this.swipeTo(0);
              }, 1000);
            };
          });
        };
      });
    }
  },
  beforeDestroy: function() {
    window.clearInterval(this.timer);
  }
};
</script>