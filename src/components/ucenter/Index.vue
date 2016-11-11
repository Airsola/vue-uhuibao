<style lang="stylus" scoped>
.user-info {
  position: relative;
  & > dl {
    height: .5rem;
    & > dt {
      position: absolute;
      & > a {
        & > img {
          width: 100%;
          height: 100%;
        }
      }
    }
    & > dd {
      margin-left: .7rem;
      position: relative;
      min-height: .5rem;
      & > h4 {
        font-size: .16rem;
        display: block;
        & > a {
          color: #222;
        }
      }
      & > span {
        color: #222;
        bottom: 0;
        left: 0;
        font-size: .13rem;
      }
      & > a {
        color: #bfbfbf;
        right: 0;
        top: 0;
        font-size: .12rem;
        &:after {
          font-size: .1rem;
          color: #ddd;
          margin-left: .05rem;
          transform: rotate(180deg);
        }
      }
    }
  }
}
.user-info>dl>dt,.user-info>dl>dt>a {
  width: .5rem;
  height: .5rem;
}
.user-info>dl>dt>a,.user-info>dl>dt>a>img {
  display: block;
  border-radius: 50%;
  overflow: hidden;
}
.user-info>dl>dd>span,.user-info>dl>dd>a {
  position: absolute;
}
.task-list {
  & > ul {
    & > li {
      position: relative;
      line-height: .18rem;
      padding: 0 .45rem;
      border-bottom: solid 1px #f5f5f5;
      &:last-of-type {
        border-bottom: none;
      }
      & > a {
        padding: .16rem 0;
        display: block;
        position: relative;
        & > b {
          &.new-coupon {
            height: .2rem;
            line-height: .2rem;
            padding: 0 .1rem;
            border-radius: .1rem;
            background-color: #ff7800;
            color: #fff;
            font-size: .12rem;
            position: absolute;
            right: 0;
            top: 50%;
            margin-top: -.1rem;
          }
          &.new-order {
            width: .1rem;
            height: .1rem;
            border-radius: 50%;
            background-color: #ff7800;
            display: block;
            position: absolute;
            right: 0;
            top: 50%;
            margin-top: -.05rem;
          }
        }
      }
      &:before {
        font-size: .16rem;
        line-height: 1em;
        color: #2cbcff;
        display: block;
        position: absolute;
        left: .2rem;
        top: 50%;
        margin-top: -.08rem;
      }
      &:after {
        font-size: .14rem;
        color: #ddd;
        display: block;
        position: absolute;
        right: .175rem;
        top: 50%;
        margin-top: -.08rem;
      }
    }
  }
}
.task-list>ul>li,.task-list>ul>li>a {
  color: #222;
  font-size: .14rem;
}
.signout {
  & > a {
    line-height: .48rem;
    font-size: .14rem;
    text-align: center;
    display: block;
  }
}
</style>
<template>
  <layout>
    <layout-header :title="lang.title"></layout-header>
    <layout-body :style="{paddingBottom: '.5rem'}">
      <div class="ui-card ui-card-padd ui-card-underline ui-card-mar-btm">
        <div class="user-info">
          <dl>
            <dt>
              <a>
                <img :src="userAvatar">
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
      </div>
      <div class="task-list ui-card ui-card-overline ui-card-underline ui-card-mar-btm">
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
      <div class="signout ui-card ui-card-overline ui-card-underline ui-card-mar-btm">
        <a v-if="signouting">{{lang.signouting}}</a>
        <a v-else @click="signoutAction">{{lang.signout}}</a>
      </div>
      <div class="clearfix"></div>
    </layout-body>
    <layout-footer></layout-footer>
  </layout>
</template>

<script>
import {Layout, LayoutHeader, LayoutBody, LayoutFooter} from '../layout';
import {USER_AUTH} from 'config';
import {Http, translate} from 'methods';
import avatarImg from 'assets/avatar.jpg';

const language = translate({
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
    signout: '退出登录',
    signouting: '注销中…',
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
    signout: '退出登錄',
    signouting: '註銷中…',
    logoutSuccess: '登錄註銷成功，即將跳轉到首頁'
  }
});

export default {
  components: {
    Layout,
    LayoutHeader,
    LayoutBody,
    LayoutFooter
  },
  data() {
    return {
      userAvatar: '',
      userNickName: '',
      flowCoin: 0,
      couponCount: 0,
      orderCount: 0,
      signouting: false,
      lang: language
    };
  },
  beforeRouteEnter(to, from, next) {
    if (USER_AUTH.user_auth === false) {
      next({name: 'passport:signin'});
    } else {
      Http.fetch('api/get_user_info').then(response => {
        Http.resolve(response).then(result => {
          if (result.status === 1) {
            next(vm => {
              vm.$set(vm, 'userAvatar', result.data.user_head_url || avatarImg);
              vm.$set(vm, 'userNickName', result.data.user_nick);
              vm.$set(vm, 'flowCoin', result.data.flowcoin);
              vm.$set(vm, 'couponCount', result.data.user_ticket_count);
              vm.$set(vm, 'orderCount', result.data.order_count);
            });
          } else if (result.status === -2) {
            next({name: 'passport:signin'});
            throw new Error(result.msg);
          };
        }).catch(error => {
          next({path: '/404'});
          throw new Error(error);
        });
      });
    };
  },
  methods: {
    signoutAction() {
      this.signouting = true;

      Http.fetch('api/logout').then(response => {
        this.signouting = false;

        Http.resolve(response).then(result => {
          this.$notice(language.logoutSuccess, {
            container: this.$el,
            onShow: () => {
              this.$root.$emit('blur:toggle');
              USER_AUTH.user_auth = false;
            },
            onHide: () => {
              this.$root.$emit('blur:toggle');
              this.$router.replace({
                name: 'index'
              });
            }
          });
        }).catch(error => {
          throw new Error(error);
        });
      });
    }
  }
};
</script>
