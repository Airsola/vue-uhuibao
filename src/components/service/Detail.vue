<style lang="stylus" scoped>
.service-img {
  display: block;
  width: 100%;
}
.service-info {
  position: relative;
  h4 {
    font-size: 0.16rem;
    line-height: 0.22rem;
    margin-bottom: 0.1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    display: box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  span {
    &.service-price {
      color: #2cbcff;
      font-size: 0.1rem;
      b {
        font-size: 0.17rem;
      }
      s {
        color: #999;
        font-size: 0.12rem;
        display: inline-block;
        margin-left: 0.05rem;
        :first-letter {
          font-size: 0.1rem;
        }
        i {
          text-decoration: line-through;
        }
      }
    }
    &.clicked {
      font-size: 0.12rem;
      position: absolute;
      right: 0;
      bottom: 0;
      color: #999;
    }
  }
  div {
    &.tags {
      padding-top: 0.05rem;
      span {
        line-height: 0.15rem;
        padding: 0 0.04rem;
        border: solid 1px #2cbcff;
        border-radius: 0.015rem;
        display: inline-block;
        font-size: 0.1rem;
        color: #2cbcff;
        text-align: center;
        float: left;
        margin-right: 0.05rem;
      }
    }
  }
}
.shop-info {
  padding: 0 0.2rem 0.2rem 0.2rem;
}
.service-notes {
  .title {
    padding: 0.16rem 0.2rem;
    font-size: 0.15rem;
    line-height: 1em;
  }
}

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
        <div class="html-content ui-card-padd" v-html="htmlpx2rem(serviceInfo)"></div>
      </div>
      <div class="ui-card ui-card-overline ui-card-underline ui-card-mar-btm">
        <div class="html-content ui-card-padd" v-html="htmlpx2rem(serviceReason)"></div>
      </div>
      <div class="clearfix"></div>
    </layout-body>
  </layout>
</template>

<script>
import {Layout, LayoutHeader, LayoutBody} from '../layout';
import IdCard from '../shop/components/IdCard.vue';

import Helper from 'helper';
import {Http, translate, Weixin} from 'methods';

const language = translate({
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
});

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
  beforeRouteEnter(to, from, next) {
    Http.fetch('service/get_server_detail', {
      service_id: to.params.service_id
    }).then(response => {
      Http.resolve(response).then(result => {
        next(vm => {
          vm.$set(vm, 'serviceName', result.data.service_name);
          vm.$set(vm, 'servicePrice', result.data.service_price);
          vm.$set(vm, 'discountPrice', result.data.discount_price);
          vm.$set(vm, 'serviceTags', result.data.tags);
          vm.$set(vm, 'serviceUV', result.data.service_uv);
          vm.$set(vm, 'serviceImg', result.data.service_img);
          vm.$set(vm, 'serviceReason', result.data.service_reason);
          vm.$set(vm, 'serviceInfo', result.data.service_info);

          vm.$set(vm, 'shopId', result.data.shop_id);
          vm.$set(vm, 'shopName', result.data.shop_name);
          vm.$set(vm, 'shopLogo', result.data.shop_logo_url);
          vm.$set(vm, 'shopDesc', result.data.shop_desc);
          vm.$set(vm, 'shopAuth', result.data.shop_auth);

          Weixin.updateShare({
            title: vm.serviceName,
            link: window.location.href,
            imgUrl: vm.serviceImg
          });
        });
      }).catch(error => {
        next({path: '/404'});
        throw new Error(error);
      });
    });
  },
  watch: {
    $route(to, from) {
      Http.fetch('service/get_server_detail', {
        service_id: to.params.service_id
      }).then(response => {
        Http.resolve(response).then(result => {
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

          Weixin.updateShare({
            title: this.serviceName,
            link: window.location.href,
            imgUrl: this.serviceImg
          });
        }).catch(error => {
          this.$router.replace({path: '/404'});
          throw new Error(error);
        });
      });
    }
  },
  methods: {
    htmlpx2rem(value) {
      return Helper.htmlpx2rem(value);
    }
  }
};
</script>
