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

const router = new Router({
  routes
});

export default router;
