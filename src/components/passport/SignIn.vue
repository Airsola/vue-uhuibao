<template>
  <layout>
    <layout-header :title="lang.title" :search="false"></layout-header>
    <layout-body>
      <sign-in :url="url"></sign-in>
    </layout-body>
  </layout>
</template>

<script>
import {Layout, LayoutHeader, LayoutBody} from '../layout';
import SignIn from './signin/SignIn.vue';
import {USER_AUTH} from 'config';
import {Http, translate} from 'methods';

const language = translate({
  'zh-cn': {
    title: '游惠宝账号登录'
  },
  'zh-tw': {
    title: '遊惠寶賬號登錄'
  }
});

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
  }
};
</script>
