<style lang="sass" scoped>
.swiper-slide {
  img {
    display: block;
    width: 100%;
  }
}
.goods-info {
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
    &.goods-price {
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
}
.sale-bar {
  position: fixed;
  height: 0.49rem;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  &:before {
    background-color: rgba(0,0,0,0.05);
  }
  span {
    border-radius: 0.03rem;
    width: 0.8rem;
    height: 0.24rem;
    border: solid 1px #bfbfbf;
    position: absolute;
    left: 0.2rem;
    top: 0.12rem;
    overflow: hidden;
    font-size: 0.14rem;
    line-height: 0.24rem;
    text-align: center;
    i {
      width: 0.24rem;
      height: 0.24rem;
      position: absolute;
      top: 0;
      &:first-of-type {
        left: 0;
      }
      &:last-of-type {
        right: 0;
      }
      &:before {
        font-size: 0.1rem;
        color: #222;
        line-height: 1em;
        position: absolute;
        left: 50%;
        top: 50%;
        transition: color 0.2s ease;
        transform: translate(-50%, -50%);
      }
      &.disable {
        &:before {
          color: #ccc;
        }
      }
    }
  }
  b {
    display: block;
    border-left: solid 1px #bfbfbf;
    border-right: solid 1px #bfbfbf;
    margin: 0 auto;
    width: 0.32rem;
    height: 100%;
  }
  a {
    width: 1.2rem;
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    background-color: #ff7800;
    color: #fff;
    font-size: 0.16rem;
    text-align: center;
    line-height: 0.49rem;
    transition: background-color 0.2s ease, color 0.2s ease;
  }
}
</style>

<template>
  <layout>
    <layout-header :title="lang.title">
      <router-link :to="{name: 'user:order'}" slot="head:right" class="link">{{lang.myOrder}}</router-link>
    </layout-header>
    <layout-body :style="{paddingBottom: '.5rem'}">
      <div class="swiper-container" v-if="bannerList.length">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="item in bannerList">
            <img :src="item.img_url">
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
      <div class="ui-card ui-card-padd ui-card-underline ui-card-mar-btm">
        <div class="goods-info">
          <h4 class="t-bold">{{goodsName}}</h4>
          <span class="goods-price">
            {{lang.currencySymbol}}<b>{{goodsPrice}}</b>
          </span>
          <span class="clicked">{{lang.clicked}} {{goodsSellNum}}</span>
        </div>
      </div>
      <div class="ui-card ui-card-overline ui-card-underline ui-card-mar-btm">
        <div class="html-content ui-card-padd" v-html="htmlpx2rem(goodsDesc)"></div>
      </div>
      <div class="clearfix"></div>
      <div class="sale-bar overline">
        <span>
          <i :class="['iconfont', 'i-less-bfo', count <= 1 ? 'disable' : '']" @click="countLess"></i>
          <i :class="['iconfont', 'i-plus-bfo', count >= goodsStoreNum ? 'disable' : '']" @click="countPlus"></i>
          <b>{{count}}</b>
        </span>
        <a class="t-bold" v-if="goodsStoreNum" @click="submitOrder(goodsId, count)">{{lang.buyNow}}</a>
        <a class="t-bold" v-else>{{lang.storeEmpty}}</a>
      </div>
    </layout-body>
  </layout>
</template>

<script>
import {Layout, LayoutHeader, LayoutBody} from '../../../layout';

import Helper from 'helper';
import {Http, LANG_TYPE} from 'config';

const Language = {
  'zh-cn': {
    title: '商品详情',
    clicked: '已购买',
    currencySymbol: '￥',
    tooLittle: '购买数量至少为',
    tooMuch: '库存不足！',
    buyNow: '立即购买',
    storeEmpty: '已售罄'
  },
  'zh-tw': {
    title: '境外通讯卡',
    clicked: '已購買',
    currencySymbol: 'NT$',
    tooLittle: '購買數量至少為',
    tooMuch: '庫存不足！',
    buyNow: '立即購買',
    storeEmpty: '已售罄'
  }
};
const language = Language[LANG_TYPE];

export default {
  components: {
    Layout,
    LayoutHeader,
    LayoutBody
  },
  data() {
    return {
      bannerList: [],
      goodsId: 0,
      goodsName: '',
      goodsPrice: 0,
      goodsDesc: '',
      goodsSellNum: 0,
      goodsStoreNum: 0,
      count: 1,
      lang: language
    };
  },
  beforeRouteEnter(to, from, next) {
    Http.fetch('goods/detail', {
      goods_id: to.params.goods_id
    }).then(response => {
      Http.resolve(response, (error, result) => {
        if (error) {
          next(false);
          throw result;
        } else {
          if (result.status === 1) {
            next(vm => {
              vm.$set(vm, 'goodsId', result.data.goods_id);
              vm.$set(vm, 'goodsName', result.data.goods_name);
              vm.$set(vm, 'goodsPrice', result.data.goods_price);
              vm.$set(vm, 'goodsDesc', result.data.goods_desc);
              vm.$set(vm, 'goodsSellNum', parseInt(result.data.sell_num));
              vm.$set(vm, 'goodsStoreNum', parseInt(result.data.store_num));
              vm.$set(vm, 'bannerList', result.data.goods_imgs_list);
            });
          } else {
            next({path: '/404'});
            throw result.msg;
          };
        };
      });
    });
  },
  watch: {
    $route(to, from) {
      Http.fetch('goods/detail', {
        goods_id: to.params.goods_id
      }).then(response => {
        Http.resolve(response, (error, result) => {
          if (error) {
            throw result;
          } else {
            if (result.status === 1) {
              this.$set(this, 'goodsId', result.data.goods_id);
              this.$set(this, 'goodsName', result.data.goods_name);
              this.$set(this, 'goodsPrice', result.data.goods_price);
              this.$set(this, 'goodsDesc', result.data.goods_desc);
              this.$set(this, 'goodsSellNum', parseInt(result.data.sell_num));
              this.$set(this, 'goodsStoreNum', parseInt(result.data.store_num));
              this.$set(this, 'bannerList', result.data.goods_imgs_list);
            } else {
              this.$router.replace({path: '/404'});
              throw result.msg;
            };
          };
        });
      });
    }
  },
  methods: {
    htmlpx2rem(html) {
      return Helper.htmlpx2rem(html);
    },
    countLess() {
      if (this.count <= 1) return this.$message(language.tooLittle + '1');
      this.count --;
    },
    countPlus() {
      if (this.count >= this.goodsStoreNum) return this.$message(language.tooMuch + this.goodsStoreNum);
      this.count ++;
    },
    submitOrder(goodsId, count) {
      this.$router.push({
        name: 'market:store@szair:order',
        params: {
          goods_id: goodsId,
          count
        }
      });
    }
  }
};
</script>
