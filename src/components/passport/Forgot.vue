<template>
  <layout>
    <layout-header :title="lang.title" :search="false"></layout-header>
    <layout-body>
      <forgot v-if="step === 1" :swipeToNext="swipeToNext" :url="url"></forgot>
      <forgot-next v-if="step === 2" :url="url"></forgot-next>
    </layout-body>
  </layout>
</template>

<script>
import {Layout, LayoutHeader, LayoutBody} from '../layout';
import Forgot from './forgot/Forgot.vue';
import ForgotNext from './forgot/ForgotNext.vue';

import {USER_AUTH} from 'config';
import {Http, translate} from 'methods';

const language = translate({
  'zh-cn': {
    title: '找回游惠宝账号'
  },
  'zh-tw': {
    title: '找回游惠寶帳號'
  }
});

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
        Http.resolve(response).then(result => {
          if (result.status === -2) {
            next();
          } else if (result.status === 1) {
            next({name: 'ucenter'});
            throw new Error(result.msg);
          };
        }).catch(error => {
          next({path: '/404'});
          throw new Error(error);
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
    swipeToNext() {
      this.step = 2;
    }
  }
};
</script>
