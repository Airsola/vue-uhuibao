<style lang="sass" scoped>
.generic-list {
  dl {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
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
    <dl class="underline" @click="redirectTo(couponId)">
      <dt>
        <img :src="couponLogo" :alt="couponName">
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
import {CHANNEL_CODE, AREA_CODE, LANG_TYPE} from 'config';

const Language = {
  'zh-cn': {
    clicked: '人领取',
    shop: '商家：'
  },
  'zh-tw': {
    clicked: '人領取',
    shop: '商家：'
  }
};
const language = Language[LANG_TYPE];

export default {
  props: ['couponId', 'couponName', 'couponLogo', 'couponUv', 'tags', 'shopId', 'shopName', 'shopAuth', 'productName'],
  data() {
    return {
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
