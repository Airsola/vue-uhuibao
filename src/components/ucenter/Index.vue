<style lang="stylus" scoped>
  .page-container{padding-bottom:.6rem;}

  .m-userInfo{margin-top:0;border-top:none;padding-bottom:.15rem;}
  .m-userInfo>dl{height:.5rem;}
  .m-userInfo>dl>dt,.m-userInfo>dl>dt>a{width:.5rem;height:.5rem;}
  .m-userInfo>dl>dt{position:absolute;}
  .m-userInfo>dl>dt>a,.m-userInfo>dl>dt>a>img{display:block;border-radius:50%;overflow:hidden;}
  .m-userInfo>dl>dt>a>img{width:100%;height:100%;}
  .m-userInfo>dl>dd{margin-left:.7rem;position:relative;min-height:.5rem;}
  .m-userInfo>dl>dd>h4{font-size:.16rem;display:block;}
  .m-userInfo>dl>dd>h4>a{color:#222;}
  .m-userInfo>dl>dd>span,.m-userInfo>dl>dd>a{position:absolute;}
  .m-userInfo>dl>dd>span{color:#222;bottom:0;left:0;font-size:.13rem;}
  .m-userInfo>dl>dd>a{color:#bfbfbf;right:0;top:0;font-size:.12rem;}
  .m-userInfo>dl>dd>a:after{font-size:.1rem;color:#ddd;margin-left:.05rem;
    transform:rotate(180deg);
    -webkit-transform:rotate(180deg);
  }

  .m-taskList{padding:0;}
  .m-taskList>ul>li{position:relative;line-height:.18rem;padding:0 .45rem;border-bottom:solid 1px #f5f5f5;}
  .m-taskList>ul>li:last-of-type{border-bottom:none;}
  .m-taskList>ul>li,.m-taskList>ul>li>a{color:#222;font-size:.14rem;}
  .m-taskList>ul>li>a{padding:.16rem 0;display:block;position:relative;}
  .m-taskList>ul>li>a>b.new-coupon{height:.2rem;line-height:.2rem;padding:0 .1rem;border-radius:.1rem;background-color:#ff7800;color:#fff;font-size:.12rem;position:absolute;right:0;top:50%;margin-top:-.1rem;}
  .m-taskList>ul>li>a>b.new-order{width:.1rem;height:.1rem;border-radius:50%;background-color:#ff7800;display:block;position:absolute;right:0;top:50%;margin-top:-.05rem;}
  .m-taskList>ul>li:before{font-size:.16rem;line-height:1em;color:#2cbcff;display:block;position:absolute;left:.2rem;top:50%;margin-top:-.08rem;}
  .m-taskList>ul>li:after{font-size:.14rem;color:#ddd;display:block;position:absolute;right:.175rem;top:50%;margin-top:-.08rem;}

  .logout{padding:0;}
  .logout>a{line-height:.48rem;font-size:.14rem;text-align:center;display:block;}
</style>
<template>
  <layout>
    <layout-header :title="lang.title"></layout-header>
    <layout-body>
      <div class="user-info">
        <dl>
          <dt>
            <a>
              <img src="avatar.jpg">
            </a>
          </dt>
          <dd>
            <h4 class="t-bold">
              <a v-if="userNickName" href="/#!ucenter/modifynickname">{{userNickName}}</a>
              <a v-else href="/#!ucenter/modifynickname">{{lang.setNickname}}</a>
            </h4>
            <span>{{lang.myFlowCoin}}<b>{{flowCoin}}</b></span>
            <a href="/#!ucenter/modifypass" class="iconfont i-arrow-right-aft">{{lang.modifyPassword}}</a>
          </dd>
        </dl>
      </div>
      <div class="m-taskList g-segment">
        <ul>
          <li class="coupon iconfont i-coupon-bfo i-arrow-right-aft">
            <a href="/#!ucenter/coupon">{{lang.myCoupon}}<b class="new-coupon" v-if="couponCount">{{couponCount}}</b></a>
          </li>
          <li class="checkin iconfont i-checkin-bfo i-arrow-right-aft">
            <a href="/#!taoflow/ucenter/checkin">{{lang.checkinTask}}</a>
          </li>
          <li class="collect iconfont i-collect-bfo i-arrow-right-aft">
            <a href="/#!ucenter/collect">{{lang.myCollect}}</a>
          </li>
          <li class="exchange iconfont i-flow-bfo i-arrow-right-aft">
            <a href="/#!taoflow/ucenter/exchange">{{lang.flowExchange}}</a>
          </li>
          <li class="archives iconfont i-flow-log-bfo i-arrow-right-aft">
            <a href="/#!taoflow/ucenter/archives">{{lang.flowArchives}}</a>
          </li>
          <li class="sim iconfont i-sim-bfo i-arrow-right-aft">
            <a href="/#!sim">{{lang.mySim}}</a>
          </li>
          <li class="sim iconfont i-order-bfo i-arrow-right-aft">
            <a href="/#!ucenter/order">{{lang.myOrder}}<b class="new-order" v-if="orderCount">{{orderCount}}</b></a>
          </li>
          <li class="sim iconfont i-location-bfo i-arrow-right-aft">
            <a href="/#!ucenter/express">{{lang.myExpress}}</a>
          </li>
        </ul>
      </div>
      <div class="logout">
        <a>{{lang.logout}}</a>
      </div>
    </layout-body>
    <layout-footer></layout-footer>
  </layout>
</template>

<script>
import {Layout, LayoutHeader, LayoutBody, LayoutFooter} from '../layout';
import {Http, LANG_TYPE, USER_AUTH} from 'config';
import avatarImg from 'assets/images/avatar.jpg';

const Language = {
  'zh-cn': {
    title: '我的',
    setNickname: '设置昵称',
    myFlowCoin: '我的流量币：',
    modifyPassword: '修改密码',
    myCoupon: '我的卡券',
    checkinTask: '每日签到',
    myCollect: '我的收藏',
    flowExchange: '流量兑换',
    flowArchives: '流量记录',
    mySim: '我的上网卡',
    myOrder: '我的订单',
    myExpress: '我的收货地址',
    logout: '退出登录',
    logouting: '注销中…',
    logoutSuccess: '登录注销成功，即将跳转到首页'
  },
  'zh-tw': {
    title: '我的',
    setNickname: '設置暱稱',
    myFlowCoin: '我的流量幣：',
    modifyPassword: '修改密碼',
    myCoupon: '我的卡券',
    checkinTask: '每日簽到',
    myCollect: '我的收藏',
    flowExchange: '流量兌換',
    flowArchives: '流量記錄',
    mySim: '我的上網卡',
    myOrder: '我的訂單',
    myExpress: '我的收貨地址',
    logout: '退出登錄',
    logouting: '註銷中…',
    logoutSuccess: '登錄註銷成功，即將跳轉到首頁'
  }
};
const language = Language[LANG_TYPE];

export default {
  components: {
    Layout,
    LayoutHeader,
    LayoutBody,
    LayoutFooter
  },
  data() {
    return {
      userAvatar: avatarImg,
      userNickName: '',
      flowCoin: 0,
      couponCount: 0,
      orderCount: 0,
      lang: language
    };
  },
  beforeRouteEnter: function(to, from, next) {
    if (USER_AUTH.user_auth === false) {
      next({name: 'passport:signin'});
      return;
    };

    Http.fetch('api/get_user_info').then(response => {
      Http.resolve(response, (error, result) => {
        if (error) {
          next(false);
          throw result;
        } else {
          if (result.status === 1) {
            next(vm => {
              vm.$set(vm, 'userAvatar', result.data.service_name);
              vm.$set(vm, 'userNickName', result.data.service_price);
              vm.$set(vm, 'flowCoin', result.data.flowcoin);
              vm.$set(vm, 'couponCount', result.data.user_ticket_count);
              vm.$set(vm, 'orderCount', result.data.order_count);
            });
          } else if (result.status === -2) {
            next({name: 'passport:signin'});
            throw result.msg;
          } else {
            next({path: '/404'});
            throw result.msg;
          };
        };
      });
    });
  }
};
</script>
