<style lang="stylus">
.privacy-article {
  padding: .2rem;
  background-color: #fff;
  & > h2 {
    font-size: .16rem;
    line-height: .4rem;
  }
  & > h3 {
    font-size: .14rem;
    line-height: .2rem;
    padding: .05rem 0;
  }
  p {
    line-height: .2rem;
    font-size: .12rem;
    color: #666;
  }
}
</style>
<template>
  <layout>
    <layout-header :title="lang.title" :search="false"></layout-header>
    <layout-body>
      <div class="privacy-article" v-html="paramRemark"></div>
    </layout-body>
  </layout>
</template>

<script>
import {Layout, LayoutHeader, LayoutBody} from '../layout';
import {Http, translate} from 'methods';

const language = translate({
  'zh-cn': {
    title: '游惠宝用户协议'
  },
  'zh-tw': {
    title: '遊惠寶用戶協議'
  }
});

export default {
  components: {
    Layout,
    LayoutHeader,
    LayoutBody
  },
  data() {
    return {
      paramRemark: '',
      lang: language
    };
  },
  beforeRouteEnter(to, from, next) {
    Http.fetch('api/get_registration_agreement').then(response => {
      Http.resolve(response).then(result => {
        next(vm => {
          vm.$set(vm, 'paramRemark', result.data.param_remark);
        });
      }).catch(error => {
        next({path: '/404'});
        throw new Error(error);
      });
    });
  }
};
</script>
