<style lang="stylus" scoped>
  .service-img
    display block
    width 100%

  .service-info
    position relative
    h4
      font-size .16rem
      line-height .22rem
      margin-bottom .1rem
      overflow hidden
      text-overflow ellipsis
      display -webkit-box
      -webkit-line-clamp 2
      -webkit-box-orient vertical
    span.service-price
      color #2cbcff
      font-size .1rem
      b
        font-size .17rem;
      s
        color #999
        font-size .12rem
        display inline-block
        margin-left .05rem
        :first-letter
          font-size .1rem
        i
         text-decoration line-through
    span.clicked
      font-size .12rem
      position absolute
      right 0
      bottom 0
      color #999
    div.tags
      padding-top .05rem
      span
        line-height .15rem
        padding 0 .04rem
        border solid 1px #2cbcff
        border-radius .015rem
        display inline-block
        font-size .1rem
        color #2cbcff
        text-align center
        float left
        margin-right .05rem

  .shop-info
    padding 0 .2rem .2rem .2rem

  .service-notes
    .title
      padding .16rem .2rem
      font-size .15rem
      line-height 1em
</style>
<template>
  <layout>
    <layout-header :title="lang.title"></layout-header>
    <layout-body>
      <img :src="serviceImg" :alt="serviceName" class="service-img">
      <div class="ui-card ui-card-padd">
        <div class="service-info">
          <h4 class="t-bold">{{serviceName}}</h4>
          <span class="service-price" v-if="discountPrice">
            {{lang.currencySymbol}}<b>{{discountPrice}}</b><s>{{lang.currencySymbol}}<i>{{servicePrice}}</i></s>
          </span>
          <span class="service-price" v-else>
            {{lang.currencySymbol}}<b>{{servicePrice}}</b>
          </span>
          <div class="tags clearfix">
            <span v-for="tag in serviceTags">{{tag.tag_name}}</span>
          </div>
          <span class="clicked">{{serviceUV}} {{lang.clicked}}</span>
        </div>
      </div>
      <div class="ui-card ui-card-underline ui-card-mar-btm shop-info">
        <id-card :shopId="shopId" :shopName="shopName" :shopLogo="shopLogo" :shopDesc="shopDesc" :shopAuth="shopAuth"></id-card>
      </div>
      <div class="ui-card ui-card-overline ui-card-underline ui-card-mar-btm service-notes">
        <h5 class="title ui-card-underline">
          <span class="t-bold">{{lang.buyNotes}}</span>
        </h5>
        <div class="ui-card-padd" v-html="htmlpx2rem(serviceInfo)"></div>
      </div>
      <div class="ui-card ui-card-overline ui-card-underline ui-card-mar-btm">
        <div class="ui-card-padd" v-html="htmlpx2rem(serviceReason)"></div>
      </div>
      <div class="clearfix"></div>
    </layout-body>
  </layout>
</template>

<script>
import {Layout, LayoutHeader, LayoutBody} from '../layout';
import IdCard from '../shop/components/IdCard.vue';

import Helper from 'helper';
import {Http, LANG_TYPE} from 'config';

const Language = {
  'zh-cn': {
    title: '服务详情',
    clicked: '人浏览',
    currencySymbol: '￥',
    buyNotes: '购买须知'
  },
  'zh-tw': {
    title: '服務詳情',
    clicked: '人瀏覽',
    currencySymbol: 'NT$',
    buyNotes: '購買須知'
  }
};
const language = Language[LANG_TYPE];

export default {
  components: {
    Layout,
    LayoutHeader,
    LayoutBody,
    IdCard
  },
  data() {
    return {
      serviceName: '',
      serviceImg: '',
      servicePrice: 0,
      discountPrice: 0,
      showCateMenu: false,
      showAreaMenu: false,
      serviceTags: [],
      serviceUV: 0,
      serviceReason: '',
      serviceInfo: '',
      shopId: 0,
      shopName: '',
      shopLogo: '',
      shopDesc: '',
      shopAuth: false,
      lang: language
    };
  },
  created: function() {
    this.fetchData(this.$route.params.service_id);
  },
  methods: {
    fetchData: function(serviceId) {
      Http.fetch('service/get_server_detail', {
        service_id: serviceId
      }).then(response => {
        if (response.ok) {
          response.json().then(result => {
            if (result.status === 0) return;

            this.$set(this, 'serviceName', result.data.service_name);
            this.$set(this, 'servicePrice', result.data.service_price);
            this.$set(this, 'discountPrice', result.data.discount_price);
            this.$set(this, 'serviceTags', result.data.tags);
            this.$set(this, 'serviceUV', result.data.service_uv);
            this.$set(this, 'serviceImg', result.data.service_img);
            this.$set(this, 'serviceReason', result.data.service_reason);
            this.$set(this, 'serviceInfo', result.data.service_info);

            this.$set(this, 'shopId', result.data.shop_id);
            this.$set(this, 'shopName', result.data.shop_name);
            this.$set(this, 'shopLogo', result.data.shop_logo_url);
            this.$set(this, 'shopDesc', result.data.shop_desc);
            this.$set(this, 'shopAuth', result.data.shop_auth);
          });
        };
      });
    },
    htmlpx2rem: function(value) {
      return Helper.htmlpx2rem(value);
    }
  }
};
</script>
