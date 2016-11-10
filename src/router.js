import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import shop from './routes/shop';
import service from './routes/service';
import coupon from './routes/coupon';
import news from './routes/news';
import passport from './routes/passport';
import market from './routes/market';
import ucenter from './routes/ucenter';
import {Weixin} from './methods';

const routes = [
  {
    path: '/index',
    alias: ['/'],
    name: 'index',
    component: r => System.import('./components/index/Index.vue')
  },
  {
    path: '/search/:keyword?',
    name: 'search',
    component: r => System.import('./components/search/Index.vue')
  },
  ...shop,
  ...service,
  ...coupon,
  ...news,
  ...passport,
  ...market,
  ...ucenter,
  {
    path: '*',
    component: r => System.import('./components/404/Index.vue')
  }
];

if (window.location.hostname === 'h5.uhuibao.com' || window.location.hostname === 'tw.uhuibao.com') {
  const scriptNode = document.createElement('script');
  window.document.head.appendChild(scriptNode);
  scriptNode.src = '//hm.baidu.com/hm.js?7de78c62a11f49220a48261c9326ec7d';
};

const router = new Router({routes});

// 每次路由完成之后完成进行一次百度统计
router.afterEach((vm) => {
  window._hmt.push(['_trackPageview', '/v2/#' + vm.fullPath]);
  Weixin.updateShare();
});

export default router;
