<template>
  <transition name="slide-left">
    <dl class="underline" @click="redirectTo(couponId)">
      <dt>
        <img v-lazy="couponLogo" :src="placeholder" :alt="couponName">
      </dt>
      <dd>
        <h4 class="t-bold"><span v-if="productName" class="rightline">{{productName}}</span>{{couponName}}</h4>
        <div class="item-info" v-if="shopName">
          <span :class="['shop-name', 'iconfont', shopAuth ? 'i-verified-aft' : '']">{{lang.shop}}{{shopName}}</span>
        </div>
        <div v-if="tags" class="tags clearfix">
          <span v-for="(tag, index) in tags" v-if="index < 3">{{tag.tag_name}}</span>
        </div>
        <span class="clicked">{{couponUv}} {{lang.clicked}}</span>
      </dd>
    </dl>
  </transition>
</template>

<script>
import placeholder from 'assets/x1_y1.png';
import {CHANNEL_CODE, AREA_CODE} from 'config';
import {translate} from 'methods';

const language = translate({
  'zh-cn': {
    clicked: '人领取',
    shop: '商家：'
  },
  'zh-tw': {
    clicked: '人領取',
    shop: '商家：'
  }
});

export default {
  props: ['couponId', 'couponName', 'couponLogo', 'couponUv', 'tags', 'shopId', 'shopName', 'shopAuth', 'productName'],
  data() {
    return {
      placeholder,
      lang: language
    };
  },
  methods: {
    redirectTo(couponId) {
      window.location.href = '/?channel=' + CHANNEL_CODE.channel_code + '&area=' + AREA_CODE.area_code + '#!coupon?id=' + couponId;
    }
  }
};
</script>
