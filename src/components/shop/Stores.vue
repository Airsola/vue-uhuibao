<style scoped>
  .branch-store>p{padding:.2rem .2rem .1rem .2rem;font-size:.14rem;}
</style>
<template>
  <wrapper>
    <div class="branch-store">
      <p>{{lang.countDesc[0]}}{{storeList.length}}{{lang.countDesc[1]}}</p>
    </div>
    <div v-if="storeList.length > 0" class="store-list ui-card ui-card-overline ui-card-underline ui-card-mar-btm">
      <ul>
        <list-item v-for="item in storeList" :shopId="shopId" :storeId="item.store_id" :storeName="item.store_name" :storeAddress="item.address" :storeTelphone="item.store_telephone"></list-item>
      </ul>
    </div>
    <div class="clearfix"></div>
  </wrapper>
</template>

<script>
import Wrapper from 'components/layout/Wrapper.vue';
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
    ListItem,
    Wrapper
  },
  computed: {
    shopId: function() {
      return this.$route.params.shop_id;
    }
  },
  data() {
    return {
      storeList: [],
      lang: language
    };
  },
  created: function() {
    this.fetchData(this.shopId);
  },
  mounted: function() {
    this.$root.$emit('app:update', {
      title: language.title,
      item: ['back']
    });
  },
  watch: {
    $route: function(to, from) {
      this.fetchData(to.params.shop_id);
    }
  },
  methods: {
    fetchData: function(shopId) {
      Http.fetch('shop/get_store_list', {
        shop_id: shopId
      }).then(response => {
        if (response.ok) {
          response.json().then(result => {
            if (result.status === 0) return;

            this.$set(this, 'storeList', result.data);
          });
        };
      });
    }
  }
};
</script>
