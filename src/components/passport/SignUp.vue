<template>
  <layout>
    <layout-header :title="lang.title" :search="false"></layout-header>
    <layout-body>
      <sign-up v-if="step === 1" :swipeToNext="swipeToNext" :url="url"></sign-up>
      <sign-up-next v-if="step === 2" :url="url"></sign-up-next>
    </layout-body>
  </layout>
</template>

<script>
import {Layout, LayoutHeader, LayoutBody} from '../layout';
import SignUp from './signup/SignUp.vue';
import SignUpNext from './signup/SignUpNext.vue';

import {USER_AUTH} from 'config';
import {Http, translate} from 'methods';

const language = translate({
  'zh-cn': {
    title: '注册游惠宝账号'
  },
  'zh-tw': {
    title: '註冊遊惠寶賬號'
  }
});

export default {
  components: {
    Layout,
    LayoutHeader,
    LayoutBody,
    SignUp,
    SignUpNext
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
