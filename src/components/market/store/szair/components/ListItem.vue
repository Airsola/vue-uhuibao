<style lang="stylus" scoped>
.generic-list {
  dl {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
    & > dd {
      & > .service-price {
        bottom: 0;
      }
    }
  }
}
.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(30px, 0);
}
.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-30px, 0);
}

</style>

<template>
  <transition name="slide-left">
    <router-link :to="{name: 'market:store@szair:detail', params: {goods_id: goodsId}}" tag="dl" class="underline">
      <dt>
        <img v-lazy="goodsLogo" :src="placeholder" :alt="goodsName"></img>
      </dt>
      <dd>
        <h4 class="t-bold"><span v-if="productName" class="rightline">{{productName}}</span>{{goodsName}}</h4>
        <div v-if="shopName" class="item-info">
          <span :class="['shop-name', 'iconfont', shopAuth ? 'i-verified-aft' : '']">{{lang.shop}}{{shopName}}</span>
        </div>
        <span class="service-price">
          {{lang.currencySymbol}}<b>{{goodsPrice}}</b>
        </span>
        <slot>
          <span class="clicked">{{lang.clicked}} {{goodsUv}}</span>
        </slot>
      </dd>
    </router-link>
  </transition>
</template>

<script>
import placeholder from 'assets/x1_y1.png';
import {translate} from 'methods';

const language = translate({
  'zh-cn': {
    clicked: '已购买',
    shop: '商家：',
    currencySymbol: '￥'
  },
  'zh-tw': {
    clicked: '人閱讀',
    shop: '商家：',
    currencySymbol: 'NT$'
  }
});

export default {
  props: ['goodsId', 'goodsName', 'goodsLogo', 'goodsPrice', 'goodsUv', 'tags', 'shopId', 'shopName', 'shopAuth', 'productName'],
  data() {
    return {
      lang: language,
      placeholder
    };
  }
};
</script>
