<template>
  <transition name="slide-left">
    <dl class="underline" @click="redirectTo(serviceType, serviceLink, serviceId, shopId)">
      <dt>
        <img v-lazy="serviceLogo" :src="placeholder" :alt="serviceName">
        <span v-if="discountPrice && discountTag">{{discountTag}}</span>
      </dt>
      <dd>
        <h4 :class="['t-bold', servicePrice && serviceName.length > 11 ? 'single-row' : '']"><span v-if="productName" class="rightline">{{productName}}</span>{{serviceName}}</h4>
        <div class="item-info">
          <span :class="['shop-name', 'iconfont', shopAuth ? 'i-verified-aft' : '']">{{lang.shop}}{{shopName}}</span>
        </div>
        <span class="service-price" v-if="discountPrice">
          {{lang.currencySymbol}}<b>{{discountPrice}}</b><s>{{lang.currencySymbol}}<i>{{servicePrice}}</i></s>
        </span>
        <span class="service-price" v-else>
          {{lang.currencySymbol}}<b>{{servicePrice}}</b>
        </span>
        <div class="tags clearfix" v-if="tags">
          <span v-for="tag in tags">{{tag.tag_name}}</span>
        </div>
        <span class="clicked">{{serviceUv}} {{lang.clicked}}</span>
      </dd>
    </dl>
  </transition>
</template>

<script>
import placeholder from 'assets/x1_y1.png';
import {CHANNEL_CODE} from 'config';
import {Http, translate} from 'methods';

const language = translate({
  'zh-cn': {
    shop: '商家：',
    clicked: '人浏览',
    currencySymbol: '￥'
  },
  'zh-tw': {
    shop: '商家：',
    clicked: '人瀏覽',
    currencySymbol: 'NT$'
  }
});

export default {
  props: ['serviceId', 'serviceName', 'serviceLogo', 'discountTag', 'serviceType', 'serviceLink', 'discountPrice', 'servicePrice', 'serviceUv', 'tags', 'shopId', 'shopName', 'shopAuth', 'productName'],
  methods: {
    redirectTo(type, url, serviceId, shopId) {
      if (type === 1) {
        this.$router.push({
          name: 'service:detail',
          params: {
            service_id: serviceId
          }
        });
      } else if (type === 0 && url) {
        Http.fetch('common/log', {
          service_id: serviceId,
          shop_id: shopId
        }, CHANNEL_CODE).then(response => {
          Http.resolve(response).then(result => {
            window.location.href = url;
          }).catch(error => {
            throw new Error(error);
          });
        });
      };
    }
  },
  data() {
    return {
      placeholder,
      lang: language
    };
  }
};
</script>
