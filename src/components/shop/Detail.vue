<style lang="sass" scoped>
.shop-info {
  & > img {
    width: .9rem;
    height: .9rem;
    position: absolute;
  }
  & > .info-content {
    margin-left: 1.1rem;
    min-height: .9rem;
    & > h4 {
      font-size: .15rem;
      color: #222;
      line-height: .21rem;
      position: relative;
      top: -.03rem;
      overflow: hidden;
      text-overflow: ellipsis;
      & > i {
        margin-left: .04rem;
        &.i-verified-aft {
          color: #2ebcff;
          font-size: .13rem;
        }
        &.i-coupon-aft {
          background-color: #6fe264;
        }
        &.i-signal-aft {
          background-color: #00ddd3;
        }
      }
    }
    & > p {
      padding: .06rem 0 .08rem;
      line-height: .2rem;
      word-break: break-all;
    }
  }
}
.shop-info>.info-content>h4>i.i-coupon-aft,.shop-info>.info-content>h4>i.i-signal-aft {
  width: .17rem;
  height: .17rem;
  display: inline-block;
  line-height: .17rem;
  text-align: center;
  border-radius: .02rem;
  position: relative;
}
.shop-info>.info-content>h4>i.i-coupon-aft:after,.shop-info>.info-content>h4>i.i-signal-aft:after {
  font-size: .11rem;
  color: #fff;
  width: 100%;
  height: 100%;
  position: relative;
  top: -.01rem;
}
.shop-album {
  padding-top: .2rem;
  & > ul {
    & > li {
      float: left;
      width: 1.05rem;
      height: .8rem;
      &:nth-of-type(2) {
        margin: 0 .1rem;
      }
      & > a {
        background-color: #f6f6f6;
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        & > img {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          transition: transform .3s ease;
          &.normal {
            min-height: 100%;
            min-width: 100%;
          }
          &.portrait {
            width: 100%;
          }
          &.landscape {
            height: 100%;
          }
        }
      }
    }
  }
}
.shop-album>ul>li>a,.shop-album>ul>li>a>img {
  display: block;
}
.info-content {
  & > .pay-type {
    height: .16rem;
    line-height: .16rem;
    & > * {
      float: left;
    }
    & > i {
      height: .16rem;
      display: inline-block;
      background-repeat: no-repeat;
      background-position: 0 0;
      background-size: auto 100%;
      margin-right: .04rem;
      &.alipay {
        width: .16rem;
        background-image: url(../../assets/images/pay_alipay.png);
        border-radius: .02rem;
      }
      &.weipay {
        width: .16rem;
        background-image: url(../../assets/images/pay_wxpay.png);
        border-radius: .02rem;
      }
      &.unionpay {
        width: .26rem;
        background-image: url(../../assets/images/pay_union.png);
      }
      &.visa {
        width: .21rem;
        background-image: url(../../assets/images/pay_visa.png);
      }
      &.mastercard {
        width: .27rem;
        background-image: url(../../assets/images/pay_mastercard.png);
      }
    }
  }
}
.shop-contact {
  & > ul {
    & > li {
      border-bottom: solid 1px rgba(0,0,0,0.1);
      &:last-of-type {
        border-bottom: none;
      }
    }
  }
}
.shop-contact>ul>li>p,.shop-contact>ul>li>a {
  padding: .16rem .2rem;
  line-height: .18rem;
  font-size: .14rem;
  position: relative;
  display: block;
}
.shop-contact>ul>li>p:before,.shop-contact>ul>li>a:before {
  font-size: .15rem;
  color: #ccc;
  margin-right: .1rem;
}
.shop-contact>ul>li>p:last-of-type:after,.shop-contact>ul>li>a:last-of-type:after {
  position: absolute;
  right: .2rem;
  color: #ccc;
}

