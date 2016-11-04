<template>
  <layout>
    <layout-header :title="lang.title" :search="false"></layout-header>
    <layout-body>
      <forgot v-if="step === 1" :swipeTo="swipeTo" :url="url"></forgot>
      <forgot-next v-if="step === 2" :url="url"></forgot-next>
    </layout-body>
  </layout>
</template>

<script>
import {Layout, LayoutHeader, LayoutBody} from '../layout';
import Forgot from './forgot/Forgot.vue';
import ForgotNext from './forgot/ForgotNext.vue';

import {Http, LANG_TYPE, USER_AUTH} from 'config';

const Language = {
  'zh-cn': {
    title: '找回游惠宝账号'
  },
  'zh-tw': {
    title: '找回游惠寶帳號'
  }
};
const language = Language[LANG_TYPE];

export default {
  components: {
    Layout,
    LayoutHeader,
    LayoutBody,
    Forgot,
    ForgotNext
  },
  data() {
    return {
      url: this.$route.query.url,
      step: 1,
      lang: language
    };
  },
  beforeRouteEnter(to, from, next) {
    if (USER_AUTH.user_auth === false) {
      next();
    } else {
      Http.fetch('api/check_islogin').then(response => {
        Http.resolve(response, (error, result) => {
          if (error) {
            next(false);
            throw result;
          } else {
            if (result.status === -2) {
              next();
            } else if (result.status === 1) {
              next({name: 'ucenter'});
              throw result.msg;
            } else {
              next({path: '/404'});
              throw result.msg;
            };
          };
        });
      });
    };
  },
  watch: {
    $route(to, from) {
      this.url = to.query.url;
    }
  },
  methods: {
    swipeTo(index) {
      this.step = index;
    }
  }
};
</script>
