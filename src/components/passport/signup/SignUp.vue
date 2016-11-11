<template>
  <transition name="slide-left">
    <div class="ui-passport">
      <div class="ui-card ui-card-padd ui-card-underline">
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
            <span :class="[!telphone || !isTelphone(telphone) || msgSending || timeout > 0 ? 'disabled' : '']" @click="sendMsgAction(telphone)">{{msgSending ? lang.verifyCodeSending : (timeout > 0 ? timeout + lang.waitSendVerifyCodeAgain : lang.getVerifyCode)}}</span>
          </li>
        </ul>
        <div class="form-submit clearfix">
          <a :class="[!telphone || !isTelphone(telphone) || !verifycode || verifycode.length !== 4 || codeVerifying ? 'disabled' : 'important']" @click="submitAction(telphone, verifycode)">{{codeVerifying ? lang.codeVerifying : lang.nextStep}}</a>
          <router-link :to="{name: 'passport:signin', query: {url: url}}">{{lang.signIn}}</router-link>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import 'assets/passport.styl';

import Helper from 'helper';
import {Http, translate} from 'methods';
import {isTelphone, checkTelphone, checkVerifycode, sendMsgAction, checkCodeAction, Language} from '../methods';

const language = {
  ...translate(Language.signup),
  ...translate(Language.verifycode)
};

console.log(language);

export default {
  props: ['swipeToNext', 'url'],
  data() {
    return {
      telphone: '',
      formated: '',
      verifycode: '',
      timeout: 0,
      timer: null,
      msgSending: false,
      codeVerifying: false,
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
    sendMsgAction(telphone) {
      if (this.msgSending || this.timeout > 0) return;

      if (!checkTelphone(telphone)) return;

      this.msgSending = true;

      sendMsgAction(telphone, 1, response => {
        this.msgSending = false;

        Http.resolve(response).then(result => {
          this.$message(language.verifyCodeSendSuccess);
          this.timeout = 60;
          this.timer = window.setInterval(() => {
            this.timeout --;
            if (this.timeout === 0) window.clearInterval(this.timer);
          }, 1000);
        }).catch(error => {
          if (response.ok) this.$message(error);
          throw new Error(error);
        });
      });
    },
    submitAction(telphone, verifycode) {
      if (this.codeVerifying) return;

      if (!checkTelphone(telphone)) return;
      if (!checkVerifycode(verifycode)) return;

      this.codeVerifying = true;

      checkCodeAction(telphone, verifycode, 0, response => {
        this.codeVerifying = false;

        Http.resolve(response).then(result => {
          this.swipeToNext();
        }).catch(error => {
          if (response.ok) this.$message(error);
          throw new Error(error);
        });
      });
    }
  }
};
</script>
