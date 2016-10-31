<style scoped>
  .shop-card{border:solid 1px #eaeaea;padding:.1rem;border-radius:.02rem;}
  .shop-card>dl{position:relative;min-height:.9rem;}
  .shop-card>dl>dt{position:absolute;left:0;top:0;width:.9rem;height:.9rem;}
  .shop-card>dl>dt>img{width:100%;height:100%;display:block;}
  .shop-card>dl>dd{margin-left:1.1rem;position:relative;min-height:.9rem;}
  .shop-card>dl>dd>h5{font-size:.15rem;color:#222;line-height:.19rem;position:relative;top:-.03rem;
    overflow:hidden;
    text-overflow:ellipsis;
    display:-webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;
  }
  .shop-card>dl>dd>h5>span:after{color:#2ebcff;margin-left:.05rem;}
  .shop-card>dl>dd>p{color:#999;font-size:.12rem;line-height:.18rem;
    overflow:hidden;
    text-overflow:ellipsis;
    display:-webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;
  }
  .shop-card>dl>dd>span{position:absolute;left:0;bottom:0;color:#2cbcff;line-height:.12rem;}
  .shop-card>dl>dd>span:after{font-size:.1rem;margin-left:.03rem;}
</style>
<template>
  <router-link :to="{name: 'shop:detail', params: {shop_id: shopId}}" class="shop-card" tag="div">
    <dl>
      <dt>
        <img :src="shopLogo" :alt="shopName">
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
import {LANG_TYPE} from 'config';

const Language = {
  'zh-cn': {
    goToSee: '进去逛逛'
  },
  'zh-tw': {
    goToSee: '進去逛逛'
  }
};
const language = Language[LANG_TYPE];

export default {
  props: ['shopId', 'shopName', 'shopLogo', 'shopDesc', 'shopAuth'],
  data() {
    return {
      lang: language
    };
  }
};
</script>
