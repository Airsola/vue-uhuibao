<style lang="stylus" scoped>
li {
  position: relative;
  padding: .15rem .2rem;
  &:last-of-type {
    &:after {
      display: none;
    }
  }
  & > a {
    display: block;
  }
  h5 {
    font-size: .16rem;
    line-height: .22rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    display: box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  a {
    padding-left: .25rem;
    position: relative;
    font-size: .14rem;
    line-height: .24rem;
    min-height: .24rem;
    &:first-of-type {
      margin-top: .1rem;
    }
    &:before {
      font-size: .15rem;
      color: #ccc;
      position: absolute;
      left: 0;
    }
  }
}
</style>
<template>
  <li class="underline">
    <h5 class="t-bold">{{storeName}}</h5>
    <router-link :to="{name: 'shop:location@store', params: {shop_id: shopId, store_id: storeId}}" v-if="storeAddress" class="iconfont i-location-bfo">{{storeAddress}}</router-link>
    <a v-if="storeTelphone" :href="'tel:' + storeTelphone" class="iconfont i-telphone-bfo">{{storeTelphone}}</a>
  </li>
</template>

<script>
import {LANG_TYPE} from 'config';

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
  props: ['shopId', 'storeId', 'storeName', 'storeAddress', 'storeTelphone'],
  data() {
    return {
      lang: language
    };
  }
};
</script>
