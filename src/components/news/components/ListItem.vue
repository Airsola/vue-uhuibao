<style lang="stylus" scoped>
.generic-list
  dl
    transition all .5s cubic-bezier(.55,0,.1,1)
.slide-left-enter, .slide-right-leave-active
  opacity 0
  transform translate(30px, 0)
.slide-left-leave-active, .slide-right-enter
  opacity 0
  transform translate(-30px, 0)
</style>

<template>
  <transition name="slide-left">
    <router-link :to="{name: 'news:detail', params: {news_id: newsId}}" tag="dl" class="underline">
      <dt>
        <img :src="newsLogo" :alt="newsName" :placeholder="placeholder"></img>
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
import placeholder from 'assets/images/x1_y1.png';
import {LANG_TYPE} from 'config';

const Language = {
  'zh-cn': {
    clicked: '人阅读',
    shop: '商家：'
  },
  'zh-tw': {
    clicked: '人閱讀',
    shop: '商家：'
  }
};
const language = Language[LANG_TYPE];

export default {
  props: ['newsId', 'newsName', 'newsLogo', 'newsDate', 'newsUv', 'tags', 'shopId', 'shopName', 'shopAuth', 'productName'],
  data() {
    return {
      lang: language,
      placeholder
    };
  }
};
</script>