</style>
<template>
  <layout>
    <layout-header :title="shopName"></layout-header>
    <layout-body>
      <div class="shop-info ui-card ui-card-padd ui-card-underline ui-card-mar-btm">
        <img :src="shopLogo">
        <div class="info-content">
          <h4 class="t-bold">{{shopName}}<i v-if="shopAuth" class="iconfont i-verified-aft"></i><i v-if="couponList.length > 0" class="iconfont i-coupon-aft"></i><i v-if="taskList.length > 0" class="iconfont i-signal-aft"></i></h4>
          <p>{{shopDesc}}</p>
          <div v-if="payMethods.length > 0" class="pay-type">
            <span>{{lang.payMethod}}</span>
            <i v-for="method in payMethods" :class="payMethodClass[method]"></i>
          </div>
        </div>
        <div v-if="photoList.length > 0" class="shop-album clearfix">
          <ul>
            <li v-for="(item, index) in photoList">
              <router-link :to="{name: 'shop:album', params: {shop_id: shopId}}">
                <img :src="item.url" :class="item.scale" @load="imgResize($event, index)">
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <div class="shop-contact ui-card ui-card-overline ui-card-underline ui-card-mar-btm" v-if="shopAddress || shopMobile || shopLink || shopCount">
        <ul>
          <li v-if="shopAddress">
            <router-link v-if="shopMapLat && shopMapLng" :to="{name: 'shop:location', params: {shop_id: shopId}}" class="iconfont i-location-bfo">
              <span>{{shopAddress}}</span>
            </router-link>
            <p v-else class="iconfont i-location-bfo">{{shopAddress}}</p>
          </li>
          <li v-if="shopMobile">
            <a :href="'tel:' + shopMobile" class="iconfont i-telphone-bfo">{{shopMobile}}</a>
          </li>
          <li v-if="shopLink">
            <a :href="shopLink" class="iconfont i-link-bfo">{{shopLink}}</a>
          </li>
          <li v-if="shopCount > 0">
            <router-link :to="{name: 'shop:stores', params: {shop_id: shopId}}" class="iconfont i-store-bfo i-arrow-right-aft">{{lang.showBranchStore[0]}}{{shopCount}}{{lang.showBranchStore[1]}}</router-link>
          </li>
        </ul>
      </div>

      <service-list :shopId="shopId" :shopName="shopName" :shopAuth="shopAuth" :list="serviceList"></service-list>
      <coupon-list :shopId="shopId" :shopName="shopName" :shopAuth="shopAuth" :list="couponList"></coupon-list>
      <task-list :shopId="shopId" :shopName="shopName" :shopAuth="shopAuth" :list="taskList"></task-list>
      <news-list :shopId="shopId" :shopName="shopName" :shopAuth="shopAuth" :list="newsList"></news-list>
      <div class="clearfix"></div>
    </layout-body>
  </layout>
</template>

<script>
import {Layout, LayoutHeader, LayoutBody} from '../layout';
import ServiceList from './detail/ServiceList.vue';
import CouponList from './detail/CouponList.vue';
import TaskList from './detail/TaskList.vue';
import NewsList from './detail/NewsList.vue';

import {Http, LANG_TYPE, CHANNEL_CODE} from 'config';

const Language = {
  'zh-cn': {
    payMethod: '支持：',
    showBranchStore: ['查看全部', '家分店']
  },
  'zh-tw': {
    payMethod: '支持：',
    showBranchStore: ['查看全部', '家分店']
  }
};
const language = Language[LANG_TYPE];

