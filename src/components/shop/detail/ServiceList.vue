<style scoped>
  .shop-item>h5{padding:.16rem .2rem;line-height:.18rem;font-size:.14rem;}
  .list-show-more{padding:.16rem 0;text-align:center;}
  .list-show-more>span{font-size:.14rem;line-height:.14rem;}
  .list-show-more>span:after{color:#ddd;margin-left:.05rem;}
</style>

<template>
  <div v-if="list.length" class="shop-item ui-card ui-card-overline ui-card-underline ui-card-mar-btm">
    <h5 class="t-bold ui-card-underline">{{lang.title}}</h5>
    <div class="generic-list">
      <list-item v-for="item in showList" :serviceId="item.service_id" :serviceName="item.service_name" :serviceLogo="item.service_logo" :discountTag="item.discount_tag" :serviceType="item.service_type" :serviceLink="item.service_link" :discountPrice="item.discount_price" :servicePrice="item.service_price" :serviceUv="item.service_uv" :tags="item.tags" :shopId="shopId" :shopName="shopName" :shopAuth="shopAuth"></list-item>
      <div v-if="hideList.length" @click="showMore" class="list-show-more ui-card-overline">
        <span class="iconfont i-arrow-down-aft">{{lang.showMore[0]}}{{hideList.length}}{{lang.showMore[1]}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import ListItem from '../../service/components/ListItem.vue';

import {LANG_TYPE} from 'config';

const Language = {
  'zh-cn': {
    title: '精选服务',
    showMore: ['查看其它', '个服务']
  },
  'zh-tw': {
    title: '精選服務',
    showMore: ['查看其它', '個服務']
  }
};
const language = Language[LANG_TYPE];

export default {
  components: {
    ListItem
  },
  props: ['shopId', 'shopName', 'shopAuth', 'list'],
  data() {
    return {
      lang: language,
      showList: [],
      hideList: []
    };
  },
  watch: {
    list: function() {
      this.showList.splice(0, this.showList.length);
      this.hideList.splice(0, this.hideList.length);

      this.list.forEach((item, index) => {
        if (index < 3) {
          this.showList.push(item);
        } else {
          this.hideList.push(item);
        };
      });
    }
  },
  methods: {
    showMore: function() {
      this.$set(this, 'showList', this.showList.concat(this.hideList));
      this.hideList.splice(0, this.hideList.length);
    }
  }
};
</script>
