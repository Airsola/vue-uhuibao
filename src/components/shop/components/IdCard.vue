<style lang="stylus" scoped>
.shop-card {
  border: solid 1px #eaeaea;
  padding: .1rem;
  border-radius: .02rem;
  & > dl {
    position: relative;
    min-height: .9rem;
    & > dt {
      position: absolute;
      left: 0;
      top: 0;
      width: .9rem;
      height: .9rem;
      & > img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    & > dd {
      margin-left: 1.1rem;
      position: relative;
      min-height: .9rem;
      & > h5 {
        font-size: .15rem;
        color: #222;
        line-height: .19rem;
        position: relative;
        top: -.03rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        display: box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        & > span {
          &:after {
            color: #2ebcff;
            margin-left: .05rem;
          }
        }
      }
      & > p {
        color: #999;
        font-size: .12rem;
        line-height: .18rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display:-webkit-box;
        display: box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      & > span {
        position: absolute;
        left: 0;
        bottom: 0;
        color: #2cbcff;
        line-height: .12rem;
        &:after {
          font-size: .1rem;
          margin-left: .03rem;
        }
      }
    }
  }
}

</style>
<template>
  <router-link :to="{name: 'shop:detail', params: {shop_id: shopId}}" class="shop-card" tag="div">
    <dl>
      <dt>
        <img v-lazy="shopLogo" :src="placeholder" :alt="shopName">
      </dt>
      <dd>
        <h5 class="t-bold">
          <span :class="['iconfont', shopAuth ? 'i-verified-aft' : '']">{{shopName}}</span>
        </h5>
        <p>{{shopDesc}}</p>
        <span class="iconfont i-arrow-right-aft">{{lang.goToSee}}</span>
      </dd>
    </dl>
  </router-link>
</template>

<script>
import {translate} from 'methods';
import placeholder from 'assets/x1_y1.png';

const language = translate({
  'zh-cn': {
    goToSee: '进去逛逛'
  },
  'zh-tw': {
    goToSee: '進去逛逛'
  }
});

export default {
  props: ['shopId', 'shopName', 'shopLogo', 'shopDesc', 'shopAuth'],
  data() {
    return {
      placeholder,
      lang: language
    };
  }
};
</script>
