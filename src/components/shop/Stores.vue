<style lang="stylus" scoped>
.branch-store {
  & > p {
    padding: .2rem .2rem .1rem .2rem;
    font-size: .14rem;
  }
}
</style>
<template>
  <layout>
    <layout-header :title="lang.title" :search="false"></layout-header>
    <layout-body>
      <div class="branch-store">
        <p>{{lang.countDesc[0]}}{{storeList.length}}{{lang.countDesc[1]}}</p>
      </div>
      <div v-if="storeList.length > 0" class="store-list ui-card ui-card-overline ui-card-underline ui-card-mar-btm">
        <ul>
          <list-item v-for="item in storeList" :shopId="shopId" :storeId="item.store_id" :storeName="item.store_name" :storeAddress="item.address" :storeTelphone="item.store_telephone"></list-item>
        </ul>
      </div>
      <div class="clearfix"></div>
    </layout-body>
  </layout>
</template>

<script>
import {Layout, LayoutHeader, LayoutBody} from '../layout';
import ListItem from './stores/ListItem.vue';

import {Http, LANG_TYPE} from 'config';

const Language = {
  'zh-cn': {
    title: '分店信息',
    countDesc: ['全部分店共', '家']
  },
  'zh-tw': {
    title: '分店信息',
    countDesc: ['全部分店共', '家']
  }
};
const language = Language[LANG_TYPE];

export default {
  components: {
    Layout,
    LayoutHeader,
    LayoutBody,
    ListItem
  },
  computed: {
    shopId() {
      return this.$route.params.shop_id;
    }
  },
  data() {
    return {
      storeList: [],
      lang: language
    };
  },
  beforeRouteEnter(to, from, next) {
    Http.fetch('shop/get_store_list', {
      shop_id: to.params.shop_id
    }).then(response => {
      Http.resolve(response).then(result => {
        next(vm => {
          vm.$set(vm, 'storeList', result.data);
        });
      }).catch(error => {
        next({path: '/404'});
        throw new Error(error);
      });
    });
  },
  watch: {
    $route(to, from) {
      Http.fetch('shop/get_store_list', {
        shop_id: to.params.shop_id
      }).then(response => {
        Http.resolve(response).then(result => {
          this.$set(this, 'storeList', result.data);
        }).catch(error => {
          this.$router.replace({path: '/404'});
          throw new Error(error);
        });
      });
    }
  }
};
</script>