export default {
  components: {
    Layout,
    LayoutHeader,
    LayoutBody,
    ServiceList,
    CouponList,
    TaskList,
    NewsList
  },
  data() {
    return {
      shopId: this.$route.params.shop_id,
      shopName: '',
      shopLogo: '',
      shopDesc: '',
      shopLink: '',
      shopAuth: false,
      shopMobile: '',
      shopAddress: '',
      shopCount: 0,
      payMethods: [],
      shopMapLng: '',
      shopMapLat: '',
      photoList: [],
      serviceList: [],
      taskList: [],
      couponList: [],
      newsList: [],
      payMethodClass: {
        1: 'alipay',
        2: 'weipay',
        3: 'unionpay',
        4: 'visa',
        5: 'mastercard',
        6: 'cash'
      },
      lang: language
    };
  },
  beforeRouteEnter(to, from, next) {
    Http.fetch('shop/get_shop_index', {
      shop_id: to.params.shop_id
    }, CHANNEL_CODE).then(response => {
      Http.resolve(response, (error, result) => {
        if (error) {
          next(false);
          throw result;
        } else {
          if (result.status === 1) {
            next(vm => {
              vm.$set(vm, 'shopName', result.data.shop_name);
              vm.$set(vm, 'shopLogo', result.data.shop_logo_url);
              vm.$set(vm, 'shopDesc', result.data.shop_desc);
              vm.$set(vm, 'shopLink', result.data.shop_link);
              vm.$set(vm, 'shopAuth', !!result.data.shop_auth);
              vm.$set(vm, 'shopMobile', result.data.shop_mobile);
              vm.$set(vm, 'shopAddress', result.data.shop_address);
              vm.$set(vm, 'shopCount', result.data.store_count);
              vm.$set(vm, 'payMethods', result.data.shop_payment_method.split(';'));

              vm.$set(vm, 'shopMapLng', result.data.shop_longitude);
              vm.$set(vm, 'shopMapLat', result.data.shop_latitude);

              if (result.data.images) {
                result.data.images.forEach(url => {
                  vm.photoList.push({
                    url,
                    scale: 'normal'
                  });
                });
              };

              if (result.data.servers) vm.$set(vm, 'serviceList', result.data.servers);
              if (result.data.tasks) vm.$set(vm, 'taskList', result.data.tasks);
              if (result.data.coupons) vm.$set(vm, 'couponList', result.data.coupons);
              if (result.data.articles) vm.$set(vm, 'newsList', result.data.articles);
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
    $route: function(to, from) {
      Http.fetch('shop/get_shop_index', {
        shop_id: to.params.shop_id
      }, CHANNEL_CODE).then(response => {
        Http.resolve(response, (error, result) => {
          if (error) {
            throw result;
          } else {
            if (result.status === 1) {
              this.$set(this, 'shopName', result.data.shop_name);
              this.$set(this, 'shopLogo', result.data.shop_logo_url);
              this.$set(this, 'shopDesc', result.data.shop_desc);
              this.$set(this, 'shopLink', result.data.shop_link);
              this.$set(this, 'shopAuth', !!result.data.shop_auth);
              this.$set(this, 'shopMobile', result.data.shop_mobile);
              this.$set(this, 'shopAddress', result.data.shop_address);
              this.$set(this, 'shopCount', result.data.store_count);
              this.$set(this, 'payMethods', result.data.shop_payment_method.split(';'));

              this.$set(this, 'shopMapLng', result.data.shop_longitude);
              this.$set(this, 'shopMapLat', result.data.shop_latitude);

              if (result.data.images) {
                result.data.images.forEach(url => {
                  this.photoList.push({
                    url,
                    scale: 'normal'
                  });
                });
              };

              if (result.data.servers) this.$set(this, 'serviceList', result.data.servers);
              if (result.data.tasks) this.$set(this, 'taskList', result.data.tasks);
              if (result.data.coupons) this.$set(this, 'couponList', result.data.coupons);
              if (result.data.articles) this.$set(this, 'newsList', result.data.articles);
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
    slideToggle: function(cateMenu, areaMenu) {
      this.showCateMenu = cateMenu;
      this.showAreaMenu = areaMenu;
    },
    imgResize: function(evt, index) {
      this.photoList[index].scale = evt.target.height >= evt.target.width ? 'portrait' : 'landscape';
    }
  }
};
</script>
