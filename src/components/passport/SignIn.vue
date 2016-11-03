<template>
  <layout>
    <layout-header :title="lang.title" :search="false"></layout-header>
    <layout-body>
      <sign-in></sign-in>
    </layout-body>
  </layout>
</template>

<script>
import {Layout, LayoutHeader, LayoutBody} from '../layout';
import SignIn from './signin/SignIn.vue';
import {Http, LANG_TYPE, USER_AUTH} from 'config';

const Language = {
  'zh-cn': {
    title: '游惠宝账号登录'
  },
  'zh-tw': {
    title: '遊惠寶賬號登錄'
  }
};
const language = Language[LANG_TYPE];

export default {
  components: {
    Layout,
    LayoutHeader,
    LayoutBody,
    SignIn
  },
  data() {
    return {
      url: this.$route.query.url,
      lang: language
    };
  },
  beforeRouteEnter: function(to, from, next) {
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
  }
};
</script>
