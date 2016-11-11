<template>
  <transition name="slide-left">
    <router-link :to="{name: 'news:detail', params: {news_id: newsId}}" tag="dl" class="underline">
      <dt>
        <img v-lazy="newsLogo" :src="placeholder" :alt="newsName">
      </dt>
      <dd>
        <h4 class="t-bold"><span v-if="productName" class="rightline">{{productName}}</span>{{newsName}}</h4>
        <div v-if="shopName" class="item-info">
          <span :class="['shop-name', 'iconfont', shopAuth ? 'i-verified-aft' : '']">{{lang.shop}}{{shopName}}</span>
        </div>
        <div v-if="tags" class="tags clearfix">
          <span v-for="(tag, index) in tags" v-if="index < 3">{{tag.tag_name}}</span>
        </div>
        <span v-if="newsDate" class="publish-time iconfont i-clock-bfo">{{newsDate}}</span>
        <span class="clicked">{{newsUv}} {{lang.clicked}}</span>
      </dd>
    </router-link>
  </transition>
</template>

<script>
import placeholder from 'assets/x1_y1.png';
import {translate} from 'methods';

const language = translate({
  'zh-cn': {
    clicked: '人阅读',
    shop: '商家：'
  },
  'zh-tw': {
    clicked: '人閱讀',
    shop: '商家：'
  }
});

export default {
  props: ['newsId', 'newsName', 'newsLogo', 'newsDate', 'newsUv', 'tags', 'shopId', 'shopName', 'shopAuth', 'productName'],
  data() {
    return {
      placeholder,
      lang: language
    };
  }
};
</script>
