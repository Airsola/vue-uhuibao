<style lang="sass" scoped>
.form-table {
  & > li {
    position: relative;
    & > label {
      display: block;
      padding: 0.16rem 0 0.16rem 0.3rem;
      height: 0.16rem;
      position: relative;
      &.short {
        margin-right: 1rem;
      }
      &:before {
        font-size: 0.16rem;
        color: #c7d1da;
        line-height: 1em;
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -0.5em;
      }
      & > input {
        border: none;
        height: 0.16rem;
        width: 100%;
        line-height: 0.16rem;
        font-size: 0.14rem;
      }
    }
    & > span {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      line-height: 0.3rem;
      padding: 0 0.1rem;
      font-size: 0.14rem;
      border-radius: 0.03rem;
      background-color: #2dbcff;
      color: #fff;
      z-index: 1;
      &.disabled {
        background-color: #f2f2f2;
        color: #ccc;
      }
    }
  }
}
.form-submit {
  & > a {
    border-radius: 0.03rem;
    margin-top: 0.2rem;
    display: block;
    line-height: 0.4rem;
    text-align: center;
    color: #666;
    border: solid 1px #f0f0f0;
    font-size: 0.14rem;
    &.important {
      background-color: #2dbcff;
      color: #fff;
      border: none;
    }
    &.disabled {
      background-color: #eee;
      color: #ccc;
      text-shadow: 1px 1px 0 rgba(255,255,255,0.3);
      border: none;
    }
  }
}
.address-info {
  & > h5 {
    padding: 0.16rem 0.2rem;
    line-height: 0.18rem;
    font-size: 0.14rem;
  }
  li {
    position: relative;
    padding: 0.15rem 0.2rem;
    &:last-of-type {
      &:after {
        display: none;
      }
    }
    & > a {
      display: block;
    }
    h5 {
      font-size: 0.16rem;
      line-height: 0.22rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      display: box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    a {
      padding-left: 0.25rem;
      position: relative;
      font-size: 0.14rem;
      line-height: 0.24rem;
      min-height: 0.24rem;
      &:first-of-type {
        margin-top: 0.1rem;
      }
      &:before {
        font-size: 0.15rem;
        color: #ccc;
        position: absolute;
        left: 0;
      }
    }
  }
  .map-nav-img {
    display: block;
    width: 100%;
  }
}
.sale-bar {
  position: fixed;
  height: 0.49rem;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  z-index: 2;
  &:before {
    background-color: rgba(0,0,0,0.05);
  }
  span {
    position: absolute;
    left: 0.2rem;
    top: 50%;
    line-height: 0.24rem;
    margin-top: -0.12rem;
    font-size: 0.14rem;
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
    <layout-header :title="lang.title" :search="false"></layout-header>
    <layout-body :style="{paddingBottom: '.5rem'}">
      <div class="goods-info ui-card ui-card-underline ui-card-mar-btm">
        <div class="generic-list">
          <list-item :goodsId="goodsId" :goodsName="goodsName" :goodsLogo="goodsLogo" :goodsPrice="goodsPrice">
            <span class="clicked">{{lang.orderCount[0]}} {{goodsCount}} {{lang.orderCount[1]}}</span>
          </list-item>
        </div>
      </div>
      <div class="goods-info ui-card ui-card-padd ui-card-overline ui-card-underline ui-card-mar-btm">
        <ul class="form-table">
          <li class="underline">
            <label class="iconfont i-ucenter-bfo">
              <input :placeholder="lang.typeUserName" v-model="username" type="text">
            </label>
          </li>
          <li class="underline">
            <label class="iconfont i-cellphone-bfo">
              <input :placeholder="lang.typePhoneNumber" @keyup="syncTelphone($event)" :value="formated" type="text" maxlength="13">
            </label>
          </li>
          <li class="underline">
            <label class="iconfont i-verify-bfo short">
              <input v-model="verifycode" :placeholder="lang.typeVerifyCode" type="text" maxlength="4">
            </label>
            <span v-if="timeout === 0 && !msgSending" @click="sendMsgAction(telphone)">{{lang.getVerifyCode}}</span>
            <span v-if="timeout === 0 && msgSending" class="disabled">{{lang.verifyCodeSending}}</span>
            <span v-if="timeout > 0 && !msgSending" class="disabled">{{timeout}}{{lang.waitSendVerifyCodeAgain}}</span>
          </li>
        </ul>
      </div>
      <div class="address-info ui-card ui-card-overline ui-card-underline ui-card-mar-btm">
        <h5 class="t-bold ui-card-underline">{{lang.getSIMAddress}}</h5>
        <ul>
          <li class="underline">
            <h5 class="t-bold">{{lang.addressName}}</h5>
            <a class="iconfont i-location-bfo">{{lang.addressDetail}}</a>
            <a class="iconfont i-telphone-bfo" href="tel:0755-23451892">0755-23451892</a>
          </li>
        </ul>
      </div>
      <div class="address-info ui-card ui-card-overline ui-card-underline ui-card-mar-btm">
        <h5 class="t-bold ui-card-underline">{{lang.mapNav}}</h5>
        <figure class="ui-card-padd">
          <img :src="mapNavImg" class="map-nav-img">
        </figure>
      </div>
      <div class="clearfix"></div>
      <div class="sale-bar overline">
        <span>{{lang.orderTotal}}<em>￥<b>{{goodsPrice}}</b></em></span>
        <a v-if="codeVerifying" class="t-bold disable">{{lang.orderSubmiting}}</a>
        <a v-else class="t-bold" @click="submitOrder(goodsId, goodsCount, username, telphone, verifycode)">{{lang.submitOrder}}</a>
      </div>
    </layout-body>
  </layout>
</template>

<script>
import {Layout, LayoutHeader, LayoutBody} from '../../../layout';
import ListItem from './components/ListItem.vue';

import Helper from 'helper';
import {Http, LANG_TYPE, CHANNEL_CODE, AREA_CODE} from 'config';
import mapNavImg from 'assets/images/szair/location.jpg';

const Language = {
  'zh-cn': {
    title: '填写领取信息',
    typeUserName: '请输入领卡人姓名',
    typePhoneNumber: '请输入手机号码',
    typeVerifyCode: '请输入验证码',
    getVerifyCode: '获取验证码',
    verifyCodeSending: '验证信息发送中…',
    waitSendVerifyCodeAgain: '秒后重新获取',
    getSIMAddress: '领卡地点',
    addressName: '深圳宝安国际机场',
    addressDetail: '深圳市宝安国际机场T3航站楼5号门，E岛深航柜处',
    mapNav: '地图导航',
    orderCount: ['共', '张'],
    orderTotal: '合计：',
    submitOrder: '提交订单',
    orderSubmiting: '订单提交中…',
    noTypeUserName: '请输入领卡人姓名！',
    noTypePhoneNumber: '嘿，要先输入手机号码！',
    phoneNumberError: '亲，手机号码写错了，改一改！',
    noTypeVerifyCode: '请输入短信验证码！',
    verifyCodeError: '验证码为四位数字',
    verifyCodeSendSuccess: '验证信息已经发送至该手机号码',
    orderSuccess: '订单提交成功，即将跳转到订单详情！'
  },
  'zh-tw': {
    title: '填寫領取信息',
    typeUserName: '請輸入領卡人姓名',
    typePhoneNumber: '請輸入手機號碼',
    typeVerifyCode: '請輸入驗證碼',
    getVerifyCode: '獲取驗證碼',
    verifyCodeSending: '驗證信息發送中…',
    waitSendVerifyCodeAgain: '秒後重新獲取',
    getSIMAddress: '領卡地點',
    addressName: '深圳寶安國際機場',
    addressDetail: '深圳市寶安國際機場T3航站樓5號門，E島深航櫃處',
    mapNav: '地圖導航',
    orderCount: ['共', '張'],
    orderTotal: '合計：',
    submitOrder: '提交訂單',
    orderSubmiting: '訂單提交中…',
    noTypeUserName: '請輸入領卡人姓名！',
    noTypePhoneNumber: '嘿，要先輸入手機號碼！ ',
    phoneNumberError: '親，手機號碼寫錯了，改一改！ ',
    noTypeVerifyCode: '請輸入短信驗證碼！ ',
    verifyCodeError: '驗證碼為四位數字',
    verifyCodeSendSuccess: '驗證信息已經發送至該手機號碼',
    orderSuccess: '訂單提交成功，即將跳轉到訂單詳情！'
  }
};
const language = Language[LANG_TYPE];
const TWPhoneRegex = new RegExp('^09(\\d{8})$');
const isTWPhone = function(string) {
  return TWPhoneRegex.test(string);
};

export default {
  components: {
    Layout,
    LayoutHeader,
    LayoutBody,
    ListItem
  },
  data() {
    return {
      goodsId: 0,
      goodsName: '',
      goodsLogo: '',
      goodsPrice: 0,
      goodsCount: 0,
      mapNavImg,
      username: '',
      telphone: '',
      formated: '',
      verifycode: '',
      timeout: 0,
      timer: null,
      msgSending: false,
      codeVerifying: false,
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
              vm.$set(vm, 'goodsLogo', result.data.img_url);
              vm.$set(vm, 'goodsCount', to.params.count);
              vm.$set(vm, 'goodsPrice', to.params.count * result.data.goods_price);
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
              this.$set(this, 'goodsLogo', result.data.img_url);
              this.$set(this, 'goodsCount', to.params.count);
              this.$set(this, 'goodsPrice', to.params.count * result.data.goods_price);
            } else {
              this.$router.replace({path: '/404'});
              throw result.msg;
            };
          };
        });
      });
    },
    telphone(newVal) {
      this.formated = Helper.formatStr(newVal, newVal.slice(0, 2) === '09' ? 'xx;xxxx;xxxx' : 'xxx;xxxx;xxxx');
    }
  },
  methods: {
    syncTelphone(evt) {
      this.telphone = evt.target.value.replace(/ /g, '');
    },
    sendMsgAction(telphone) {
      if (this.msgSending) return;

      if (!telphone) return this.$message(language.noTypePhoneNumber);
      if (!Helper.is('cell', telphone) && !isTWPhone(telphone)) return this.$message(language.phoneNumberError);

      this.msgSending = true;

      Http.fetch('common/send_code', {
        mobile: telphone,
        type: 5
      }).then(response => {
        this.msgSending = false;

        Http.resolve(response, (error, result) => {
          if (error) {
            throw result;
          } else {
            if (result.status === 0) {
              this.$message(result.msg);
            } else {
              this.$message(language.verifyCodeSendSuccess);
              this.timeout = 60;
              this.timer = window.setInterval(() => {
                this.timeout --;
                if (this.timeout === 0) window.clearInterval(this.timer);
              }, 1000);
            };
          };
        });
      });
    },
    submitOrder(goodsId, goodsCount, username, telphone, verifycode) {
      if (this.codeVerifying) return;

      if (!username) return this.$message(language.noTypeUserName);
      if (!telphone) return this.$message(language.noTypePhoneNumber);
      if (!Helper.is('cell', telphone) && !isTWPhone(telphone)) return this.$message(language.phoneNumberError);
      if (!verifycode) return this.$message(language.noTypeVerifyCode);
      if (!Helper.is('integer', verifycode) || verifycode.length !== 4) return this.$message(language.verifyCodeError);

      this.codeVerifying = true;

      Http.fetch('goods/order', {
        good_id: goodsId,
        count: goodsCount,
        user_name: username,
        phone: telphone,
        code: verifycode,
        addr: '深圳宝安机场T3航站楼5号门，E道深航柜处',
        pay_type: Helper.UA.isBrowser('wechat') ? 'weixin' : 'alipay'
      }, CHANNEL_CODE).then(response => {
        this.codeVerifying = false;

        Http.resolve(response, (error, result) => {
          if (error) {
            throw result;
          } else {
            if (result.status === 0) {
              this.$message(result.msg);
            } else {
              this.$notice(language.orderSuccess, {
                container: this.$el,
                onShow: () => {
                  this.$root.$emit('blur:toggle');
                },
                onHide: () => {
                  this.$root.$emit('blur:toggle');
                  window.location.href = '/?channel=' + CHANNEL_CODE.channel_code + '&area=' + AREA_CODE.area_code + '#!ucenter/order?id=' + result.data.order_number;
                }
              });
            };
          };
        });
      });
    }
  }
};
</script>
